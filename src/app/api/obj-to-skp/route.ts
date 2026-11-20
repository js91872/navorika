import { chown, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, basename } from 'node:path';
import { spawn } from 'node:child_process';
import { NextResponse } from 'next/server';
import { rateLimit } from '@/lib/rateLimit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
// Fail closed unless the converter has a dedicated, non-root POSIX worker account.
function workerIdentity(): { uid: number; gid: number } | null {
  const rawUid = process.env.OBJ_TO_SKP_WORKER_UID;
  const rawGid = process.env.OBJ_TO_SKP_WORKER_GID;
  if (!rawUid || !rawGid || !/^\d+$/.test(rawUid) || !/^\d+$/.test(rawGid)) return null;
  const uid = Number(rawUid);
  const gid = Number(rawGid);
  if (!Number.isSafeInteger(uid) || !Number.isSafeInteger(gid) || uid < 1 || gid < 1) return null;
  // The parent is currently root-owned under PM2; never spawn another root worker.
  // A non-root parent cannot chown the upload directory or switch to arbitrary accounts.
  if (typeof process.getuid !== 'function' || process.getuid() !== 0) return null;
  return { uid, gid };
}
const enabled = () => process.env.OBJ_TO_SKP_ENABLED === 'true' && workerIdentity() !== null;
const maxSize = 20_000_000;
const script = join(process.cwd(), 'scripts', 'obj-to-skp-server.py');
const python = process.env.OBJ_TO_SKP_PYTHON || '/opt/navorika-obj-skp-venv/bin/python';
const noStore = { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow, noarchive' };
let active = 0;

function fail(message: string, status: number) {
  return NextResponse.json({ error: message }, { status, headers: noStore });
}
function safeName(filename: string) {
  return /^[a-zA-Z0-9_.-]{1,120}$/.test(filename) &&
    filename !== '.' && filename !== '..' && basename(filename) === filename;
}
function execute(directory: string, unitMm: string, worker: { uid: number; gid: number }): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(python, ['-I', script, join(directory, 'model.obj'), join(directory, 'output.skp'), '--unit-mm', unitMm], {
      cwd: directory,
      uid: worker.uid,
      gid: worker.gid,
      stdio: ['ignore', 'ignore', 'pipe'],
      env: { NODE_ENV: process.env.NODE_ENV, PATH: '/usr/bin:/bin', HOME: directory, TMPDIR: directory, PYTHONNOUSERSITE: '1' },
    });
    let stderr = '';
    let settled = false;
    const timer = setTimeout(() => child.kill('SIGKILL'), 30_000);
    child.stderr.on('data', (chunk: Buffer) => { stderr = (stderr + chunk.toString()).slice(-4096); });
    const done = (error?: Error) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      if (error) reject(error);
      else resolve();
    };
    child.on('error', (error) => done(error));
    child.on('close', (code) => done(code === 0 ? undefined : new Error('Converter exited with ' + code + ': ' + stderr)));
  });
}
export function GET() {
  return NextResponse.json({ enabled: enabled(), maxObjBytes: maxSize, supports: ['obj', 'mtl', 'png', 'jpg', 'jpeg'] }, { headers: noStore });
}

export async function POST(request: Request) {
  if (!enabled()) return fail('OBJ to SKP is not yet enabled on this server.', 503);
  const worker = workerIdentity();
  if (!worker) return fail('Conversion worker is not configured.', 503);
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
  if (!rateLimit('obj-skp:' + ip, 3, 60_000).success) return fail('Too many conversions. Try again in one minute.', 429);
  if (active >= 1) return fail('Converter busy. Try again shortly.', 503);
  // Reject chunked/unknown-length request bodies until a streaming byte cap is in place.
  // Nginx must separately enforce client_max_body_size 32m before beta enablement.
  const lengthHeader = request.headers.get('content-length');
  if (!lengthHeader || !/^\d+$/.test(lengthHeader)) return fail('A Content-Length header is required for CAD uploads.', 411);
  const requestBytes = Number(lengthHeader);
  if (!Number.isSafeInteger(requestBytes) || requestBytes > 32_000_000) return fail('Request exceeds the 32 MB limit.', 413);
  active += 1;
  let directory: string | undefined;
  try {
    const form = await request.formData();
    const unitMm = String(form.get('unitMm') || '1000');
    if (!['1', '10', '25.4', '1000'].includes(unitMm)) return fail('Choose a supported model unit.', 400);
    if (form.getAll('obj').length !== 1) return fail('Provide exactly one OBJ model.', 400);
    const obj = form.get('obj');
    if (!(obj instanceof File) || !obj.name.toLowerCase().endsWith('.obj')) return fail('Select one OBJ file.', 400);
    if (obj.size < 1 || obj.size > maxSize) return fail('OBJ must be under 20 MB.', 413);
    const companions = form.getAll('companions');
    if (companions.length > 12 || companions.some(x => !(x instanceof File))) return fail('Upload up to 12 companion files.', 400);
    let total = obj.size;
    const seen = new Set<string>();
    const uploads: { name: string; bytes: Uint8Array }[] = [];
    for (const value of companions) {
      if (!(value instanceof File)) return fail('Invalid companion file.', 400);
      const name = value.name;
      if (!safeName(name) || !/\.(mtl|png|jpe?g)$/i.test(name)) return fail('Companion filenames must be plain MTL/PNG/JPG filenames.', 400);
      if (seen.has(name.toLowerCase())) return fail('Duplicate filenames are not allowed.', 400);
      seen.add(name.toLowerCase());
      if (value.size > 8_000_000) return fail('A companion file exceeds 8 MB.', 413);
      total += value.size;
      if (total > 30_000_000) return fail('Files together exceed 30 MB.', 413);
      uploads.push({ name, bytes: new Uint8Array(await value.arrayBuffer()) });
    }
    directory = await mkdtemp(join(tmpdir(), 'navorika-objskp-'));
    // mkdtemp creates mode 0700; delegate only this disposable workspace.
    // Files remain readable by the worker, and no other host files are writable through it.
    await chown(directory, worker.uid, worker.gid);
    await writeFile(join(directory, 'model.obj'), new Uint8Array(await obj.arrayBuffer()));
    for (const upload of uploads) await writeFile(join(directory, upload.name), upload.bytes, { flag: 'wx' });
    await execute(directory, unitMm, worker);
    const output = await readFile(join(directory, 'output.skp'));
    if (output.length < 100 || output.length > 60_000_000) return fail('Invalid conversion output.', 500);
    const download = obj.name.replace(/\.obj$/i, '').replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 80) || 'model';
    return new Response(new Uint8Array(output), { headers: {
      ...noStore, 'Content-Type': 'application/octet-stream',
      'Content-Disposition': 'attachment; filename="' + download + '.skp"',
    } });
  } catch (error) {
    console.error('OBJ to SKP conversion error:', error instanceof Error ? error.message : 'unknown error');
    return fail('Conversion failed. Check OBJ/MTL links, UVs, units and texture files.', 422);
  } finally {
    active -= 1;
    if (directory) await rm(directory, { recursive: true, force: true }).catch(() => {});
  }
}
