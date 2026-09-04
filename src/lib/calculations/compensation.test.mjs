import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateTotalCompensation } from './compensation.ts';

test('job offer total comp matches default reference scenario', () => {
  const result = calculateTotalCompensation({
    salary: 100000,
    bonus: 10000,
    equityTotal: 40000,
    vestingYears: 4,
    retirement: 5000,
    benefits: 5000,
    signingBonus: 10000,
  });

  assert.equal(result.annualizedEquity, 10000);
  assert.equal(result.recurringComp, 130000);
  assert.equal(result.firstYearComp, 140000);
  assert.ok(Math.abs(result.monthlyEquivalent - 10833.333) < 0.01);
  assert.ok(result.baseSalaryShare !== null && Math.abs(result.baseSalaryShare - 76.923) < 0.01);
});

test('job offer total comp handles zero bonus and equity cleanly', () => {
  const result = calculateTotalCompensation({
    salary: 80000,
    bonus: 0,
    equityTotal: 0,
    vestingYears: 4,
    retirement: 4000,
    benefits: 2000,
    signingBonus: 0,
  });

  assert.equal(result.annualizedEquity, 0);
  assert.equal(result.recurringComp, 86000);
  assert.equal(result.firstYearComp, 86000);
  assert.ok(result.baseSalaryShare !== null && Math.abs(result.baseSalaryShare - (80000 / 86000) * 100) < 0.01);
});

test('job offer total comp sanitizes non-finite inputs safely without NaN', () => {
  const result = calculateTotalCompensation({
    salary: Number.NaN,
    bonus: -1000,
    equityTotal: Number.NaN,
    vestingYears: 0,
    retirement: -500,
    benefits: -200,
    signingBonus: Number.NaN,
  });

  assert.equal(result.annualizedEquity, 0);
  assert.equal(result.recurringComp, 0);
  assert.equal(result.firstYearComp, 0);
  assert.equal(result.monthlyEquivalent, 0);
  assert.equal(result.baseSalaryShare, null);
});
