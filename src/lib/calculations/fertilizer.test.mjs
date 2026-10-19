import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateFertilizer } from './fertilizer.ts';

function close(actual, expected, tolerance = 1e-10) {
  assert.ok(Math.abs(actual - expected) <= tolerance, `Expected ${actual} to be within ${tolerance} of ${expected}`);
}

test('fertilizer: calculates product and all nutrients from an N-P-K label', () => {
  const result = calculateFertilizer({
    area: 5_000,
    areaUnit: 'sqft',
    rate: 1,
    rateUnit: 'per-1000-sqft',
    nutrient: 'n',
    npk: { n: 26, p2o5: 5, k2o: 10 },
    bagWeightLb: 40,
  });

  close(result.productLbPerRateArea, 100 / 26);
  close(result.totalProductLb, (100 / 26) * 5);
  close(result.nutrientsPerRateArea.n, 1);
  close(result.nutrientsPerRateArea.p2o5, 5 / 26);
  close(result.nutrientsPerRateArea.k2o, 10 / 26);
  close(result.bagCoverageSqFt, 40 / (100 / 26) * 1_000);
  assert.equal(result.wholeBags, 1);
});

test('fertilizer: converts acre area and an acre-based nutrient rate', () => {
  const result = calculateFertilizer({
    area: 2,
    areaUnit: 'acre',
    rate: 34,
    rateUnit: 'per-acre',
    nutrient: 'n',
    npk: { n: 34, p2o5: 0, k2o: 0 },
  });

  assert.equal(result.areaSqFt, 87_120);
  assert.equal(result.rateAreaSqFt, 43_560);
  close(result.productLbPerRateArea, 100);
  close(result.totalProductLb, 200);
  close(result.nutrientsForArea.n, 68);
  assert.equal(result.bagCoverageSqFt, null);
  assert.equal(result.wholeBags, null);
});

test('fertilizer: supports phosphate and potash as the target nutrient', () => {
  const phosphate = calculateFertilizer({
    area: 1,
    areaUnit: 'acre',
    rate: 18,
    rateUnit: 'per-acre',
    nutrient: 'p2o5',
    npk: { n: 8, p2o5: 18, k2o: 12 },
  });
  const potash = calculateFertilizer({
    area: 1_000,
    areaUnit: 'sqft',
    rate: 0.5,
    rateUnit: 'per-1000-sqft',
    nutrient: 'k2o',
    npk: { n: 8, p2o5: 18, k2o: 12 },
  });

  assert.equal(phosphate.productLbPerRateArea, 100);
  assert.equal(phosphate.nutrientsPerRateArea.p2o5, 18);
  close(potash.productLbPerRateArea, 0.5 / 0.12);
  assert.equal(potash.nutrientsPerRateArea.k2o, 0.5);
});

test('fertilizer: rejects invalid values, impossible grades, and a missing target nutrient', () => {
  const base = {
    area: 1_000,
    areaUnit: 'sqft',
    rate: 1,
    rateUnit: 'per-1000-sqft',
    nutrient: 'n',
    npk: { n: 26, p2o5: 5, k2o: 10 },
  };

  assert.throws(() => calculateFertilizer({ ...base, area: 0 }), /Area must be greater than zero/);
  assert.throws(() => calculateFertilizer({ ...base, rate: -1 }), /Nutrient rate must be greater than zero/);
  assert.throws(() => calculateFertilizer({ ...base, npk: { n: 0, p2o5: 5, k2o: 10 } }), /selected nutrient has to be greater than 0%/);
  assert.throws(() => calculateFertilizer({ ...base, npk: { n: 80, p2o5: 15, k2o: 10 } }), /cannot add up to more than 100/);
  assert.throws(() => calculateFertilizer({ ...base, bagWeightLb: 0 }), /Bag weight must be greater than zero/);
});
