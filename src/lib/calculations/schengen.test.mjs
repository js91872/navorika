import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateSchengenStay, parseIsoDateToUtcDays, utcDaysToIsoDate } from './schengen.ts';

test('schengen date helper converts ISO date to UTC days and back invariantly', () => {
  const dateStr = '2026-06-15';
  const days = parseIsoDateToUtcDays(dateStr);
  assert.ok(days !== null);
  assert.equal(utcDaysToIsoDate(days), dateStr);
});

test('schengen calculation correctly determines 180-day window start', () => {
  const result = calculateSchengenStay({
    referenceDate: '2026-06-30',
    trips: [],
  });

  // June 30 is day 181 in 2026 (non-leap year).
  // 180-day window ending on June 30 begins on January 2.
  assert.equal(result.referenceDate, '2026-06-30');
  assert.equal(result.windowStart, '2026-01-02');
  assert.equal(result.daysUsed, 0);
  assert.equal(result.daysRemaining, 90);
  assert.equal(result.compliant, true);
});

test('schengen calculation counts single stay inclusive of entry and exit', () => {
  const result = calculateSchengenStay({
    referenceDate: '2026-06-30',
    trips: [
      { entryDate: '2026-06-01', exitDate: '2026-06-10' }, // 10 calendar days: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10
    ],
  });

  assert.equal(result.daysUsed, 10);
  assert.equal(result.daysRemaining, 80);
  assert.equal(result.overstayDays, 0);
  assert.equal(result.compliant, true);
});

test('schengen calculation avoids double-counting overlapping trips', () => {
  const result = calculateSchengenStay({
    referenceDate: '2026-06-30',
    trips: [
      { entryDate: '2026-06-01', exitDate: '2026-06-10' }, // 10 days
      { entryDate: '2026-06-05', exitDate: '2026-06-15' }, // overlaps 5-10, extends to 15 (total June 1-15 = 15 days)
    ],
  });

  assert.equal(result.daysUsed, 15);
  assert.equal(result.daysRemaining, 75);
  assert.equal(result.compliant, true);
});

test('schengen calculation clips stays partially outside the 180-day window', () => {
  // Window ending on 2026-06-30 starts on 2026-01-02.
  // Trip entered on 2025-12-25 and exited on 2026-01-05:
  // Days inside window are Jan 2, Jan 3, Jan 4, Jan 5 = 4 days.
  const result = calculateSchengenStay({
    referenceDate: '2026-06-30',
    trips: [
      { entryDate: '2025-12-25', exitDate: '2026-01-05' },
    ],
  });

  assert.equal(result.daysUsed, 4);
  assert.equal(result.daysRemaining, 86);
  assert.equal(result.compliant, true);
});

test('schengen calculation flags overstay beyond 90 days as non-compliant', () => {
  const result = calculateSchengenStay({
    referenceDate: '2026-06-30',
    trips: [
      { entryDate: '2026-02-01', exitDate: '2026-05-15' }, // Feb 1 to May 15 = 28 + 31 + 30 + 15 = 104 days
    ],
  });

  assert.equal(result.daysUsed, 104);
  assert.equal(result.daysRemaining, 0);
  assert.equal(result.overstayDays, 14);
  assert.equal(result.compliant, false);
});

test('schengen calculation handles inverted dates and malformed strings gracefully', () => {
  const result = calculateSchengenStay({
    referenceDate: '2026-06-30',
    trips: [
      { entryDate: '2026-06-10', exitDate: '2026-06-01' }, // inverted: should treat as June 1 - June 10 (10 days)
      { entryDate: 'invalid-date', exitDate: '2026-06-20' }, // malformed: skipped
    ],
  });

  assert.equal(result.daysUsed, 10);
  assert.equal(result.daysRemaining, 80);
  assert.equal(result.compliant, true);
});
