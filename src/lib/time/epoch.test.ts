import test from 'node:test';
import assert from 'node:assert/strict';
import { epochToDate, dateToEpoch, getCurrentEpoch } from './epoch';

test('Epoch: converts Unix epoch zero (1970-01-01T00:00:00.000Z)', () => {
  const result = epochToDate(0, 'seconds');
  assert.equal(result.valid, true);
  assert.equal(result.epochSeconds, 0);
  assert.equal(result.epochMilliseconds, 0);
  assert.equal(result.utcIso, '1970-01-01T00:00:00.000Z');
  assert.equal(result.dayOfWeek, 'Thursday');
});

test('Epoch: handles seconds conversion', () => {
  // 1700000000 = 2023-11-14T22:13:20.000Z
  const result = epochToDate('1700000000', 'seconds');
  assert.equal(result.valid, true);
  assert.equal(result.epochSeconds, 1700000000);
  assert.equal(result.epochMilliseconds, 1700000000000);
  assert.equal(result.utcIso, '2023-11-14T22:13:20.000Z');
});

test('Epoch: handles milliseconds conversion', () => {
  const result = epochToDate('1700000000123', 'milliseconds');
  assert.equal(result.valid, true);
  assert.equal(result.epochSeconds, 1700000000);
  assert.equal(result.epochMilliseconds, 1700000000123);
  assert.equal(result.utcIso, '2023-11-14T22:13:20.123Z');
});

test('Epoch: auto-detects seconds vs milliseconds accurately', () => {
  const sec = epochToDate('1725900000', 'auto');
  assert.equal(sec.detectedUnit, 'seconds');
  assert.equal(sec.epochSeconds, 1725900000);

  const ms = epochToDate('1725900000000', 'auto');
  assert.equal(ms.detectedUnit, 'milliseconds');
  assert.equal(ms.epochMilliseconds, 1725900000000);
});

test('Epoch: known UTC Date to Epoch conversion', () => {
  const result = dateToEpoch({
    dateString: '2024-01-15',
    timeString: '12:00:00',
    timezone: 'utc',
  });
  assert.equal(result.valid, true);
  assert.equal(result.utcIso, '2024-01-15T12:00:00.000Z');
  assert.equal(result.epochSeconds, 1705320000);
  assert.equal(result.epochMilliseconds, 1705320000000);
});

test('Epoch: rejects invalid inputs safely', () => {
  const bad = epochToDate('not-a-number');
  assert.equal(bad.valid, false);
  assert.ok(bad.error);

  const empty = epochToDate('');
  assert.equal(empty.valid, false);

  const badDate = dateToEpoch({
    dateString: 'invalid-date',
    timezone: 'utc',
  });
  assert.equal(badDate.valid, false);
});
