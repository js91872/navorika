import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateImageBandwidth } from './imageBandwidth.ts';

test('image bandwidth: normal page-view case calculates per-view and aggregate transfer', () => {
  const result = calculateImageBandwidth({ imageSizeKb: 250, imagesPerView: 5, pageViews: 10000 });
  assert.equal(result.dataPerViewKb, 1250);
  assert.equal(result.totalTransferKb, 12500000);
  assert.equal(result.totalTransferMb, 12207.03);
  assert.equal(result.totalTransferGb, 11.921);
});

test('image bandwidth: zero page views returns zero transfer volume', () => {
  const result = calculateImageBandwidth({ imageSizeKb: 250, imagesPerView: 5, pageViews: 0 });
  assert.equal(result.dataPerViewKb, 1250);
  assert.equal(result.totalTransferKb, 0);
  assert.equal(result.totalTransferMb, 0);
  assert.equal(result.totalTransferGb, 0);
});

test('image bandwidth: zero images per view returns zero data per view and transfer', () => {
  const result = calculateImageBandwidth({ imageSizeKb: 250, imagesPerView: 0, pageViews: 10000 });
  assert.equal(result.dataPerViewKb, 0);
  assert.equal(result.totalTransferKb, 0);
  assert.equal(result.totalTransferMb, 0);
  assert.equal(result.totalTransferGb, 0);
});

test('image bandwidth: unit conversion scales correctly from KB to MB and GB', () => {
  // 1024 KB per view * 1024 views = 1,048,576 KB = 1024 MB = 1 GB
  const result = calculateImageBandwidth({ imageSizeKb: 1024, imagesPerView: 1, pageViews: 1024 });
  assert.equal(result.dataPerViewKb, 1024);
  assert.equal(result.totalTransferKb, 1048576);
  assert.equal(result.totalTransferMb, 1024);
  assert.equal(result.totalTransferGb, 1);
});

test('image bandwidth: negative or non-finite inputs handled safely without NaN or Infinity', () => {
  const neg = calculateImageBandwidth({ imageSizeKb: -250, imagesPerView: 5, pageViews: 10000 });
  assert.equal(neg.dataPerViewKb, 0);
  assert.equal(neg.totalTransferKb, 0);

  const nonFinite = calculateImageBandwidth({ imageSizeKb: NaN, imagesPerView: Infinity, pageViews: 10000 });
  assert.equal(nonFinite.dataPerViewKb, 0);
  assert.equal(nonFinite.totalTransferKb, 0);
});
