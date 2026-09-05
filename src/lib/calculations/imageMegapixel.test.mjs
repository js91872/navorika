import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateImageMegapixel } from './imageMegapixel.ts';

test('image megapixel: 6000x4000 camera sensor yields 24 MP and 3:2 aspect ratio', () => {
  const result = calculateImageMegapixel({ widthPixels: 6000, heightPixels: 4000 });
  assert.equal(result.totalPixels, 24000000);
  assert.equal(result.megapixels, 24);
  assert.equal(result.aspectRatio, '3:2');
});

test('image megapixel: 1920x1080 full HD yields 2.0736 MP and 16:9 aspect ratio', () => {
  const result = calculateImageMegapixel({ widthPixels: 1920, heightPixels: 1080 });
  assert.equal(result.totalPixels, 2073600);
  assert.equal(result.megapixels, 2.0736);
  assert.equal(result.aspectRatio, '16:9');
});

test('image megapixel: GCD simplification handles 1:1 and non-standard ratios correctly', () => {
  const square = calculateImageMegapixel({ widthPixels: 1080, heightPixels: 1080 });
  assert.equal(square.aspectRatio, '1:1');

  const banner = calculateImageMegapixel({ widthPixels: 1200, heightPixels: 630 });
  assert.equal(banner.aspectRatio, '40:21');
});

test('image megapixel: zero dimensions return zero pixels and not applicable ratio', () => {
  const zeroW = calculateImageMegapixel({ widthPixels: 0, heightPixels: 1080 });
  assert.equal(zeroW.totalPixels, 0);
  assert.equal(zeroW.megapixels, 0);
  assert.equal(zeroW.aspectRatio, 'Not applicable');

  const zeroH = calculateImageMegapixel({ widthPixels: 1920, heightPixels: 0 });
  assert.equal(zeroH.totalPixels, 0);
  assert.equal(zeroH.megapixels, 0);
  assert.equal(zeroH.aspectRatio, 'Not applicable');
});

test('image megapixel: negative or non-finite inputs handled safely without NaN or Infinity', () => {
  const negative = calculateImageMegapixel({ widthPixels: -1920, heightPixels: 1080 });
  assert.equal(negative.totalPixels, 0);
  assert.equal(negative.megapixels, 0);
  assert.equal(negative.aspectRatio, 'Not applicable');

  const nonFinite = calculateImageMegapixel({ widthPixels: NaN, heightPixels: Infinity });
  assert.equal(nonFinite.totalPixels, 0);
  assert.equal(nonFinite.megapixels, 0);
  assert.equal(nonFinite.aspectRatio, 'Not applicable');
});
