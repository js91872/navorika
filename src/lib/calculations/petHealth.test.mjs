import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateDogAge, calculatePuppyGrowth, calculateCatCalories } from './petHealth.ts';

// ====== DOG AGE CALCULATOR TESTS ======
test('dog age matches default 5-year medium dog reference', () => {
  const res = calculateDogAge({ dogAge: 5, breedSize: 'medium' });
  // At age 2 -> 24. For next 3 years at 5/yr -> 24 + 15 = 39.
  assert.equal(res.humanEquivalent, 39);
  assert.equal(res.lifeStage, 'Mature Adult');
});

test('dog age reflects breed size differentiation for senior dogs', () => {
  const small = calculateDogAge({ dogAge: 8, breedSize: 'small' });
  const giant = calculateDogAge({ dogAge: 8, breedSize: 'giant' });
  // Small: 24 + 6*4 = 48
  // Giant: 22 + 6*8 = 70
  assert.equal(small.humanEquivalent, 48);
  assert.equal(giant.humanEquivalent, 70);
  assert.equal(small.lifeStage, 'Senior');
  assert.equal(giant.lifeStage, 'Geriatric');
});

test('dog age handles puppy stage and year one fractional interpolation', () => {
  const puppy = calculateDogAge({ dogAge: 0.5, breedSize: 'medium' });
  assert.equal(puppy.humanEquivalent, 7.5);
  assert.equal(puppy.lifeStage, 'Puppy');
});

test('dog age handles zero and negative inputs safely', () => {
  const zero = calculateDogAge({ dogAge: 0, breedSize: 'large' });
  assert.equal(zero.humanEquivalent, 0);
  assert.equal(zero.lifeStage, 'Puppy');

  const neg = calculateDogAge({ dogAge: -2, breedSize: 'small' });
  assert.equal(neg.humanEquivalent, null);

  const nonFinite = calculateDogAge({ dogAge: NaN, breedSize: 'small' });
  assert.equal(nonFinite.humanEquivalent, null);
});

// ====== PUPPY GROWTH PREDICTOR TESTS ======
test('puppy growth matches default 16-week medium puppy reference', () => {
  const res = calculatePuppyGrowth({ ageWeeks: 16, currentWeight: 15, breedSize: 'medium' });
  // At 16 weeks medium dog is at 50% growth
  assert.equal(res.growthProgress, 50);
  assert.equal(res.estimatedAdultWeight, 30);
  assert.ok(res.lowEstimate <= 30);
  assert.ok(res.highEstimate >= 30);
});

test('puppy growth estimates differ by breed size rate', () => {
  // 16-week-old puppy weighing 10 kg
  const small = calculatePuppyGrowth({ ageWeeks: 16, currentWeight: 10, breedSize: 'small' });
  const giant = calculatePuppyGrowth({ ageWeeks: 16, currentWeight: 10, breedSize: 'giant' });
  // Small puppy at 16 wks is 64% grown -> ~15.6 kg adult
  // Giant puppy at 16 wks is 33% grown -> ~30.3 kg adult
  assert.equal(small.growthProgress, 64);
  assert.equal(small.estimatedAdultWeight, 15.6);
  assert.equal(giant.growthProgress, 33);
  assert.equal(giant.estimatedAdultWeight, 30.3);
});

test('puppy growth rejects age under 4 weeks or invalid weight safely', () => {
  const tooYoung = calculatePuppyGrowth({ ageWeeks: 2, currentWeight: 3, breedSize: 'medium' });
  assert.equal(tooYoung.estimatedAdultWeight, null);

  const zeroWeight = calculatePuppyGrowth({ ageWeeks: 12, currentWeight: 0, breedSize: 'medium' });
  assert.equal(zeroWeight.estimatedAdultWeight, null);

  const nonFinite = calculatePuppyGrowth({ ageWeeks: NaN, currentWeight: 10, breedSize: 'medium' });
  assert.equal(nonFinite.estimatedAdultWeight, null);
});

// ====== CAT CALORIE CALCULATOR TESTS ======
test('cat calories match 4.5kg neutered adult reference', () => {
  const res = calculateCatCalories({ weightKg: 4.5, factor: 'neutered-adult' });
  // 4.5^0.75 ≈ 3.08985 -> RER = 70 * 3.08985 ≈ 216.29
  // daily calories = 216.29 * 1.2 ≈ 260
  assert.equal(res.rer, 216.3);
  assert.equal(res.dailyCalories, 260);
});

test('cat calories reflect different life-stage factors', () => {
  const kitten = calculateCatCalories({ weightKg: 2.0, factor: 'kitten-young' });
  const inactive = calculateCatCalories({ weightKg: 4.0, factor: 'inactive-prone' });
  const senior = calculateCatCalories({ weightKg: 4.0, factor: 'senior' });
  // Kitten (2kg): RER = 70 * 2^0.75 ≈ 117.7, factor 2.5 -> ~294
  // 4kg cat: RER = 70 * 4^0.75 ≈ 197.99
  // Inactive (4kg): factor 1.0 -> 198
  // Senior (4kg): factor 1.1 -> 197.99 * 1.1 ≈ 218
  assert.equal(kitten.dailyCalories, 294);
  assert.equal(inactive.dailyCalories, 198);
  assert.equal(senior.dailyCalories, 218);
});

test('cat calories handle non-positive and invalid inputs safely', () => {
  const zero = calculateCatCalories({ weightKg: 0, factor: 'neutered-adult' });
  assert.equal(zero.rer, null);
  assert.equal(zero.dailyCalories, null);

  const neg = calculateCatCalories({ weightKg: -5, factor: 'neutered-adult' });
  assert.equal(neg.rer, null);

  const nonFinite = calculateCatCalories({ weightKg: NaN, factor: 'neutered-adult' });
  assert.equal(nonFinite.rer, null);
});
