import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateWilksDots, getWilksCoefficient, getDotsCoefficient } from './powerlifting.ts';

test('wilks and dots match male 90kg, 600kg total reference case', () => {
  const res = calculateWilksDots({ sex: 'male', bodyweightKg: 90, totalKg: 600 });
  // Reference calculations:
  // Male Wilks coeff for 90kg ≈ 0.638393 -> 600 * 0.638393 = 383.04
  // Male DOTS coeff for 90kg ≈ 0.646599 -> 600 * 0.646599 = 387.96
  // Total / bw ratio = 600 / 90 = 6.67
  assert.equal(res.wilksScore, 383.04);
  assert.equal(res.dotsScore, 387.96);
  assert.equal(res.totalBodyweightRatio, 6.67);
});

test('wilks and dots match female 60kg, 350kg total reference case', () => {
  const res = calculateWilksDots({ sex: 'female', bodyweightKg: 60, totalKg: 350 });
  // Reference calculations:
  // Female Wilks coeff for 60kg ≈ 1.114885 -> 350 * 1.114885 = 390.21
  // Female DOTS coeff for 60kg ≈ 1.108546 -> 350 * 1.108546 = 387.99
  // Total / bw ratio = 350 / 60 = 5.83
  assert.equal(res.wilksScore, 390.21);
  assert.equal(res.dotsScore, 387.99);
  assert.equal(res.totalBodyweightRatio, 5.83);
});

test('zero total yields zero scores without NaN or division error', () => {
  const res = calculateWilksDots({ sex: 'male', bodyweightKg: 80, totalKg: 0 });
  assert.equal(res.wilksScore, 0);
  assert.equal(res.dotsScore, 0);
  assert.equal(res.totalBodyweightRatio, 0);
});

test('invalid bodyweight or total handles gracefully', () => {
  const zeroBw = calculateWilksDots({ sex: 'male', bodyweightKg: 0, totalKg: 500 });
  assert.equal(zeroBw.wilksScore, null);
  assert.equal(zeroBw.dotsScore, null);

  const negTotal = calculateWilksDots({ sex: 'female', bodyweightKg: 60, totalKg: -100 });
  assert.equal(negTotal.wilksScore, null);

  const nonFinite = calculateWilksDots({ sex: 'male', bodyweightKg: NaN, totalKg: 500 });
  assert.equal(nonFinite.wilksScore, null);
});

test('coefficient functions produce valid positive values in standard bodyweight ranges', () => {
  const wCoeff = getWilksCoefficient(75, 'male');
  const dCoeff = getDotsCoefficient(75, 'male');
  assert.ok(wCoeff !== null && wCoeff > 0.6 && wCoeff < 0.9);
  assert.ok(dCoeff !== null && dCoeff > 0.6 && dCoeff < 0.9);
});
