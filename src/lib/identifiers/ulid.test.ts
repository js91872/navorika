import test from 'node:test';
import assert from 'node:assert/strict';
import {
  generateSingleUlid,
  generateBulkUlids,
  inspectUlid,
  isValidUlid,
} from './ulid';

test('ULID: generates expected 26-character Crockford Base32 format', () => {
  const item = generateSingleUlid();
  assert.equal(item.id.length, 26);
  assert.equal(isValidUlid(item.id), true);
  // Crockford Base32 does not contain I, L, O, U
  assert.equal(/[ILOUilou]/.test(item.id), false);
});

test('ULID: enforces uniqueness across bulk generated sample (100 items)', () => {
  const bulk = generateBulkUlids(100);
  assert.equal(bulk.length, 100);

  const ids = bulk.map((b) => b.id);
  const uniqueSet = new Set(ids);
  assert.equal(uniqueSet.size, 100);

  // All must be valid Crockford Base32
  for (const id of ids) {
    assert.equal(isValidUlid(id), true);
  }
});

test('ULID: timestamp semantics and bidirectional inspection', () => {
  const fixedTime = 1700000000000; // 2023-11-14T22:13:20.000Z
  const item = generateSingleUlid(fixedTime);

  assert.equal(item.timeMs, fixedTime);
  assert.equal(item.iso, '2023-11-14T22:13:20.000Z');

  // Inspect generated ULID
  const inspection = inspectUlid(item.id);
  assert.equal(inspection.valid, true);
  assert.equal(inspection.timestampMs, fixedTime);
  assert.equal(inspection.timestampIso, '2023-11-14T22:13:20.000Z');
  assert.equal(inspection.timeComponentBase32?.length, 10);
  assert.equal(inspection.randomnessPayload?.length, 16);
});

test('ULID: rejects invalid characters and lengths during inspection', () => {
  // Too short
  const shortRes = inspectUlid('01ARZ3NDEKTSV');
  assert.equal(shortRes.valid, false);
  assert.ok(shortRes.error?.includes('26 characters'));

  // Contains forbidden Crockford characters (I, L, O, U)
  const forbiddenRes = inspectUlid('01ARZ3NDEKTSV4RRFFQ69G5FAU');
  assert.equal(forbiddenRes.valid, false);
  assert.ok(forbiddenRes.error?.includes('Crockford Base32'));

  // Empty string
  const emptyRes = inspectUlid('');
  assert.equal(emptyRes.valid, false);
});
