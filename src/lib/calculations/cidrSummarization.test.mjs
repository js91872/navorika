import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateCidrSummarization } from './cidrSummarization.ts';

test('cidrSummarization: merges two sibling /25 into one /24', () => {
  const input = '192.168.0.0/25\n192.168.0.128/25';
  const result = calculateCidrSummarization({ cidrList: input });
  assert.equal(result.valid, true);
  assert.equal(result.inputNetworks, 2);
  assert.equal(result.summaryCount, 1);
  assert.deepEqual(result.summarizedList, ['192.168.0.0/24']);
  assert.equal(result.addressesCovered, 256);
});

test('cidrSummarization: merges four contiguous /26 into one /24', () => {
  const input = '10.0.0.0/26\n10.0.0.64/26\n10.0.0.128/26\n10.0.0.192/26';
  const result = calculateCidrSummarization({ cidrList: input });
  assert.equal(result.valid, true);
  assert.equal(result.inputNetworks, 4);
  assert.equal(result.summaryCount, 1);
  assert.deepEqual(result.summarizedList, ['10.0.0.0/24']);
  assert.equal(result.addressesCovered, 256);
});

test('cidrSummarization: deduplicates identical entries', () => {
  const input = '10.0.0.0/24\n10.0.0.0/24\n10.0.0.0/24';
  const result = calculateCidrSummarization({ cidrList: input });
  assert.equal(result.valid, true);
  assert.equal(result.inputNetworks, 3);
  assert.equal(result.summaryCount, 1);
  assert.deepEqual(result.summarizedList, ['10.0.0.0/24']);
  assert.equal(result.addressesCovered, 256);
});

test('cidrSummarization: eliminates subnets fully contained within a larger parent', () => {
  const input = '10.0.0.0/24\n10.0.0.0/26\n10.0.0.128/25';
  const result = calculateCidrSummarization({ cidrList: input });
  assert.equal(result.valid, true);
  assert.equal(result.inputNetworks, 3);
  assert.equal(result.summaryCount, 1);
  assert.deepEqual(result.summarizedList, ['10.0.0.0/24']);
  assert.equal(result.addressesCovered, 256);
});

test('cidrSummarization: does not merge non-adjacent /25 networks', () => {
  const input = '192.168.0.0/25\n192.168.1.0/25';
  const result = calculateCidrSummarization({ cidrList: input });
  assert.equal(result.valid, true);
  assert.equal(result.inputNetworks, 2);
  assert.equal(result.summaryCount, 2);
  assert.deepEqual(result.summarizedList, ['192.168.0.0/25', '192.168.1.0/25']);
  assert.equal(result.addressesCovered, 256);
});

test('cidrSummarization: does not merge misaligned /26 blocks', () => {
  const input = '192.168.0.64/26\n192.168.0.128/26';
  const result = calculateCidrSummarization({ cidrList: input });
  assert.equal(result.valid, true);
  assert.equal(result.inputNetworks, 2);
  assert.equal(result.summaryCount, 2);
  assert.deepEqual(result.summarizedList, ['192.168.0.64/26', '192.168.0.128/26']);
  assert.equal(result.addressesCovered, 128);
});

test('cidrSummarization: normalizes non-boundary host addresses to network prefix', () => {
  const input = '192.168.0.15/25\n192.168.0.200/25';
  const result = calculateCidrSummarization({ cidrList: input });
  assert.equal(result.valid, true);
  assert.equal(result.summaryCount, 1);
  assert.deepEqual(result.summarizedList, ['192.168.0.0/24']);
});

test('cidrSummarization: handles invalid CIDR, empty list, and out-of-range prefix safely', () => {
  assert.equal(calculateCidrSummarization({ cidrList: '' }).valid, false);
  assert.equal(calculateCidrSummarization({ cidrList: '   ' }).valid, false);
  assert.equal(calculateCidrSummarization({ cidrList: '192.168.1.0/33' }).valid, false);
  assert.equal(calculateCidrSummarization({ cidrList: '999.168.1.0/24' }).valid, false);
  assert.equal(calculateCidrSummarization({ cidrList: 'not-a-cidr' }).valid, false);
});
