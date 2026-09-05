import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateAtticInsulation } from './atticInsulation.ts';

test('atticInsulation: standard payback calculation with defaults', () => {
  const result = calculateAtticInsulation({
    atticArea: 1500,
    installedCostPerArea: 1.8,
    annualHeatingCoolingCost: 1800,
    estimatedSavingsPercent: 12,
    rebates: 0,
  });

  assert.equal(result.grossProjectCost, 2700); // 1500 * 1.8
  assert.equal(result.netProjectCost, 2700);
  assert.equal(result.annualSavings, 216); // 1800 * 0.12
  assert.equal(result.monthlySavings, 18); // 216 / 12
  assert.equal(result.paybackYears, 12.5); // 2700 / 216 = 12.5 years
});

test('atticInsulation: rebates reduce net project cost and shorten payback', () => {
  const result = calculateAtticInsulation({
    atticArea: 1500,
    installedCostPerArea: 1.8,
    annualHeatingCoolingCost: 1800,
    estimatedSavingsPercent: 12,
    rebates: 540,
  });

  assert.equal(result.grossProjectCost, 2700);
  assert.equal(result.netProjectCost, 2160); // 2700 - 540
  assert.equal(result.annualSavings, 216);
  assert.equal(result.paybackYears, 10); // 2160 / 216 = 10 years
});

test('atticInsulation: zero savings percent returns null for paybackYears', () => {
  const result = calculateAtticInsulation({
    atticArea: 1500,
    installedCostPerArea: 2.0,
    annualHeatingCoolingCost: 1800,
    estimatedSavingsPercent: 0,
    rebates: 0,
  });

  assert.equal(result.annualSavings, 0);
  assert.equal(result.monthlySavings, 0);
  assert.equal(result.paybackYears, null);
});

test('atticInsulation: rebates exceeding gross project cost clamps net cost and payback to 0', () => {
  const result = calculateAtticInsulation({
    atticArea: 1000,
    installedCostPerArea: 1.5,
    annualHeatingCoolingCost: 1500,
    estimatedSavingsPercent: 10,
    rebates: 2000, // exceeds gross cost of 1500
  });

  assert.equal(result.grossProjectCost, 1500);
  assert.equal(result.netProjectCost, 0);
  assert.equal(result.annualSavings, 150);
  assert.equal(result.paybackYears, 0);
});

test('atticInsulation: zero heating cost returns null payback without division error', () => {
  const result = calculateAtticInsulation({
    atticArea: 1000,
    installedCostPerArea: 1.5,
    annualHeatingCoolingCost: 0,
    estimatedSavingsPercent: 15,
    rebates: 100,
  });

  assert.equal(result.annualSavings, 0);
  assert.equal(result.paybackYears, null);
});

test('atticInsulation: handles negative and non-finite inputs safely', () => {
  const result = calculateAtticInsulation({
    atticArea: -500,
    installedCostPerArea: NaN,
    annualHeatingCoolingCost: -1000,
    estimatedSavingsPercent: 150, // clamped to 100
    rebates: -50,
  });

  assert.equal(result.grossProjectCost, 0);
  assert.equal(result.netProjectCost, 0);
  assert.equal(result.annualSavings, 0);
  assert.equal(result.monthlySavings, 0);
  assert.equal(result.paybackYears, null);
});
