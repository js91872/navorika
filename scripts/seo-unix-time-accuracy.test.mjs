import test from 'node:test';
import assert from 'node:assert/strict';
import { quickUnixTimestamp } from '../src/lib/time/quickUnixTimestamp.ts';

test('Unix quick converter preserves valid seconds including far-future 11-digit values', () => {
  assert.equal(quickUnixTimestamp('1700000000')?.utc, '2023-11-14T22:13:20.000Z');
  assert.equal(quickUnixTimestamp('10000000000')?.unit, 'seconds');
  assert.equal(quickUnixTimestamp('-1000000000')?.utc, '1938-04-24T22:13:20.000Z');
});
test('Unix quick converter handles 13-digit milliseconds and bad inputs', () => {
  assert.equal(quickUnixTimestamp('1700000000000')?.utc, '2023-11-14T22:13:20.000Z');
  assert.equal(quickUnixTimestamp('-1700000000000')?.unit, 'milliseconds');
  for (const bad of ['12.5', '1e9', 'NaN', '', '9007199254740992']) assert.equal(quickUnixTimestamp(bad), null);
});
