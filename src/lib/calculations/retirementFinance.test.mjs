import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateEpfProjection, calculateNpsProjection } from './retirementFinance.ts';

const closeTo = (actual, expected, tolerance = 0.01) => {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} was not within ${tolerance} of ${expected}`);
};

const baseEpf = {
  monthlyContributionWage: 15_000,
  employeeContributionRate: 12,
  annualInterestRate: 0,
  openingBalance: 0,
  annualSalaryGrowthRate: 0,
  years: 1,
};

test('EPF: constant wage separates employee, employer EPF, and EPS contributions', () => {
  const result = calculateEpfProjection(baseEpf);
  assert.equal(result.employeeContributions, 21_600);
  assert.equal(result.employerEpfContributions, 6_600);
  assert.equal(result.epsContributions, 15_000);
  assert.equal(result.closingEpfBalance, 28_200);
});

test('EPF: opening balance is preserved', () => {
  assert.equal(calculateEpfProjection({ ...baseEpf, openingBalance: 100_000 }).closingEpfBalance, 128_200);
});

test('EPF: annual salary growth changes the next 12 monthly contributions', () => {
  const result = calculateEpfProjection({ ...baseEpf, monthlyContributionWage: 10_000, years: 2, annualSalaryGrowthRate: 10 });
  assert.equal(result.closingEpfBalance, 39_492);
  assert.equal(result.finalMonthlyContributionWage, 11_000);
});

test('EPF: zero salary growth keeps contributions constant', () => {
  const result = calculateEpfProjection({ ...baseEpf, monthlyContributionWage: 10_000, years: 2 });
  assert.equal(result.closingEpfBalance, 37_608);
});

test('EPF: zero tenure returns the opening balance without contributions', () => {
  const result = calculateEpfProjection({ ...baseEpf, openingBalance: 42_000, years: 0 });
  assert.equal(result.closingEpfBalance, 42_000);
  assert.equal(result.employeeContributions, 0);
});

test('EPF: EPS allocation is capped at the statutory wage ceiling', () => {
  const result = calculateEpfProjection({ ...baseEpf, monthlyContributionWage: 30_000, years: 1 / 12 });
  assert.equal(result.epsContributions, 1_250);
  assert.equal(result.employerEpfContributions, 2_350);
});

test('EPF: a custom employee rate changes only the employee share', () => {
  const result = calculateEpfProjection({ ...baseEpf, employeeContributionRate: 15, years: 1 / 12 });
  assert.equal(result.employeeContributions, 2_250);
  assert.equal(result.employerEpfContributions, 550);
});

test('EPF: opening balance earns interest for the full projection year', () => {
  const result = calculateEpfProjection({ ...baseEpf, monthlyContributionWage: 0, openingBalance: 12_000, annualInterestRate: 12 });
  assert.equal(result.interestEarned, 1_440);
  assert.equal(result.closingEpfBalance, 13_440);
});

test('EPF: invalid and non-finite inputs are rejected', () => {
  assert.throws(() => calculateEpfProjection({ ...baseEpf, monthlyContributionWage: Number.NaN }), /finite number/);
  assert.throws(() => calculateEpfProjection({ ...baseEpf, years: -1 }), /between 0 and 60/);
});

const baseNps = {
  openingCorpus: 0,
  monthlyContribution: 1_000,
  annualContributionIncreaseRate: 0,
  annualReturnRate: 0,
  years: 1,
  annuityAllocationRate: 20,
  annualAnnuityRate: 6,
};

test('NPS: monthly end-of-period contributions compound at the assumed corpus return', () => {
  const result = calculateNpsProjection({ ...baseNps, annualReturnRate: 12 });
  closeTo(result.projectedCorpus, 12_682.503013, 0.001);
});

test('NPS: opening corpus compounds independently of new contributions', () => {
  const result = calculateNpsProjection({ ...baseNps, openingCorpus: 10_000, monthlyContribution: 0, annualReturnRate: 12 });
  closeTo(result.projectedCorpus, 11_268.250301, 0.001);
});

test('NPS: annual contribution increase applies after each completed year', () => {
  const result = calculateNpsProjection({ ...baseNps, years: 2, annualContributionIncreaseRate: 10 });
  assert.equal(result.projectedCorpus, 25_200);
  assert.equal(result.newContributions, 25_200);
});

test('NPS: zero contribution growth and zero return preserve all contributions', () => {
  const result = calculateNpsProjection({ ...baseNps, years: 2 });
  assert.equal(result.projectedCorpus, 24_000);
  assert.equal(result.investmentGain, 0);
});

test('NPS: corpus equals withdrawable amount plus annuity allocation', () => {
  const result = calculateNpsProjection({ ...baseNps, openingCorpus: 100_000, monthlyContribution: 0, annuityAllocationRate: 35 });
  closeTo(result.withdrawableAmount + result.annuityAllocation, result.projectedCorpus);
});

test('NPS: annuity payout rate is separate from corpus return', () => {
  const result = calculateNpsProjection({ ...baseNps, openingCorpus: 100_000, monthlyContribution: 0, years: 0, annualAnnuityRate: 8 });
  assert.equal(result.annuityAllocation, 20_000);
  closeTo(result.estimatedMonthlyPension, 133.333333);
});

test('NPS: a one-month horizon grows opening corpus before the monthly contribution', () => {
  const result = calculateNpsProjection({ ...baseNps, openingCorpus: 10_000, annualReturnRate: 12, years: 1 / 12 });
  assert.equal(result.projectedCorpus, 11_100);
});

test('NPS: invalid annuity percentages and non-finite contributions are rejected', () => {
  assert.throws(() => calculateNpsProjection({ ...baseNps, annuityAllocationRate: 101 }), /between 0 and 100/);
  assert.throws(() => calculateNpsProjection({ ...baseNps, monthlyContribution: Number.POSITIVE_INFINITY }), /finite number/);
});
