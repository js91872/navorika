import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateLumpsumInvestment,
  calculateSavingsGoal,
  calculateMortgageAffordability,
  calculateBreakEven,
  calculateProfitMarginMarkup,
} from './financePlanning.ts';

test('lumpsumInvestment: compounds annually over 10 years at 10%', () => {
  const result = calculateLumpsumInvestment({
    initialInvestment: 100000,
    expectedAnnualReturnPercent: 10,
    timeHorizonYears: 10,
    compoundingFrequencyPerYear: 1,
    estimatedInflationRatePercent: 3,
  });

  // 100,000 * 1.10^10 = 259,374.246 -> 259374
  assert.equal(result.investedPrincipal, 100000);
  assert.equal(result.nominalMaturityValue, 259374);
  assert.equal(result.totalInterestEarned, 159374);
  // Real value: 259374.246 / (1.03^10) = 193003
  assert.equal(result.inflationAdjustedValue, 192999);
  assert.equal(result.wealthGainMultiple, 2.59);
});

test('lumpsumInvestment: handles zero return and zero duration safely', () => {
  const zeroReturn = calculateLumpsumInvestment({
    initialInvestment: 50000,
    expectedAnnualReturnPercent: 0,
    timeHorizonYears: 5,
  });
  assert.equal(zeroReturn.nominalMaturityValue, 50000);
  assert.equal(zeroReturn.totalInterestEarned, 0);
  assert.equal(zeroReturn.wealthGainMultiple, 1);

  const zeroDuration = calculateLumpsumInvestment({
    initialInvestment: 50000,
    expectedAnnualReturnPercent: 8,
    timeHorizonYears: 0,
  });
  assert.equal(zeroDuration.nominalMaturityValue, 50000);
  assert.equal(zeroDuration.totalInterestEarned, 0);
});

test('savingsGoal: calculates monthly contribution required for $100k in 5 years at 6%', () => {
  const result = calculateSavingsGoal({
    targetGoalAmount: 100000,
    currentSavings: 10000,
    yearsToReachGoal: 5,
    expectedAnnualInterestRatePercent: 6,
  });

  // FV of 10000 at 6% over 5 yrs monthly compounded: ~13488.5
  // Deficit: ~86511.5
  // PMT required: ~$1240 - $1245
  assert.ok(result.requiredMonthlySavings >= 1230 && result.requiredMonthlySavings <= 1250);
  assert.equal(result.requiredAnnualSavings, result.requiredMonthlySavings * 12);
  assert.ok(result.totalInterestEarned > 10000);
  assert.ok(result.interestFundingSharePercent > 10 && result.interestFundingSharePercent < 30);
});

test('savingsGoal: handles zero interest and goal already reached', () => {
  const zeroInterest = calculateSavingsGoal({
    targetGoalAmount: 12000,
    currentSavings: 0,
    yearsToReachGoal: 1,
    expectedAnnualInterestRatePercent: 0,
  });
  assert.equal(zeroInterest.requiredMonthlySavings, 1000);
  assert.equal(zeroInterest.totalInterestEarned, 0);

  const goalMet = calculateSavingsGoal({
    targetGoalAmount: 10000,
    currentSavings: 15000,
    yearsToReachGoal: 3,
    expectedAnnualInterestRatePercent: 5,
  });
  assert.equal(goalMet.requiredMonthlySavings, 0);
  assert.equal(goalMet.requiredAnnualSavings, 0);
});

test('mortgageAffordability: calculates max home price based on income and DTI', () => {
  const result = calculateMortgageAffordability({
    annualGrossIncome: 120000,
    monthlyDebts: 500,
    downPaymentAmount: 50000,
    mortgageInterestRatePercent: 6.5,
    loanTermYears: 30,
    annualPropertyTaxRatePercent: 1.2,
    annualHomeownersInsurance: 1400,
    targetFrontEndDtiPercent: 28,
    targetBackEndDtiPercent: 36,
  });

  // Monthly income: 10,000.
  // Front limit (28%): $2,800 PITI.
  // Back limit (36%): $3,600 total debt -> $3,100 PITI max.
  // Binding constraint is front-end ($2,800).
  assert.ok(result.maxHomePurchasePrice > 350000 && result.maxHomePurchasePrice < 500000);
  assert.ok(result.maxMortgageLoanAmount > 300000);
  assert.ok(result.monthlyPaymentPiti <= 2850);
  assert.ok(result.effectiveFrontEndDti <= 28.5);
});

test('mortgageAffordability: handles extreme debt or zero income safely', () => {
  const heavyDebt = calculateMortgageAffordability({
    annualGrossIncome: 60000,
    monthlyDebts: 2500, // exceeds 36% limit ($1,800)
    downPaymentAmount: 20000,
    mortgageInterestRatePercent: 7,
    loanTermYears: 30,
  });
  assert.equal(heavyDebt.maxHomePurchasePrice, 20000);
  assert.equal(heavyDebt.maxMortgageLoanAmount, 0);
  assert.equal(heavyDebt.principalAndInterest, 0);

  const zeroIncome = calculateMortgageAffordability({
    annualGrossIncome: 0,
    monthlyDebts: 0,
    downPaymentAmount: 0,
    mortgageInterestRatePercent: 6,
  });
  assert.equal(zeroIncome.maxHomePurchasePrice, 0);
  assert.equal(zeroIncome.maxMortgageLoanAmount, 0);
});

test('breakEven: calculates break-even point and margin of safety', () => {
  const result = calculateBreakEven({
    fixedCosts: 30000,
    variableCostPerUnit: 25,
    salePricePerUnit: 65,
    plannedUnitSales: 1000,
  });

  // CM = 40, CM ratio = 61.54%
  // Break-even units = 30000 / 40 = 750 units
  // Break-even revenue = 750 * 65 = 48750
  assert.equal(result.contributionMarginPerUnit, 40);
  assert.equal(result.contributionMarginRatioPercent, 61.5);
  assert.equal(result.breakEvenUnits, 750);
  assert.equal(result.breakEvenRevenue, 48750);
  // Profit at 1000: (1000 * 40) - 30000 = 10000
  assert.equal(result.projectedNetProfit, 10000);
  // Margin of safety: (1000 - 750) / 1000 = 25%
  assert.equal(result.marginOfSafetyPercent, 25);
});

test('breakEven: handles zero contribution margin without dividing by zero', () => {
  const result = calculateBreakEven({
    fixedCosts: 10000,
    variableCostPerUnit: 50,
    salePricePerUnit: 40, // selling at a loss
    plannedUnitSales: 100,
  });
  assert.equal(result.contributionMarginPerUnit, -10);
  assert.equal(result.breakEvenUnits, 0);
  assert.equal(result.breakEvenRevenue, 0);
  assert.ok(result.projectedNetProfit < 0);
});

test('profitMarginMarkup: computes margin, markup, and pricing targets', () => {
  const result = calculateProfitMarginMarkup({
    costAmount: 60,
    sellingPrice: 100,
    targetMarkupPercent: 50,
    targetMarginPercent: 40,
  });

  // Profit: 40
  // Margin: 40%
  // Markup: 66.67%
  // Multiplier: 1.67
  assert.equal(result.grossProfitAmount, 40);
  assert.equal(result.actualMarginPercent, 40);
  assert.equal(result.actualMarkupPercent, 66.67);
  assert.equal(result.costMultiplier, 1.67);
  // Target 50% markup on 60: 60 * 1.5 = 90
  assert.equal(result.priceFromTargetMarkup, 90);
  // Target 40% margin on 60: 60 / (1 - 0.4) = 100
  assert.equal(result.priceFromTargetMargin, 100);
});

test('profitMarginMarkup: handles zero cost and zero selling price safely', () => {
  const zeroCost = calculateProfitMarginMarkup({
    costAmount: 0,
    sellingPrice: 50,
  });
  assert.equal(zeroCost.grossProfitAmount, 50);
  assert.equal(zeroCost.actualMarginPercent, 100);
  assert.equal(zeroCost.actualMarkupPercent, 0);

  const zeroPrice = calculateProfitMarginMarkup({
    costAmount: 50,
    sellingPrice: 0,
  });
  assert.equal(zeroPrice.grossProfitAmount, -50);
  assert.equal(zeroPrice.actualMarginPercent, 0);
  assert.equal(zeroPrice.actualMarkupPercent, -100);
});
