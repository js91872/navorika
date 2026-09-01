import assert from 'node:assert/strict';
import test from 'node:test';
import { access, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { Document, Packer, Paragraph } from 'docx';
import JSZip from 'jszip';
import { PDFDocument } from 'pdf-lib';
import { assertSafeZipArchive } from './archive-validation';
import { getCorelCapabilities } from './capabilities';
import { convertCorelFile } from './conversion-pipeline';
import { CORELDRAW_MAX_UPLOAD_BYTES } from './formats';
import { withCorelJob } from './job-manager';
import { runProcess } from './process';
import { vectorizeRgbaToSvg } from './raster-vectorizer';
import { assertCorelUpload, detectCdrVersion, safeOutputStem, sanitizeSvg } from './validation';

const mockFile = (name: string, type: string, bytes: Uint8Array) => ({ name, type, size: bytes.length });

test('validates extension, MIME, size, and magic bytes without trusting one signal', () => {
  const pdf = new TextEncoder().encode('%PDF-1.7\n'); assert.doesNotThrow(() => assertCorelUpload(mockFile('art.pdf','application/pdf',pdf), 'pdf', pdf));
  assert.throws(() => assertCorelUpload(mockFile('art.pdf','image/png',pdf), 'pdf', pdf), /MIME/);
  assert.throws(() => assertCorelUpload(mockFile('art.pdf','application/pdf',new Uint8Array([1,2,3])), 'pdf', new Uint8Array([1,2,3])), /signature/);
  assert.throws(() => assertCorelUpload({ name:'art.pdf',type:'application/pdf',size:CORELDRAW_MAX_UPLOAD_BYTES+1 }, 'pdf', pdf), /15 MB/);
});

test('rejects active SVG and preserves safe vector markup', () => {
  assert.equal(sanitizeSvg('<svg xmlns="http://www.w3.org/2000/svg"><path d="M0 0h1"/></svg>').includes('<path'), true);
  assert.throws(() => sanitizeSvg('<svg><script>alert(1)</script></svg>'), /active/);
  assert.throws(() => sanitizeSvg('<svg><image href="https://example.com/a.png"/></svg>'), /external/);
});

test('detects CDR RIFF and ZIP families and rejects malformed input', () => {
  const riff = new Uint8Array(16); riff.set(new TextEncoder().encode('RIFF'),0); riff.set(new TextEncoder().encode('CDRF'),8); assert.equal(detectCdrVersion(riff).version, 'CorelDRAW X5');
  assert.equal(detectCdrVersion(new Uint8Array([0x50,0x4b,0x03,0x04])).container, 'ZIP-based CDR');
  assert.throws(() => detectCdrVersion(new Uint8Array([1,2,3,4])), /supported/);
});

test('sanitizes injected filenames and vectorizes pixels into genuine SVG paths', () => {
  assert.equal(safeOutputStem('../../evil; touch owned.ai'), '..-..-evil-touch-owned');
  const pixels = new Uint8ClampedArray([0,0,0,255,255,255,255,255,255,0,0,255,0,0,0,0]);
  const svg = vectorizeRgbaToSvg(pixels,2,2,{colors:2,removeWhite:true,outputWidth:200,outputHeight:200}); assert.match(svg, /^<svg/); assert.match(svg, /<path/); assert.doesNotMatch(svg, /#ffffff/);
});

test('always removes isolated temporary job directories after success and failure', async () => {
  let successful = ''; await withCorelJob(async (directory) => { successful = directory; await writeFile(join(directory,'file.txt'),'x'); }); await assert.rejects(() => access(successful));
  let failed = ''; await assert.rejects(() => withCorelJob(async (directory) => { failed = directory; throw new Error('expected'); }), /expected/); await assert.rejects(() => access(failed));
});

test('terminates processes that exceed their conversion timeout', async () => {
  await assert.rejects(() => runProcess(process.execPath, ['-e','setTimeout(()=>{},1000)'], '/tmp', 30), /processing limit/);
});

test('rejects traversal and excessive expansion in ZIP-based inputs', async () => {
  const traversal = new JSZip(); traversal.file('../outside.txt','x');
  const traversalBytes = new Uint8Array(await traversal.generateAsync({ type:'arraybuffer' }));
  await assert.rejects(() => assertSafeZipArchive(traversalBytes), /unsafe path/);
  const expanded = new JSZip(); expanded.file('huge.xml','A'.repeat(26 * 1024 * 1024));
  const expandedBytes = new Uint8Array(await expanded.generateAsync({ type:'arraybuffer',compression:'DEFLATE' }));
  await assert.rejects(() => assertSafeZipArchive(expandedBytes), /expanded-size limit|compression ratio/);
});

test('rejects PDF jobs above the page limit', async () => {
  const pdf = await PDFDocument.create(); for (let index=0; index<51; index+=1) pdf.addPage([100,100]);
  await withCorelJob(async (directory) => { const input=join(directory,'many.pdf'); await writeFile(input,await pdf.save()); await assert.rejects(() => convertCorelFile({kind:'pdf-to-corel',inputPath:input,inputFormat:'pdf',output:'pdf',originalName:'many.pdf',directory}), /50-page limit/); });
});

test('creates genuine first-page SVG and EPS from PDF when Poppler is available', async (context) => {
  const capabilities = await getCorelCapabilities(); if (!capabilities.pdfToSvg || !capabilities.pdfToEps) { context.skip('Poppler exporters not installed'); return; }
  const pdf = await PDFDocument.create(); pdf.addPage([200,100]);
  await withCorelJob(async (directory) => { const input=join(directory,'vector.pdf'); await writeFile(input,await pdf.save()); const svg=await convertCorelFile({kind:'pdf-to-corel',inputPath:input,inputFormat:'pdf',output:'svg',originalName:'vector.pdf',directory}); const eps=await convertCorelFile({kind:'pdf-to-corel',inputPath:input,inputFormat:'pdf',output:'eps',originalName:'vector.pdf',directory}); const {readFile}=await import('node:fs/promises'); assert.match(await readFile(svg.path,'utf8'),/<svg[\s>]/); assert.match(await readFile(eps.path,'utf8'),/^%!PS-Adobe/); });
});

test('converts DOCX to a genuine PDF when LibreOffice is available', async (context) => {
  const capabilities = await getCorelCapabilities(); if (!capabilities.docxToPdf) { context.skip('LibreOffice not installed'); return; }
  const document = new Document({ sections: [{ children: [new Paragraph('CorelDRAW conversion fixture')] }] }); const blob = await Packer.toBlob(document);
  await withCorelJob(async (directory) => { const input = join(directory,'fixture.docx'); await writeFile(input,new Uint8Array(await blob.arrayBuffer())); const result = await convertCorelFile({ kind:'word-to-corel',inputPath:input,inputFormat:'docx',output:'pdf',originalName:'fixture.docx',directory }); const bytes = await import('node:fs/promises').then(({readFile}) => readFile(result.path)); assert.equal(bytes.subarray(0,5).toString('ascii'),'%PDF-'); });
});

test('capability endpoint is explicitly nonindexable', async () => {
  const { GET } = await import('../../../app/api/coreldraw/capabilities/route'); const response = await GET(); assert.equal(response.headers.get('x-robots-tag'),'noindex, nofollow, noarchive');
});
