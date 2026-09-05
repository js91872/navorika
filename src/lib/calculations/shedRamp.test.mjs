import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateShedRamp } from './shedRamp.ts';

test('shedRamp: classic 3-4-5 right triangle geometry benchmark', () => {
  const result = calculateShedRamp({ rise: 3, run: 4 });

  assert.equal(result.rampLength, 5);
  // atan(3/4) = 36.86989... degrees
  assert.equal(result.angleDegrees, 36.87);
  // slope = 3/4 * 100 = 75%
  assert.equal(result.slopePercent, 75);
  // ratio = 4/3 = 1.3333 => "1 : 1.3"
  assert.equal(result.riseRunRatio, '1 : 1.3');
});

test('shedRamp: standard shed ramp defaults (12 in rise, 48 in run)', () => {
  const result = calculateShedRamp({ rise: 12, run: 48 });

  // sqrt(12^2 + 48^2) = sqrt(144 + 2304) = sqrt(2448) = 49.477...
  assert.equal(result.rampLength, 49.48);
  // atan(12/48) = atan(0.25) = 14.036... degrees
  assert.equal(result.angleDegrees, 14.04);
  // slope = 25%
  assert.equal(result.slopePercent, 25);
  // ratio = 1 : 4.0
  assert.equal(result.riseRunRatio, '1 : 4.0');
});

test('shedRamp: zero rise handles flat ground safely', () => {
  const result = calculateShedRamp({ rise: 0, run: 60 });

  assert.equal(result.angleDegrees, 0);
  assert.equal(result.slopePercent, 0);
  assert.equal(result.rampLength, 60);
  assert.equal(result.riseRunRatio, 'Flat (0 : 1)');
});

test('shedRamp: zero run handles vertical step safely without division by zero', () => {
  const result = calculateShedRamp({ rise: 15, run: 0 });

  assert.equal(result.angleDegrees, 90);
  assert.equal(result.slopePercent, null);
  assert.equal(result.rampLength, 15);
  assert.equal(result.riseRunRatio, 'Vertical (1 : 0)');
});

test('shedRamp: both zero inputs handle safely', () => {
  const result = calculateShedRamp({ rise: 0, run: 0 });

  assert.equal(result.angleDegrees, 0);
  assert.equal(result.slopePercent, 0);
  assert.equal(result.rampLength, 0);
  assert.equal(result.riseRunRatio, 'Flat (0 : 1)');
});

test('shedRamp: negative and non-finite inputs handle safely without NaN or Infinity', () => {
  const result = calculateShedRamp({ rise: -10, run: NaN });

  assert.equal(result.angleDegrees, 0);
  assert.equal(result.slopePercent, 0);
  assert.equal(result.rampLength, 0);
  assert.equal(result.riseRunRatio, 'Flat (0 : 1)');
});
