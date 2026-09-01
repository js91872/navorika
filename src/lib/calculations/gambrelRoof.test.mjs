import assert from 'node:assert/strict';
import test from 'node:test';
import { calculateGambrelRoof, GAMBREL_DEFAULTS } from './gambrelRoof.ts';

const closeTo = (actual, expected, tolerance = 1e-9) => {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} was not within ${tolerance} of ${expected}`);
};

test('calculates the default 12 by 16 foot classic gambrel', () => {
  const result = calculateGambrelRoof(GAMBREL_DEFAULTS);
  closeTo(result.halfSpan, 6);
  closeTo(result.lowerRun, 3);
  closeTo(result.upperRun, 3);
  closeTo(result.lowerRise, 3 * Math.sqrt(3));
  closeTo(result.upperRise, 3 / Math.sqrt(3));
  closeTo(result.lowerRafter, 6);
  closeTo(result.upperRafter, 2 * Math.sqrt(3));
  assert.equal(result.trussCount, 9);
  assert.ok(Object.values(result).every(Number.isFinite));
});

test('a wider span scales geometry while keeping angles and proportions', () => {
  const twelve = calculateGambrelRoof({ ...GAMBREL_DEFAULTS, overhangFt: 0 });
  const sixteen = calculateGambrelRoof({ ...GAMBREL_DEFAULTS, spanFt: 16, overhangFt: 0 });
  closeTo(sixteen.roofHeight / twelve.roofHeight, 16 / 12);
  closeTo(sixteen.totalRafterPerTruss / twelve.totalRafterPerTruss, 16 / 12);
});

test('angles change rises and rafter lengths', () => {
  const baseline = calculateGambrelRoof(GAMBREL_DEFAULTS);
  const changed = calculateGambrelRoof({ ...GAMBREL_DEFAULTS, lowerAngleDeg: 70, upperAngleDeg: 25 });
  assert.notEqual(changed.roofHeight, baseline.roofHeight);
  assert.notEqual(changed.lowerRafter, baseline.lowerRafter);
  assert.notEqual(changed.upperRafter, baseline.upperRafter);
});

test('building length changes area and spacing changes whole truss count', () => {
  const short = calculateGambrelRoof(GAMBREL_DEFAULTS);
  const long = calculateGambrelRoof({ ...GAMBREL_DEFAULTS, buildingLengthFt: 24 });
  const closerSpacing = calculateGambrelRoof({ ...GAMBREL_DEFAULTS, trussSpacingFt: 16 / 12 });
  assert.ok(long.roofArea > short.roofArea);
  assert.equal(short.trussCount, 9);
  assert.equal(closerSpacing.trussCount, 13);
});

test('rejects invalid and non-finite input without returning malformed geometry', () => {
  assert.throws(() => calculateGambrelRoof({ ...GAMBREL_DEFAULTS, spanFt: 0 }), /Span/);
  assert.throws(() => calculateGambrelRoof({ ...GAMBREL_DEFAULTS, upperAngleDeg: 90 }), /Upper roof angle/);
  assert.throws(() => calculateGambrelRoof({ ...GAMBREL_DEFAULTS, lowerRunProportion: 1 }), /break position/);
  assert.throws(() => calculateGambrelRoof({ ...GAMBREL_DEFAULTS, buildingLengthFt: Number.NaN }), /finite/);
});
