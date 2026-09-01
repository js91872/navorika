import { copyFile, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { corelBinaryCandidates, firstAvailable, getCorelCapabilities } from './capabilities';
import { runProcess } from './process';
import { CorelConversionError, safeOutputStem, sanitizeSvg } from './validation';
import type { CorelInputFormat, CorelOutputFormat, ServerConversionKind } from './types';
import { CORELDRAW_MAX_PDF_PAGES } from './formats';

const outputMimes: Record<CorelOutputFormat, string> = { pdf: 'application/pdf', svg: 'image/svg+xml', eps: 'application/postscript', png: 'image/png', jpg: 'image/jpeg' };

async function officeToPdf(input: string, directory: string) {
  const binary = await firstAvailable(corelBinaryCandidates.libreoffice);
  if (!binary) throw new CorelConversionError('LibreOffice is not installed on this server, so this conversion is temporarily unavailable.', 503);
  await runProcess(binary, ['--headless', '--nologo', '--nodefault', '--nolockcheck', '--nofirststartwizard', '--convert-to', 'pdf', '--outdir', directory, input], directory);
  const expected = join(directory, `${input.split('/').pop()!.replace(/\.[^.]+$/, '')}.pdf`);
  try { await readFile(expected); return expected; } catch { throw new CorelConversionError('LibreOffice did not produce a PDF. The input may be damaged, encrypted, or unsupported.', 422); }
}

async function pdfToOutput(pdfPath: string, output: CorelOutputFormat, directory: string, quality: number, resolution: number) {
  if (output === 'pdf') return pdfPath;
  const base = join(directory, `output-${randomUUID()}`);
  if (output === 'svg') { const binary = await firstAvailable(corelBinaryCandidates.pdftocairo); if (!binary) throw new CorelConversionError('PDF-to-SVG support is unavailable on this server.', 503); const path = `${base}.svg`; await runProcess(binary, ['-svg', '-f', '1', '-l', '1', pdfPath, path], directory); return path; }
  if (output === 'eps') { const binary = await firstAvailable(corelBinaryCandidates.pdftops); if (!binary) throw new CorelConversionError('PDF-to-EPS support is unavailable on this server.', 503); const path = `${base}.eps`; await runProcess(binary, ['-eps', '-f', '1', '-l', '1', pdfPath, path], directory); return path; }
  const binary = await firstAvailable(corelBinaryCandidates.pdftocairo); if (!binary) throw new CorelConversionError('PDF raster export is unavailable on this server.', 503);
  const prefix = base; const flag = output === 'png' ? '-png' : '-jpeg'; const path = `${prefix}-1.${output}`;
  const args = [flag, '-singlefile', '-f', '1', '-l', '1', '-r', String(Math.min(600, Math.max(72, resolution)))];
  if (output === 'jpg') args.push('-jpegopt', `quality=${Math.min(100, Math.max(20, quality))}`);
  args.push(pdfPath, prefix); await runProcess(binary, args, directory); return path;
}

async function postscriptToPdf(input: string, directory: string) {
  const head = (await readFile(input)).subarray(0, 8).toString('ascii');
  if (head.startsWith('%PDF-')) return input;
  const binary = await firstAvailable(corelBinaryCandidates.ghostscript); if (!binary) throw new CorelConversionError('Ghostscript is not installed, so AI/EPS preparation is unavailable.', 503);
  const output = join(directory, `output-${randomUUID()}.pdf`);
  await runProcess(binary, ['-dSAFER', '-dBATCH', '-dNOPAUSE', '-dQUIET', '-sDEVICE=pdfwrite', `-sOutputFile=${output}`, input], directory);
  return output;
}

async function assertSafePdf(path: string) {
  const { PDFDocument } = await import('pdf-lib');
  try { const document = await PDFDocument.load(await readFile(path), { updateMetadata: false }); if (document.isEncrypted) throw new CorelConversionError('Encrypted PDFs are not supported.'); if (document.getPageCount() > CORELDRAW_MAX_PDF_PAGES) throw new CorelConversionError(`PDF output exceeds the ${CORELDRAW_MAX_PDF_PAGES}-page limit.`); for (const page of document.getPages()) { const { width, height } = page.getSize(); if (width > 20_000 || height > 20_000) throw new CorelConversionError('A PDF page exceeds the safe dimension limit.'); } } catch (error) { if (error instanceof CorelConversionError) throw error; throw new CorelConversionError('The PDF is malformed, encrypted, or unsupported.'); }
}

export async function convertCorelFile(options: { kind: ServerConversionKind; inputPath: string; inputFormat: CorelInputFormat; output: CorelOutputFormat; originalName: string; directory: string; quality?: number; resolution?: number }) {
  const { kind, inputPath, inputFormat, output, originalName, directory } = options;
  const capabilities = await getCorelCapabilities();
  let source = inputPath;
  if (inputFormat === 'svg') { const cleaned = sanitizeSvg(await readFile(inputPath, 'utf8')); await writeFile(inputPath, cleaned); if (output === 'svg') source = inputPath; else source = await officeToPdf(inputPath, directory); }
  else if (inputFormat === 'doc' || inputFormat === 'docx') source = await officeToPdf(inputPath, directory);
  else if (inputFormat === 'cdr') { if (!capabilities.cdrRead) throw new CorelConversionError('This server does not currently have a verified CDR-reading backend.', 503); source = await officeToPdf(inputPath, directory); }
  else if (inputFormat === 'ai' || inputFormat === 'eps') source = await postscriptToPdf(inputPath, directory);
  else if (inputFormat === 'pdf') source = inputPath;
  if (!(inputFormat === 'svg' && output === 'svg')) await assertSafePdf(source);
  const finalPath = inputFormat === 'svg' && output === 'svg' ? source : await pdfToOutput(source, output, directory, options.quality ?? 90, options.resolution ?? 150);
  const stablePath = join(directory, `${safeOutputStem(originalName)}-coreldraw-ready.${output}`);
  if (finalPath !== stablePath) await copyFile(finalPath, stablePath);
  return { path: stablePath, fileName: stablePath.split('/').pop()!, mime: outputMimes[output], note: output === 'svg' || output === 'eps' ? 'Vector export contains the first page only.' : kind === 'cdr-viewer' ? 'Preview generated through the available CDR import backend.' : undefined };
}
