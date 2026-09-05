import test from 'node:test';
import assert from 'node:assert/strict';
import { calculatePhotoStorage } from './photoStorage.ts';

test('photo storage: normal 64 GB storage with 10% reserved and 5 MB photos', () => {
  const result = calculatePhotoStorage({ storageGb: 64, averagePhotoMb: 5, reservedPercent: 10 });
  assert.equal(result.usableStorageGb, 57.6);
  assert.equal(result.usableStorageMb, 58982.4);
  assert.equal(result.estimatedPhotos, 11796);
});

test('photo storage: zero reserved space maximizes photo capacity', () => {
  const result = calculatePhotoStorage({ storageGb: 64, averagePhotoMb: 5, reservedPercent: 0 });
  assert.equal(result.usableStorageGb, 64);
  assert.equal(result.usableStorageMb, 65536);
  assert.equal(result.estimatedPhotos, 13107);
});

test('photo storage: 100% reserved space yields zero usable capacity and zero photos', () => {
  const result = calculatePhotoStorage({ storageGb: 64, averagePhotoMb: 5, reservedPercent: 100 });
  assert.equal(result.usableStorageGb, 0);
  assert.equal(result.usableStorageMb, 0);
  assert.equal(result.estimatedPhotos, 0);
});

test('photo storage: zero average photo size returns null rather than Infinity', () => {
  const result = calculatePhotoStorage({ storageGb: 64, averagePhotoMb: 0, reservedPercent: 10 });
  assert.equal(result.usableStorageGb, 57.6);
  assert.equal(result.estimatedPhotos, null);
});

test('photo storage: negative average photo size returns null', () => {
  const result = calculatePhotoStorage({ storageGb: 64, averagePhotoMb: -5, reservedPercent: 10 });
  assert.equal(result.estimatedPhotos, null);
});

test('photo storage: negative or non-finite inputs handled safely', () => {
  const negStorage = calculatePhotoStorage({ storageGb: -64, averagePhotoMb: 5, reservedPercent: 10 });
  assert.equal(negStorage.usableStorageGb, 0);
  assert.equal(negStorage.usableStorageMb, 0);
  assert.equal(negStorage.estimatedPhotos, 0);

  const nonFinite = calculatePhotoStorage({ storageGb: NaN, averagePhotoMb: 5, reservedPercent: Infinity });
  assert.equal(nonFinite.usableStorageGb, 0);
  assert.equal(nonFinite.usableStorageMb, 0);
});
