import test from 'node:test';
import assert from 'node:assert/strict';
import { calculatePrintBleed } from './printBleed.ts';

test('printBleed: standard A4 with 3mm commercial print bleed', () => {
  const res = calculatePrintBleed({
    finishedWidth: 210,
    finishedHeight: 297,
    bleedPerEdge: 3,
    unit: 'mm',
  });

  assert.equal(res.valid, true);
  assert.equal(res.documentWidth, 216);
  assert.equal(res.documentHeight, 303);
  assert.equal(res.totalAddedWidth, 6);
  assert.equal(res.totalAddedHeight, 6);
  assert.equal(res.finishedArea, 62370);
  assert.equal(res.bleedInclusiveArea, 65448);
  assert.equal(res.addedBleedArea, 3078);
  assert.equal(res.unit, 'mm');
  assert.ok(res.dimensionsSummary.includes('216 × 303 mm'));
});

test('printBleed: zero bleed returns finished dimensions with zero added bleed area', () => {
  const res = calculatePrintBleed({
    finishedWidth: 210,
    finishedHeight: 297,
    bleedPerEdge: 0,
    unit: 'mm',
  });

  assert.equal(res.valid, true);
  assert.equal(res.documentWidth, 210);
  assert.equal(res.documentHeight, 297);
  assert.equal(res.totalAddedWidth, 0);
  assert.equal(res.totalAddedHeight, 0);
  assert.equal(res.finishedArea, 62370);
  assert.equal(res.bleedInclusiveArea, 62370);
  assert.equal(res.addedBleedArea, 0);
});

test('printBleed: imperial US Letter with 0.125 in (1/8th inch) bleed', () => {
  const res = calculatePrintBleed({
    finishedWidth: 8.5,
    finishedHeight: 11,
    bleedPerEdge: 0.125,
    unit: 'in',
  });

  assert.equal(res.valid, true);
  assert.equal(res.documentWidth, 8.75);
  assert.equal(res.documentHeight, 11.25);
  assert.equal(res.totalAddedWidth, 0.25);
  assert.equal(res.totalAddedHeight, 0.25);
  assert.equal(res.finishedArea, 93.5);
  assert.equal(res.bleedInclusiveArea, 98.438);
  assert.equal(res.addedBleedArea, 4.938);
  assert.equal(res.unit, 'in');
});

test('printBleed: rejects negative bleed allowance safely without NaN or Infinity', () => {
  const res = calculatePrintBleed({
    finishedWidth: 210,
    finishedHeight: 297,
    bleedPerEdge: -3,
    unit: 'mm',
  });

  assert.equal(res.valid, false);
  assert.ok(res.error.includes('Bleed margin cannot be negative'));
  assert.equal(Number.isFinite(res.documentWidth), true);
  assert.equal(Number.isFinite(res.finishedArea), true);
  assert.equal(Number.isNaN(res.addedBleedArea), false);
});

test('printBleed: rejects zero or negative finished dimensions safely', () => {
  const zeroRes = calculatePrintBleed({
    finishedWidth: 0,
    finishedHeight: 297,
    bleedPerEdge: 3,
  });
  assert.equal(zeroRes.valid, false);
  assert.ok(zeroRes.error.includes('must be positive numbers'));

  const negRes = calculatePrintBleed({
    finishedWidth: -100,
    finishedHeight: -200,
    bleedPerEdge: 3,
  });
  assert.equal(negRes.valid, false);
  assert.ok(negRes.error.includes('must be positive numbers'));
});

test('printBleed: rejects non-finite and invalid inputs safely', () => {
  const nanRes = calculatePrintBleed({
    finishedWidth: NaN,
    finishedHeight: 297,
    bleedPerEdge: 3,
  });
  assert.equal(nanRes.valid, false);
  assert.ok(nanRes.error.includes('valid numerical values'));

  const infRes = calculatePrintBleed({
    finishedWidth: 210,
    finishedHeight: Infinity,
    bleedPerEdge: 3,
  });
  assert.equal(infRes.valid, false);
  assert.ok(infRes.error.includes('valid numerical values'));
});
