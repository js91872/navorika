import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateImageScaling } from './imageScaling.ts';

test('image scaling: 50% scale reduces dimensions by half and pixel area to 25%', () => {
  const result = calculateImageScaling({ originalWidth: 1920, originalHeight: 1080, scalePercent: 50 });
  assert.equal(result.scaledWidth, 960);
  assert.equal(result.scaledHeight, 540);
  assert.equal(result.scaleFactor, 0.5);
  assert.equal(result.pixelAreaPercent, 25);
});

test('image scaling: 100% scale preserves dimensions and area', () => {
  const result = calculateImageScaling({ originalWidth: 1920, originalHeight: 1080, scalePercent: 100 });
  assert.equal(result.scaledWidth, 1920);
  assert.equal(result.scaledHeight, 1080);
  assert.equal(result.scaleFactor, 1);
  assert.equal(result.pixelAreaPercent, 100);
});

test('image scaling: 200% scale doubles dimensions and quadruples pixel area', () => {
  const result = calculateImageScaling({ originalWidth: 1920, originalHeight: 1080, scalePercent: 200 });
  assert.equal(result.scaledWidth, 3840);
  assert.equal(result.scaledHeight, 2160);
  assert.equal(result.scaleFactor, 2);
  assert.equal(result.pixelAreaPercent, 400);
});

test('image scaling: pixel rounding rounds to nearest whole pixel', () => {
  const result = calculateImageScaling({ originalWidth: 1920, originalHeight: 1080, scalePercent: 33.333 });
  assert.equal(result.scaledWidth, 640);
  assert.equal(result.scaledHeight, 360);
});

test('image scaling: zero scale returns zero dimensions and zero area', () => {
  const result = calculateImageScaling({ originalWidth: 1920, originalHeight: 1080, scalePercent: 0 });
  assert.equal(result.scaledWidth, 0);
  assert.equal(result.scaledHeight, 0);
  assert.equal(result.scaleFactor, 0);
  assert.equal(result.pixelAreaPercent, 0);
});

test('image scaling: negative or non-finite inputs handled safely', () => {
  const neg = calculateImageScaling({ originalWidth: -1920, originalHeight: 1080, scalePercent: -50 });
  assert.equal(neg.scaledWidth, 0);
  assert.equal(neg.scaledHeight, 0);

  const nonFinite = calculateImageScaling({ originalWidth: NaN, originalHeight: 1080, scalePercent: Infinity });
  assert.equal(nonFinite.scaledWidth, 0);
  assert.equal(nonFinite.scaledHeight, 0);
});
