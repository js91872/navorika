import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateEMI } from './emi.ts';
import { calculateCapRate, calculateRentalCashFlow } from './realEstate.ts';
import { calculateStartupRunway } from './saasMetrics.ts';
import { calculateLlmCost } from './cloudCosts.ts';

test('loan EMI matches a standard monthly amortization reference case', () => {
  const result = calculateEMI({ principal: 100000, rate: 12, tenure: 12 });
  assert.equal(result.monthlyPayment, 8885);
  assert.equal(result.amortizationSchedule.length, 12);
  assert.equal(result.amortizationSchedule.at(-1).balance, 0);
});
test('loan EMI handles a legitimate zero-interest loan', () => {
  const result = calculateEMI({ principal: 12000, rate: 0, tenure: 12 });
  assert.equal(result.monthlyPayment, 1000); assert.equal(result.totalInterest, 0);
});
test('loan EMI rejects invalid principal, rate, and term', () => {
  assert.throws(() => calculateEMI({ principal: 0, rate: 5, tenure: 12 }), RangeError);
  assert.throws(() => calculateEMI({ principal: 1000, rate: -1, tenure: 12 }), RangeError);
  assert.throws(() => calculateEMI({ principal: 1000, rate: 1, tenure: 0 }), RangeError);
  assert.throws(() => calculateEMI({ principal: 1000, rate: 1, tenure: 1201 }), RangeError);
});
test('rental cash flow keeps operating expenses and debt service separate', () => {
  const result = calculateRentalCashFlow({ monthlyRent: 2000, otherIncome: 100, vacancyPercent: 5, propertyTax: 200, insurance: 100, maintenance: 150, management: 100, hoa: 0, utilities: 50, otherExpenses: 0, debtService: 900 });
  assert.equal(result.effectiveIncome, 1995); assert.equal(result.noi, 1395); assert.equal(result.monthlyCashFlow, 495);
});
test('rental cash flow sanitizes non-finite and negative inputs', () => {
  const result = calculateRentalCashFlow({ monthlyRent: Number.NaN, otherIncome: -1, vacancyPercent: 200, propertyTax: 0, insurance: 0, maintenance: 0, management: 0, hoa: 0, utilities: 0, otherExpenses: 0, debtService: 0 });
  assert.equal(result.grossIncome, 0); assert.equal(result.monthlyCashFlow, 0);
});
test('cap rate uses NOI and returns null when property value is zero', () => {
  assert.equal(calculateCapRate({ propertyValue: 250000, annualRent: 30000, vacancyPercent: 5, annualOperatingExpenses: 8500 }).capRate, 8);
  assert.equal(calculateCapRate({ propertyValue: 0, annualRent: 1, vacancyPercent: 0, annualOperatingExpenses: 0 }).capRate, null);
});
test('startup runway distinguishes burn from a profitable operation', () => {
  assert.equal(calculateStartupRunway({ cash: 120000, monthlyRevenue: 10000, monthlyExpenses: 20000 }).simpleRunwayMonths, 12);
  assert.equal(calculateStartupRunway({ cash: 10, monthlyRevenue: 20, monthlyExpenses: 10 }).profitable, true);
});
test('LLM cost separates cached, uncached, and output token pricing', () => {
  const result = calculateLlmCost({ inputTokensPerRequest: 1000, outputTokensPerRequest: 500, cachedInputTokensPerRequest: 400, requestsPerDay: 100, daysPerMonth: 30, inputPricePerMillion: 2, outputPricePerMillion: 8, cachedInputPricePerMillion: 0.5 });
  assert.equal(result.inputCost, 4.2); assert.equal(result.outputCost, 12); assert.equal(result.monthlyCost, 16.2);
});
test('LLM cost caps cached tokens at total input and handles no requests', () => {
  const result = calculateLlmCost({ inputTokensPerRequest: 100, outputTokensPerRequest: 0, cachedInputTokensPerRequest: 1000, requestsPerDay: 0, daysPerMonth: 30, inputPricePerMillion: 2, outputPricePerMillion: 8, cachedInputPricePerMillion: 0.5 });
  assert.equal(result.cachedTokensMonth, 0); assert.equal(result.costPerRequest, 0);
});
