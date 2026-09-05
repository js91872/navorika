import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateImageFileSize } from './imageFileSize.ts';

test('image file size: 1920x1080 24-bit RGB calculates correct uncompressed memory size', () => {
  const result = calculateImageFileSize({ widthPixels: 1920, heightPixels: 1080, channels: 3, bitsPerChannel: 8 });
  assert.equal(result.totalBits, 49766400);
  assert.equal(result.totalBytes, 6220800);
  assert.equal(result.kib, 6075);
  assert.equal(result.mib, 5.933);
});

test('image file size: 1920x1080 32-bit RGBA includes alpha channel', () => {
  const result = calculateImageFileSize({ widthPixels: 1920, heightPixels: 1080, channels: 4, bitsPerChannel: 8 });
  assert.equal(result.totalBits, 66355200);
  assert.equal(result.totalBytes, 8294400);
  assert.equal(result.kib, 8100);
  assert.equal(result.mib, 7.91);
});

test('image file size: 16-bit per channel wide-gamut image calculation', () => {
  const result = calculateImageFileSize({ widthPixels: 1920, heightPixels: 1080, channels: 3, bitsPerChannel: 16 });
  assert.equal(result.totalBits, 99532800);
  assert.equal(result.totalBytes, 12441600);
  assert.equal(result.kib, 12150);
  assert.equal(result.mib, 11.865);
});

test('image file size: zero width or height returns zero bytes without error', () => {
  const zeroW = calculateImageFileSize({ widthPixels: 0, heightPixels: 1080, channels: 3, bitsPerChannel: 8 });
  assert.equal(zeroW.totalBits, 0);
  assert.equal(zeroW.totalBytes, 0);
  assert.equal(zeroW.kib, 0);
  assert.equal(zeroW.mib, 0);

  const zeroH = calculateImageFileSize({ widthPixels: 1920, heightPixels: 0, channels: 3, bitsPerChannel: 8 });
  assert.equal(zeroH.totalBits, 0);
  assert.equal(zeroH.totalBytes, 0);
  assert.equal(zeroH.kib, 0);
  assert.equal(zeroH.mib, 0);
});

test('image file size: negative or non-finite inputs handled safely', () => {
  const neg = calculateImageFileSize({ widthPixels: -1920, heightPixels: 1080, channels: 3, bitsPerChannel: 8 });
  assert.equal(neg.totalBits, 0);
  assert.equal(neg.totalBytes, 0);

  const nonFinite = calculateImageFileSize({ widthPixels: NaN, heightPixels: Infinity, channels: 3, bitsPerChannel: 8 });
  assert.equal(nonFinite.totalBits, 0);
  assert.equal(nonFinite.totalBytes, 0);
});
