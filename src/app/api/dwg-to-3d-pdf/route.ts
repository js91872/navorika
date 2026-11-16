import { NextRequest, NextResponse } from 'next/server';
import { access, mkdtemp, mkdir, readdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { promisify } from 'node:util';
import { execFile } from 'node:child_process';
import { assertValidPdfOutput } from '@/lib/converters/step-3dpdf/validation';
import { getAsymptoteBinaryPath } from '@/lib/converters/step-3dpdf/capabilities';

export const runtime = 'nodejs';
export const maxDuration = 120;
const run = promisify(execFile);
const LIMIT = 20 * 1024 * 1024;
const importer = () => process.env.ODA_FILE_CONVERTER_PATH || process.env.LIBREDWG_READ_PATH || null;
async function isExecutable(path: string | null): Promise<boolean> {
  if (!path || !path.startsWith('/')) return false;
  return access(path).then(() => true).catch(() => false);
}

export async function GET() {
  return NextResponse.json({
    available: Boolean(await getAsymptoteBinaryPath()),
    dwgAvailable: Boolean(await isExecutable(importer()) && await getAsymptoteBinaryPath()),
    formats: ['DWG', 'DXF'],
    maxBytes: LIMIT,
    note: 'Supports true 3D mesh entities (3DFACE, MESH and polyface). Native ACIS solids are not supported.',
  }, { headers: { 'Cache-Control': 'no-store' } });
}

export async function POST(request: NextRequest) {
  let dir: string | null = null;
  try {
    const data = await request.formData();
    const file = data.get('file');
    if (!(file instanceof File)) return NextResponse.json({ error: 'Select a DWG or DXF file.' }, { status: 400 });
    const ext = file.name.toLowerCase().match(/\.(dwg|dxf)$/)?.[1];
    if (!ext || !file.size || file.size > LIMIT) return NextResponse.json({ error: 'Upload a nonempty DWG or DXF file up to 20 MB.' }, { status: 400 });
    if (!/^[a-zA-Z0-9 _().-]{1,160}$/.test(file.name)) return NextResponse.json({ error: 'Use a simple filename without special characters.' }, { status: 400 });
    const asy = await getAsymptoteBinaryPath();
    if (!asy) return NextResponse.json({ error: '3D PDF compiler is unavailable on this server.' }, { status: 503 });
    if (ext === 'dwg' && !await isExecutable(importer())) return NextResponse.json({ error: 'DWG importer is not configured. The administrator must configure an authorized DWG importer.', }, { status: 503 });
    dir = await mkdtemp(join(tmpdir(), 'navorika-dwg-'));
    const input = join(dir, 'source');
    const output = join(dir, 'converted');
    await mkdir(input);
    await mkdir(output);
    const inputFile = join(input, 'model.' + ext);
    await writeFile(inputFile, Buffer.from(await file.arrayBuffer()));
    let dxf = inputFile;
    if (ext === 'dwg') {
      if (process.env.ODA_FILE_CONVERTER_PATH) {
        await run(process.env.ODA_FILE_CONVERTER_PATH, [input, output, 'ACAD2018', 'DXF', '0', '1', '*.dwg'], { timeout: 60000, maxBuffer: 1024 * 1024 });
        const results = await readdir(output);
        const name = results.find((n) => n.toLowerCase().endsWith('.dxf'));
        if (!name) throw new Error('DWG importer did not produce a DXF model.');
        dxf = join(output, name);
      } else if (process.env.LIBREDWG_READ_PATH) {
        // External LibreDWG converter; operators must review redistribution and service licensing.
        dxf = join(output, 'model.dxf');
        await run(process.env.LIBREDWG_READ_PATH, ['-O', 'DXF', '-o', dxf, inputFile], { timeout: 60000, maxBuffer: 1024 * 1024 });
      }
      if (!(await stat(dxf).catch(() => null))?.size) throw new Error('DWG conversion produced an empty DXF file.');
    }
    const script = join(process.cwd(), 'src/lib/converters/dwg-3dpdf/dxf-to-obj.py');
    const { stdout: meshOutput } = await run(process.env.DWG_PYTHON_PATH ?? 'python3', [script, dxf, join(dir, 'model.obj')], { timeout: 45000, maxBuffer: 1024 * 1024 });
    const geometry = JSON.parse(meshOutput) as { center: number[]; diagonal: number };
    if (!Array.isArray(geometry.center) || geometry.center.length !== 3 || !Number.isFinite(geometry.diagonal)) throw new Error('Invalid 3D model bounds.');
    const [x,y,z] = geometry.center;
    const d = Math.max(geometry.diagonal,1);
    if (![x,y,z].every(Number.isFinite)) throw new Error('Invalid model coordinates.');
    const scene = `settings.outformat="pdf";
settings.prc=true;
settings.render=0;
import three;
import obj;
size(500);
currentprojection=perspective(camera=(${x+1.25*d},${y+1.25*d},${z+0.95*d}),up=Z,target=(${x},${y},${z}));
obj model=obj("model.obj",true,lightgray);
draw(model);
`;
    await writeFile(join(dir, 'scene.asy'), scene);
    await run(asy, ['-f','pdf','-render=0','scene.asy'], { cwd: dir, timeout: 60000, maxBuffer: 1024 * 1024 });
    const pdf = await readFile(join(dir, 'scene.pdf'));
    assertValidPdfOutput(pdf);
    const safeName = file.name.replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '-').slice(0,90);
    return new NextResponse(new Uint8Array(pdf), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${safeName}-3d.pdf"`,
        'Cache-Control': 'no-store',
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Conversion failed';
    return NextResponse.json({ error: message.slice(0,500) }, { status: 422 });
  } finally {
    if (dir) await rm(dir, { recursive: true, force: true }).catch(() => undefined);
  }
}
