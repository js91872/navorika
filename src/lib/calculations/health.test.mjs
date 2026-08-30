import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateBMI, getBMICategory } from './bmi.ts';
import { calculateHeartRateEstimate, calculatePulseBpm } from './heartRate.ts';

test('BMI metric reference case matches kg per metre squared', () => {
  const result = calculateBMI({ weight: 70, height: 175, unit: 'metric' });
  assert.equal(result.bmi, 22.9); assert.equal(result.category, 'Healthy Weight');
});
test('BMI imperial reference case matches the 703 conversion', () => {
  assert.equal(calculateBMI({ weight: 150, height: 0, unit: 'imperial', feet: 5, inches: 9 }).bmi, 22.1);
});
test('BMI categories preserve CDC adult thresholds', () => {
  assert.equal(getBMICategory(18.49), 'Underweight'); assert.equal(getBMICategory(18.5), 'Healthy Weight');
  assert.equal(getBMICategory(25), 'Overweight'); assert.equal(getBMICategory(30), 'Obesity');
});
test('BMI rejects zero, negative, and non-finite measurements', () => {
  assert.throws(() => calculateBMI({ weight: 70, height: 0, unit: 'metric' }), RangeError);
  assert.throws(() => calculateBMI({ weight: Number.NaN, height: 175, unit: 'metric' }), RangeError);
});
test('manual pulse conversion handles supported intervals and invalid counts', () => {
  assert.equal(calculatePulseBpm(18, 15), 72); assert.equal(calculatePulseBpm(36, 30), 72); assert.equal(calculatePulseBpm(-1, 60), 0);
});
test('heart rate estimates match AHA age-based percentages', () => {
  const result = calculateHeartRateEstimate(40, 70);
  assert.deepEqual(result, { estimatedMaximum: 180, heartRateReserve: 110, moderateRange: { min: 90, max: 126 }, vigorousRange: { min: 126, max: 153 } });
});
