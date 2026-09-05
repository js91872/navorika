import test from 'node:test';
import assert from 'node:assert/strict';
import { classifyPageDimensions, analyzePdfPages, parsePdfPageSizes } from './pdfPageSize.ts';
import { PDFDocument } from 'pdf-lib';

test('pdfPageSize: recognizes standard A4 portrait page dimensions', () => {
  const res = classifyPageDimensions(595.28, 841.89);

  assert.equal(res.isStandardSize, true);
  assert.equal(res.matchedStandardSize, 'A4 (Portrait)');
  assert.equal(res.orientation, 'Portrait');
  assert.equal(res.widthMm, 210);
  assert.equal(res.heightMm, 297);
  assert.equal(res.widthIn, 8.27);
  assert.equal(res.heightIn, 11.69);
});

test('pdfPageSize: recognizes standard Letter portrait page dimensions', () => {
  const res = classifyPageDimensions(612, 792);

  assert.equal(res.isStandardSize, true);
  assert.equal(res.matchedStandardSize, 'Letter (Portrait)');
  assert.equal(res.orientation, 'Portrait');
  assert.equal(res.widthIn, 8.5);
  assert.equal(res.heightIn, 11);
  assert.equal(res.widthMm, 215.9);
  assert.equal(res.heightMm, 279.4);
});

test('pdfPageSize: recognizes landscape orientation correctly', () => {
  // Letter in Landscape: width 792 pt, height 612 pt
  const res = classifyPageDimensions(792, 612);

  assert.equal(res.isStandardSize, true);
  assert.equal(res.matchedStandardSize, 'Letter (Landscape)');
  assert.equal(res.orientation, 'Landscape');
  assert.equal(res.widthIn, 11);
  assert.equal(res.heightIn, 8.5);
});

test('pdfPageSize: identifies custom non-standard dimensions', () => {
  const res = classifyPageDimensions(500, 500);

  assert.equal(res.isStandardSize, false);
  assert.equal(res.matchedStandardSize, 'Custom');
  assert.equal(res.orientation, 'Square');
});

test('pdfPageSize: detects multi-page PDFs with uniform sizes', () => {
  const analysis = analyzePdfPages([
    { width: 595.28, height: 841.89 },
    { width: 595.28, height: 841.89 },
    { width: 595.28, height: 841.89 },
  ]);

  assert.equal(analysis.valid, true);
  assert.equal(analysis.pageCount, 3);
  assert.equal(analysis.isUniformSize, true);
  assert.equal(analysis.differingPagesNote, '');
  assert.ok(analysis.summary.includes('All pages uniformly A4 (Portrait)'));
});

test('pdfPageSize: detects multi-page PDFs with mixed / differing sizes', () => {
  const analysis = analyzePdfPages([
    { width: 595.28, height: 841.89, pageNumber: 1 }, // A4
    { width: 612, height: 792, pageNumber: 2 }, // Letter
  ]);

  assert.equal(analysis.valid, true);
  assert.equal(analysis.pageCount, 2);
  assert.equal(analysis.isUniformSize, false);
  assert.ok(analysis.differingPagesNote.includes('1 page differs from Page 1 dimensions'));
  assert.ok(analysis.summary.includes('Mixed page dimensions detected'));
});

test('pdfPageSize: end-to-end PDF parse test with pdf-lib', async () => {
  const doc = await PDFDocument.create();
  doc.addPage([595.28, 841.89]); // A4
  doc.addPage([841.89, 1190.55]); // A3

  const bytes = await doc.save();
  const res = await parsePdfPageSizes(bytes);

  assert.equal(res.valid, true);
  assert.equal(res.pageCount, 2);
  assert.equal(res.isUniformSize, false);
  assert.equal(res.pages[0].matchedStandardSize, 'A4 (Portrait)');
  assert.equal(res.pages[1].matchedStandardSize, 'A3 (Portrait)');
});

test('pdfPageSize: handles empty or invalid PDF input safely', async () => {
  const empty = await parsePdfPageSizes(new Uint8Array(0));
  assert.equal(empty.valid, false);
  assert.ok(empty.error);

  const corrupted = await parsePdfPageSizes(new Uint8Array([5, 4, 3, 2, 1]));
  assert.equal(corrupted.valid, false);
  assert.ok(corrupted.error);
});
