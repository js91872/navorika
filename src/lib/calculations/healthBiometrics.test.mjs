import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateCaffeineHalfLife, calculateHrvDeviation } from './healthBiometrics.ts';

// ====== CAFFEINE HALF-LIFE CALCULATOR TESTS ======
test('caffeine half-life matches default 200mg at 6 hours reference', () => {
  const res = calculateCaffeineHalfLife({ doseMg: 200, hoursElapsed: 6, halfLifeHours: 5 });
  // remaining = 200 * 0.5^(6/5) = 200 * 0.5^1.2 ≈ 200 * 0.435275 = 87.055 -> 87.1 mg
  assert.equal(res.remainingMg, 87.1);
  assert.equal(res.remainingPercent, 43.5);
  assert.equal(res.eliminatedMg, 112.9);
});

test('caffeine half-life handles exactly 1 half-life elapsed', () => {
  const res = calculateCaffeineHalfLife({ doseMg: 100, hoursElapsed: 5, halfLifeHours: 5 });
  assert.equal(res.remainingMg, 50.0);
  assert.equal(res.remainingPercent, 50.0);
  assert.equal(res.eliminatedMg, 50.0);
});

test('caffeine half-life handles zero dose safely', () => {
  const res = calculateCaffeineHalfLife({ doseMg: 0, hoursElapsed: 6, halfLifeHours: 5 });
  assert.equal(res.remainingMg, 0);
  assert.equal(res.remainingPercent, 0);
  assert.equal(res.eliminatedMg, 0);
});

test('caffeine half-life rejects negative or non-finite inputs safely', () => {
  const negDose = calculateCaffeineHalfLife({ doseMg: -100, hoursElapsed: 4, halfLifeHours: 5 });
  assert.equal(negDose.remainingMg, null);

  const zeroHalfLife = calculateCaffeineHalfLife({ doseMg: 100, hoursElapsed: 4, halfLifeHours: 0 });
  assert.equal(zeroHalfLife.remainingMg, null);

  const nonFinite = calculateCaffeineHalfLife({ doseMg: NaN, hoursElapsed: 4, halfLifeHours: 5 });
  assert.equal(nonFinite.remainingMg, null);
});

// ====== HRV BASELINE DEVIATION CALCULATOR TESTS ======
test('hrv deviation matches default baseline 55ms, current 48ms reference', () => {
  const res = calculateHrvDeviation({ baselineHrv: 55, currentHrv: 48 });
  // diff = 48 - 55 = -7.0
  // deviation = -7 / 55 * 100 ≈ -12.727% -> -12.7%
  // ratio = 48 / 55 ≈ 0.87
  assert.equal(res.absoluteDifference, -7.0);
  assert.equal(res.percentDeviation, -12.7);
  assert.equal(res.ratio, 0.87);
  assert.equal(res.direction, 'Below baseline');
});

test('hrv deviation handles positive deviation and equal to baseline', () => {
  const above = calculateHrvDeviation({ baselineHrv: 50, currentHrv: 60 });
  assert.equal(above.absoluteDifference, 10.0);
  assert.equal(above.percentDeviation, 20.0);
  assert.equal(above.ratio, 1.2);
  assert.equal(above.direction, 'Above baseline');

  const equal = calculateHrvDeviation({ baselineHrv: 50, currentHrv: 50 });
  assert.equal(equal.absoluteDifference, 0);
  assert.equal(equal.percentDeviation, 0);
  assert.equal(equal.ratio, 1.0);
  assert.equal(equal.direction, 'Equal to baseline');
});

test('hrv deviation rejects zero or negative baseline safely', () => {
  const zeroBase = calculateHrvDeviation({ baselineHrv: 0, currentHrv: 40 });
  assert.equal(zeroBase.absoluteDifference, null);
  assert.equal(zeroBase.direction, 'Invalid measurement');

  const negBase = calculateHrvDeviation({ baselineHrv: -10, currentHrv: 40 });
  assert.equal(negBase.absoluteDifference, null);

  const nonFinite = calculateHrvDeviation({ baselineHrv: 50, currentHrv: NaN });
  assert.equal(nonFinite.absoluteDifference, null);
});
