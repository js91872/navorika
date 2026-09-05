import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateImagePrintSize } from './imagePrintSize.ts';

test('image print size: 3000x2400 at 300 PPI yields 10x8 inches and 25.4x20.32 cm', () => {
  const result = calculateImagePrintSize({ widthPixels: 3000, heightPixels: 2400, ppi: 300 });
  assert.equal(result.widthInches, 10);
  assert.equal(result.heightInches, 8);
  assert.equal(result.widthCm, 25.4);
  assert.equal(result.heightCm, 20.32);
});

test('image print size: 1800x1200 at 150 PPI yields 12x8 inches', () => {
  const result = calculateImagePrintSize({ widthPixels: 1800, heightPixels: 1200, ppi: 150 });
  assert.equal(result.widthInches, 12);
  assert.equal(result.heightInches, 8);
  assert.equal(result.widthCm, 30.48);
  assert.equal(result.heightCm, 20.32);
});

test('image print size: zero PPI produces null rather than Infinity', () => {
  const result = calculateImagePrintSize({ widthPixels: 3000, heightPixels: 2400, ppi: 0 });
  assert.equal(result.widthInches, null);
  assert.equal(result.heightInches, null);
  assert.equal(result.widthCm, null);
  assert.equal(result.heightCm, null);
});

test('image print size: negative PPI or negative dimensions return null', () => {
  const negPpi = calculateImagePrintSize({ widthPixels: 3000, heightPixels: 2400, ppi: -300 });
  assert.equal(negPpi.widthInches, null);

  const negDim = calculateImagePrintSize({ widthPixels: -3000, heightPixels: 2400, ppi: 300 });
  assert.equal(negDim.widthInches, null);
});

test('image print size: non-finite inputs return null safely', () => {
  const result = calculateImagePrintSize({ widthPixels: NaN, heightPixels: 2400, ppi: 300 });
  assert.equal(result.widthInches, null);
  assert.equal(result.heightInches, null);
  assert.equal(result.widthCm, null);
  assert.equal(result.heightCm, null);
});
