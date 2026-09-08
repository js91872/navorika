import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateMacronutrients,
  calculateRunningPace,
  calculateOneRepMax,
  calculateHydration,
} from './fitnessAthletics.ts';

test('macronutrients: computes balanced split for 2200 kcal', () => {
  const result = calculateMacronutrients({
    dailyCalories: 2200,
    macroSplitGoal: 'balanced', // 30P / 40C / 30F
    bodyWeightKg: 75,
  });

  // Protein: 660 kcal / 4 = 165g
  // Carbs: 880 kcal / 4 = 220g
  // Fat: 660 kcal / 9 = 73g
  assert.equal(result.proteinGrams, 165);
  assert.equal(result.carbGrams, 220);
  assert.equal(result.fatGrams, 73);
  assert.equal(result.proteinPerKgBodyweight, 2.2);
});

test('macronutrients: computes keto split with high fat and low carb', () => {
  const result = calculateMacronutrients({
    dailyCalories: 2000,
    macroSplitGoal: 'keto', // 25P / 5C / 70F
    bodyWeightKg: 80,
  });

  // Carbs: 100 kcal / 4 = 25g
  assert.equal(result.carbGrams, 25);
  // Fat: 1400 kcal / 9 = 156g
  assert.equal(result.fatGrams, 156);
  // Protein: 500 kcal / 4 = 125g
  assert.equal(result.proteinGrams, 125);
});

test('runningPace: calculates pace, speed, and race projections for half marathon', () => {
  const result = calculateRunningPace({
    raceDistancePreset: 'half-marathon', // 21.0975 km
    timeHours: 1,
    timeMinutes: 45,
    timeSeconds: 0,
  });

  // 1:45:00 = 6300 sec.
  // Pace/km = 6300 / 21.0975 = 298.61 sec = 4:59 /km
  assert.equal(result.pacePerKm, '4:59 /km');
  assert.ok(result.pacePerMile.startsWith('8:0'));
  assert.ok(result.speedKmh >= 12.0 && result.speedKmh <= 12.1);
  assert.ok(result.equivalent5kTime.startsWith('22:'));
  assert.ok(result.equivalentMarathonTime.startsWith('3:3'));
});

test('runningPace: handles zero time and custom distance safely', () => {
  const zeroTime = calculateRunningPace({
    distanceKm: 10,
    timeHours: 0,
    timeMinutes: 0,
    timeSeconds: 0,
  });
  assert.equal(zeroTime.pacePerKm, '0:00 /km');
  assert.equal(zeroTime.speedKmh, 0);

  const customDist = calculateRunningPace({
    distanceKm: 5,
    timeHours: 0,
    timeMinutes: 25,
    timeSeconds: 0,
  });
  assert.equal(customDist.pacePerKm, '5:00 /km');
  assert.equal(customDist.speedKmh, 12);
});

test('oneRepMax: 1 rep lift returns identical max', () => {
  const result = calculateOneRepMax({
    weightLifted: 100,
    repetitions: 1,
  });
  assert.equal(result.estimated1rm, 100);
  assert.equal(result.epleyEstimate, 100);
  assert.equal(result.brzyckiEstimate, 100);
  assert.equal(result.rep95Percent, 95);
  assert.equal(result.rep90Percent, 90);
});

test('oneRepMax: computes accurate multi-rep estimates and percentages', () => {
  const result = calculateOneRepMax({
    weightLifted: 100,
    repetitions: 5,
    formulaMethod: 'average',
  });

  // Epley: 100 * (1 + 5/30) = 116.67 -> 117
  // Brzycki: 100 * (36 / 32) = 112.5 -> 113
  // Average: ~114.5 -> 115
  assert.equal(result.epleyEstimate, 117);
  assert.equal(result.brzyckiEstimate, 113);
  assert.equal(result.estimated1rm, 115);
  assert.equal(result.rep95Percent, 109); // round(115 * 0.95) = 109
  assert.equal(result.rep80Percent, 92);  // round(115 * 0.80) = 92
});

test('oneRepMax: handles zero weight safely', () => {
  const zero = calculateOneRepMax({
    weightLifted: 0,
    repetitions: 10,
  });
  assert.equal(zero.estimated1rm, 0);
  assert.equal(zero.epleyEstimate, 0);
});

test('hydration: calculates baseline and exercise requirements with climate adjustment', () => {
  const result = calculateHydration({
    bodyWeightKg: 70,
    exerciseDurationMinutes: 45,
    climateEnvironment: 'hot-humid',
  });

  // Baseline: 70 * 0.035 = 2.45 L
  // Exercise: 45 * (0.35 / 30) = 0.525 L -> 0.53 L
  // Climate (humid): +0.60 L
  // Total: 2.45 + 0.53 + 0.60 = 3.58 L
  assert.equal(result.baselineLiters, 2.45);
  assert.equal(result.exerciseAdditionLiters, 0.53);
  assert.equal(result.totalWaterLiters, 3.58);
  assert.ok(result.totalFluidOunces > 115 && result.totalFluidOunces < 125);
  assert.ok(result.standardCups8oz > 14 && result.standardCups8oz < 16);
});

test('hydration: handles zero exercise in temperate climate', () => {
  const result = calculateHydration({
    bodyWeightKg: 80,
    exerciseDurationMinutes: 0,
    climateEnvironment: 'temperate',
  });
  // Baseline: 80 * 0.035 = 2.80 L
  assert.equal(result.totalWaterLiters, 2.80);
  assert.equal(result.exerciseAdditionLiters, 0);
});
