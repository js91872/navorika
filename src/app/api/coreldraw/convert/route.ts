import { readFile, stat, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import { convertCorelFile } from '@/lib/converters/coreldraw/conversion-pipeline';
import { withCorelJob } from '@/lib/converters/coreldraw/job-manager';
import { rateLimit } from '@/lib/rateLimit';
import { assertCorelUpload, CorelConversionError } from '@/lib/converters/coreldraw/validation';
import type { CorelInputFormat, CorelOutputFormat, ServerConversionKind } from '@/lib/converters/coreldraw/types';
import { assertSafeZipArchive } from '@/lib/converters/coreldraw/archive-validation';
import { CORELDRAW_MAX_OUTPUT_BYTES } from '@/lib/converters/coreldraw/formats';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const kinds = new Set<ServerConversionKind>(['word-to-corel','pdf-to-corel','svg-to-corel','ai-to-corel','eps-to-corel','cdr-viewer','cdr-to-pdf','cdr-to-svg','cdr-to-png','cdr-to-jpg','cdr-to-eps']);
const outputs = new Set<CorelOutputFormat>(['pdf','svg','eps','png','jpg']);
const rules: Record<ServerConversionKind, { inputs: CorelInputFormat[]; outputs: CorelOutputFormat[] }> = {
  'word-to-corel': { inputs: ['doc','docx'], outputs: ['pdf','svg','eps'] }, 'pdf-to-corel': { inputs: ['pdf'], outputs: ['pdf','svg','eps'] },
  'svg-to-corel': { inputs: ['svg'], outputs: ['svg','pdf','eps'] }, 'ai-to-corel': { inputs: ['ai'], outputs: ['pdf','svg','eps'] }, 'eps-to-corel': { inputs: ['eps'], outputs: ['pdf','svg','eps'] },
  'cdr-viewer': { inputs: ['cdr'], outputs: ['pdf','svg','png'] }, 'cdr-to-pdf': { inputs: ['cdr'], outputs: ['pdf'] }, 'cdr-to-svg': { inputs: ['cdr'], outputs: ['svg'] },
  'cdr-to-png': { inputs: ['cdr'], outputs: ['png'] }, 'cdr-to-jpg': { inputs: ['cdr'], outputs: ['jpg'] }, 'cdr-to-eps': { inputs: ['cdr'], outputs: ['eps'] },
};

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (!rateLimit(`coreldraw:${ip}`, 10, 60_000).success) return NextResponse.json({ error: 'Too many conversion requests. Please wait one minute and try again.' }, { status: 429, headers: { 'X-Robots-Tag': 'noindex, nofollow, noarchive' } });
  try {
    const form = await request.formData(); const file = form.get('file');
    const kind = String(form.get('kind') ?? '') as ServerConversionKind; const inputFormat = String(form.get('inputFormat') ?? '') as CorelInputFormat; const output = String(form.get('output') ?? '') as CorelOutputFormat;
    if (!(file instanceof File)) throw new CorelConversionError('Choose a file to convert.');
    if (!kinds.has(kind) || !outputs.has(output)) throw new CorelConversionError('Unsupported conversion request.');
    if (!rules[kind].inputs.includes(inputFormat) || !rules[kind].outputs.includes(output)) throw new CorelConversionError('The requested input/output combination is not allowed for this tool.');
    const bytes = new Uint8Array(await file.arrayBuffer()); assertCorelUpload(file, inputFormat, bytes);
    if (inputFormat === 'docx' || (inputFormat === 'cdr' && bytes[0] === 0x50 && bytes[1] === 0x4b)) await assertSafeZipArchive(bytes);
    const converted = await withCorelJob(async (directory) => {
      const inputPath = join(/* turbopackIgnore: true */ directory, `${randomUUID()}.${inputFormat}`); await writeFile(inputPath, bytes);
      const result = await convertCorelFile({ kind, inputPath, inputFormat, output, originalName: file.name, directory, quality: Number(form.get('quality') ?? 90), resolution: Number(form.get('resolution') ?? 150) });
      if ((await stat(result.path)).size > CORELDRAW_MAX_OUTPUT_BYTES) throw new CorelConversionError('The converted output exceeds the 60 MB response limit.', 413);
      return { ...result, bytes: await readFile(result.path) };
    });
    return new Response(converted.bytes, { headers: { 'Content-Type': converted.mime, 'Content-Disposition': `attachment; filename="${converted.fileName}"`, 'Cache-Control': 'no-store', 'X-Conversion-Note': converted.note ?? '', 'X-Robots-Tag': 'noindex, nofollow, noarchive' } });
  } catch (error) {
    const known = error instanceof CorelConversionError; return NextResponse.json({ error: known ? error.message : 'Conversion failed safely. Please verify the file and try again.' }, { status: known ? error.status : 500, headers: { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow, noarchive' } });
  }
}
