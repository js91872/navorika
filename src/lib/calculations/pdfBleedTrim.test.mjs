import test from 'node:test';
import assert from 'node:assert/strict';
import { analyzePageBoxes, parsePdfBleedTrim } from './pdfBleedTrim.ts';
import { PDFDocument } from 'pdf-lib';

test('pdfBleedTrim: default behavior when TrimBox and BleedBox are missing', () => {
  const media = { x: 0, y: 0, width: 595.28, height: 841.89 };
  const res = analyzePageBoxes({ mediaBox: media });

  assert.equal(res.hasExplicitTrimBox, false);
  assert.equal(res.hasExplicitBleedBox, false);
  assert.equal(res.trimWidthPt, 595.28);
  assert.equal(res.trimHeightPt, 841.89);
  assert.equal(res.bleedMarginPt.top, 0);
  assert.equal(res.bleedMarginPt.bottom, 0);
  assert.equal(res.bleedMarginPt.left, 0);
  assert.equal(res.bleedMarginPt.right, 0);
  assert.ok(res.interpretation.includes('Default configuration'));
  assert.ok(res.interpretation.includes('does not prove that visual artwork bleed is missing'));
});

test('pdfBleedTrim: TrimBox equals MediaBox and BleedBox matches TrimBox (0 bleed)', () => {
  const media = { x: 0, y: 0, width: 612, height: 792 };
  const res = analyzePageBoxes({
    mediaBox: media,
    trimBox: media,
    bleedBox: media,
    isTrimBoxExplicit: true,
    isBleedBoxExplicit: true,
  });

  assert.equal(res.hasExplicitTrimBox, true);
  assert.equal(res.hasExplicitBleedBox, true);
  assert.equal(res.hasExtraBleedBoxArea, false);
  assert.equal(res.bleedMarginPt.top, 0);
  assert.equal(res.bleedMarginPt.right, 0);
  assert.ok(res.interpretation.includes('BleedBox dimensions match TrimBox (0 mm bleed margin)'));
});

test('pdfBleedTrim: BleedBox larger than TrimBox (standard 3mm / 8.5 pt bleed)', () => {
  // TrimBox: 210 x 297 mm (595.28 x 841.89 pt) positioned at (9, 9)
  // BleedBox: 595.28 + 18 x 841.89 + 18 at (0, 0) -> 9 pt (~3.17mm) margin on all 4 sides
  const trim = { x: 9, y: 9, width: 595.28, height: 841.89 };
  const bleed = { x: 0, y: 0, width: 613.28, height: 859.89 };
  const media = { x: 0, y: 0, width: 620, height: 870 };

  const res = analyzePageBoxes({
    mediaBox: media,
    trimBox: trim,
    bleedBox: bleed,
    isTrimBoxExplicit: true,
    isBleedBoxExplicit: true,
  });

  assert.equal(res.hasExplicitTrimBox, true);
  assert.equal(res.hasExplicitBleedBox, true);
  assert.equal(res.hasExtraBleedBoxArea, true);
  assert.equal(res.bleedMarginPt.top, 9);
  assert.equal(res.bleedMarginPt.bottom, 9);
  assert.equal(res.bleedMarginPt.left, 9);
  assert.equal(res.bleedMarginPt.right, 9);
  assert.equal(res.bleedMarginMm.top, 3.17);
  assert.ok(res.interpretation.includes('Explicit bleed boxes configured'));
});

test('pdfBleedTrim: explicit TrimBox with missing BleedBox', () => {
  const media = { x: 0, y: 0, width: 612, height: 792 };
  const trim = { x: 18, y: 18, width: 576, height: 756 };

  const res = analyzePageBoxes({
    mediaBox: media,
    trimBox: trim,
    isTrimBoxExplicit: true,
    isBleedBoxExplicit: false,
  });

  assert.equal(res.hasExplicitTrimBox, true);
  assert.equal(res.hasExplicitBleedBox, false);
  assert.ok(res.interpretation.includes('TrimBox is explicitly defined, but no BleedBox is declared'));
});

test('pdfBleedTrim: handles malformed geometry safely without NaN or Infinity', () => {
  const res = analyzePageBoxes({
    mediaBox: { x: NaN, y: -50, width: -100, height: Infinity },
    trimBox: { x: null, y: undefined, width: 'invalid', height: -20 },
  });

  assert.equal(Number.isFinite(res.trimWidthPt), true);
  assert.equal(Number.isFinite(res.trimHeightPt), true);
  assert.equal(Number.isFinite(res.trimWidthMm), true);
  assert.equal(Number.isFinite(res.trimHeightMm), true);
  assert.equal(res.trimWidthPt >= 0, true);
  assert.equal(res.trimHeightPt >= 0, true);
});

test('pdfBleedTrim: parses genuine PDF document with page boxes', async () => {
  const doc = await PDFDocument.create();
  const page = doc.addPage([600, 800]);
  page.setTrimBox(10, 10, 580, 780);
  page.setBleedBox(5, 5, 590, 790);

  const pdfBytes = await doc.save();
  const result = await parsePdfBleedTrim(pdfBytes);

  assert.equal(result.valid, true);
  assert.equal(result.pageCount, 1);
  assert.equal(result.pages[0].hasExplicitTrimBox, true);
  assert.equal(result.pages[0].hasExplicitBleedBox, true);
  assert.equal(result.pages[0].trimWidthPt, 580);
  assert.equal(result.pages[0].trimHeightPt, 780);
  assert.equal(result.pages[0].bleedMarginPt.left, 5);
  assert.equal(result.pages[0].bleedMarginPt.bottom, 5);
  assert.equal(result.pages[0].bleedMarginPt.right, 5);
  assert.equal(result.pages[0].bleedMarginPt.top, 5);
});

test('pdfBleedTrim: rejects empty and invalid PDF buffers safely', async () => {
  const emptyRes = await parsePdfBleedTrim(new Uint8Array(0));
  assert.equal(emptyRes.valid, false);
  assert.ok(emptyRes.error);

  const corruptedRes = await parsePdfBleedTrim(new Uint8Array([1, 2, 3, 4, 5]));
  assert.equal(corruptedRes.valid, false);
  assert.ok(corruptedRes.error);
});
