/**
 * Pure calculation functions for Finance Planning & Analysis (Batch 08 Wave B).
 * - Lumpsum Investment Calculator
 * - Savings Goal Calculator
 * - Mortgage Affordability Calculator
 * - Break-Even Calculator
 * - Profit Margin & Markup Calculator
 */

export interface LumpsumInvestmentInput {
  initialInvestment: number;
  expectedAnnualReturnPercent: number;
  timeHorizonYears: number;
  compoundingFrequencyPerYear?: number;
  estimatedInflationRatePercent?: number;
}

export interface LumpsumInvestmentResult {
  investedPrincipal: number;
  totalInterestEarned: number;
  nominalMaturityValue: number;
  inflationAdjustedValue: number;
  wealthGainMultiple: number;
}

export function calculateLumpsumInvestment(input: LumpsumInvestmentInput): LumpsumInvestmentResult {
  const p = Number.isFinite(input.initialInvestment) ? Math.max(0, input.initialInvestment) : 0;
  const r = Number.isFinite(input.expectedAnnualReturnPercent)
    ? Math.max(-100, input.expectedAnnualReturnPercent) / 100
    : 0;
  const t = Number.isFinite(input.timeHorizonYears) ? Math.max(0, input.timeHorizonYears) : 0;
  const n = Number.isFinite(input.compoundingFrequencyPerYear) && (input.compoundingFrequencyPerYear ?? 0) > 0
    ? (input.compoundingFrequencyPerYear ?? 1)
    : 1;
  const inflation = Number.isFinite(input.estimatedInflationRatePercent)
    ? Math.max(0, input.estimatedInflationRatePercent ?? 0) / 100
    : 0;

  // A = P * (1 + r/n)^(n*t)
  const compoundBase = 1 + r / n;
  const nominalMaturityValue = compoundBase > 0 ? p * Math.pow(compoundBase, n * t) : 0;
  const totalInterestEarned = nominalMaturityValue - p;

  // Inflation adjusted real purchasing power
  const inflationAdjustedValue = t > 0 && inflation > 0
    ? nominalMaturityValue / Math.pow(1 + inflation, t)
    : nominalMaturityValue;

  const wealthGainMultiple = p > 0 ? Number((nominalMaturityValue / p).toFixed(2)) : 0;

  return {
    investedPrincipal: Math.round(p),
    totalInterestEarned: Math.round(totalInterestEarned),
    nominalMaturityValue: Math.round(nominalMaturityValue),
    inflationAdjustedValue: Math.round(inflationAdjustedValue),
    wealthGainMultiple,
  };
}

export interface SavingsGoalInput {
  targetGoalAmount: number;
  currentSavings?: number;
  yearsToReachGoal: number;
  expectedAnnualInterestRatePercent?: number;
}

export interface SavingsGoalResult {
  requiredMonthlySavings: number;
  requiredAnnualSavings: number;
  totalUserContributions: number;
  totalInterestEarned: number;
  interestFundingSharePercent: number;
}

export function calculateSavingsGoal(input: SavingsGoalInput): SavingsGoalResult {
  const target = Number.isFinite(input.targetGoalAmount) ? Math.max(0, input.targetGoalAmount) : 0;
  const current = Number.isFinite(input.currentSavings) ? Math.max(0, input.currentSavings ?? 0) : 0;
  const years = Number.isFinite(input.yearsToReachGoal) ? Math.max(1 / 12, input.yearsToReachGoal) : 1;
  const annualRate = Number.isFinite(input.expectedAnnualInterestRatePercent)
    ? Math.max(0, input.expectedAnnualInterestRatePercent ?? 0) / 100
    : 0;

  const totalMonths = Math.max(1, Math.round(years * 12));
  const monthlyRate = annualRate / 12;

  // Future value of starting lump sum
  const fvInitial = monthlyRate > 0
    ? current * Math.pow(1 + monthlyRate, totalMonths)
    : current;

  const deficit = Math.max(0, target - fvInitial);

  let pmt = 0;
  if (deficit > 0) {
    if (monthlyRate === 0) {
      pmt = deficit / totalMonths;
    } else {
      // Ordinary annuity future value formula: FV = PMT * ((1+i)^n - 1) / i
      // PMT = FV * i / ((1+i)^n - 1)
      const denom = Math.pow(1 + monthlyRate, totalMonths) - 1;
      pmt = denom > 0 ? (deficit * monthlyRate) / denom : deficit / totalMonths;
    }
  }

  const requiredMonthlySavings = Math.round(pmt);
  const requiredAnnualSavings = Math.round(requiredMonthlySavings * 12);
  const totalUserContributions = Math.round(current + (requiredMonthlySavings * totalMonths));
  const totalInterestEarned = Math.max(0, Math.round(target - totalUserContributions));
  const interestFundingSharePercent = target > 0
    ? Number(((totalInterestEarned / target) * 100).toFixed(1))
    : 0;

  return {
    requiredMonthlySavings,
    requiredAnnualSavings,
    totalUserContributions,
    totalInterestEarned,
    interestFundingSharePercent,
  };
}

export interface MortgageAffordabilityInput {
  annualGrossIncome: number;
  monthlyDebts?: number;
  downPaymentAmount?: number;
  mortgageInterestRatePercent: number;
  loanTermYears?: number;
  annualPropertyTaxRatePercent?: number;
  annualHomeownersInsurance?: number;
  targetFrontEndDtiPercent?: number;
  targetBackEndDtiPercent?: number;
}

export interface MortgageAffordabilityResult {
  maxHomePurchasePrice: number;
  maxMortgageLoanAmount: number;
  monthlyPaymentPiti: number;
  principalAndInterest: number;
  monthlyPropertyTax: number;
  monthlyInsurance: number;
  effectiveFrontEndDti: number;
  effectiveBackEndDti: number;
}

export function calculateMortgageAffordability(input: MortgageAffordabilityInput): MortgageAffordabilityResult {
  const annualIncome = Number.isFinite(input.annualGrossIncome) ? Math.max(0, input.annualGrossIncome) : 0;
  const monthlyIncome = annualIncome / 12;
  const monthlyDebts = Number.isFinite(input.monthlyDebts) ? Math.max(0, input.monthlyDebts ?? 0) : 0;
  const downPayment = Number.isFinite(input.downPaymentAmount) ? Math.max(0, input.downPaymentAmount ?? 0) : 0;
  const frontDti = Number.isFinite(input.targetFrontEndDtiPercent)
    ? Math.max(0, input.targetFrontEndDtiPercent ?? 28) / 100
    : 0.28;
  const backDti = Number.isFinite(input.targetBackEndDtiPercent)
    ? Math.max(0, input.targetBackEndDtiPercent ?? 36) / 100
    : 0.36;

  const allowedFront = monthlyIncome * frontDti;
  const allowedBack = Math.max(0, (monthlyIncome * backDti) - monthlyDebts);
  const allowablePiti = Math.max(0, Math.min(allowedFront, allowedBack));

  const monthlyInsurance = Number.isFinite(input.annualHomeownersInsurance)
    ? Math.max(0, input.annualHomeownersInsurance ?? 1400) / 12
    : 1400 / 12;

  const monthlyTaxRateFactor = Number.isFinite(input.annualPropertyTaxRatePercent)
    ? Math.max(0, input.annualPropertyTaxRatePercent ?? 1.2) / 100 / 12
    : 0.012 / 12;

  const annualRate = Number.isFinite(input.mortgageInterestRatePercent)
    ? Math.max(0.1, input.mortgageInterestRatePercent) / 100
    : 0.065;
  const monthlyRate = annualRate / 12;
  const termMonths = Number.isFinite(input.loanTermYears)
    ? Math.max(1, (input.loanTermYears ?? 30) * 12)
    : 360;

  // Monthly mortgage factor f per dollar of principal: i * (1+i)^n / ((1+i)^n - 1)
  const factorPow = Math.pow(1 + monthlyRate, termMonths);
  const factor = factorPow > 1 ? (monthlyRate * factorPow) / (factorPow - 1) : 1 / termMonths;

  // Equation: AllowablePITI = Loan * factor + Price * taxRate + Insurance
  // Loan = Price - DownPayment
  // AllowablePITI = (Price - DownPayment) * factor + Price * taxRate + Insurance
  // AllowablePITI - Insurance + DownPayment * factor = Price * (factor + taxRate)
  let maxPrice = downPayment;
  const netAllowable = allowablePiti - monthlyInsurance;
  if (netAllowable > 0) {
    const rawPrice = (netAllowable + downPayment * factor) / (factor + monthlyTaxRateFactor);
    maxPrice = Math.max(downPayment, rawPrice);
  }

  const maxHomePurchasePrice = Math.round(maxPrice);
  const maxMortgageLoanAmount = Math.max(0, maxHomePurchasePrice - Math.round(downPayment));
  const principalAndInterest = Math.round(maxMortgageLoanAmount * factor);
  const monthlyPropertyTax = Math.round(maxHomePurchasePrice * monthlyTaxRateFactor);
  const roundedInsurance = Math.round(monthlyInsurance);
  const monthlyPaymentPiti = principalAndInterest + monthlyPropertyTax + roundedInsurance;

  const effectiveFrontEndDti = monthlyIncome > 0
    ? Number(((monthlyPaymentPiti / monthlyIncome) * 100).toFixed(1))
    : 0;
  const effectiveBackEndDti = monthlyIncome > 0
    ? Number((((monthlyPaymentPiti + monthlyDebts) / monthlyIncome) * 100).toFixed(1))
    : 0;

  return {
    maxHomePurchasePrice,
    maxMortgageLoanAmount,
    monthlyPaymentPiti,
    principalAndInterest,
    monthlyPropertyTax,
    monthlyInsurance: roundedInsurance,
    effectiveFrontEndDti,
    effectiveBackEndDti,
  };
}

export interface BreakEvenInput {
  fixedCosts: number;
  variableCostPerUnit: number;
  salePricePerUnit: number;
  plannedUnitSales?: number;
}

export interface BreakEvenResult {
  contributionMarginPerUnit: number;
  contributionMarginRatioPercent: number;
  breakEvenUnits: number;
  breakEvenRevenue: number;
  projectedNetProfit: number;
  marginOfSafetyPercent: number;
}

export function calculateBreakEven(input: BreakEvenInput): BreakEvenResult {
  const fixed = Number.isFinite(input.fixedCosts) ? Math.max(0, input.fixedCosts) : 0;
  const variable = Number.isFinite(input.variableCostPerUnit) ? Math.max(0, input.variableCostPerUnit) : 0;
  const price = Number.isFinite(input.salePricePerUnit) ? Math.max(0, input.salePricePerUnit) : 0;
  const planned = Number.isFinite(input.plannedUnitSales) ? Math.max(0, input.plannedUnitSales ?? 0) : 0;

  const contributionMarginPerUnit = Number((price - variable).toFixed(2));
  const contributionMarginRatioPercent = price > 0
    ? Number(((contributionMarginPerUnit / price) * 100).toFixed(1))
    : 0;

  let breakEvenUnits = 0;
  let breakEvenRevenue = 0;

  if (contributionMarginPerUnit > 0) {
    breakEvenUnits = Math.ceil(fixed / contributionMarginPerUnit);
    breakEvenRevenue = Math.round(breakEvenUnits * price);
  }

  const projectedRevenue = planned * price;
  const totalCostAtPlanned = fixed + (planned * variable);
  const projectedNetProfit = Math.round(projectedRevenue - totalCostAtPlanned);

  let marginOfSafetyPercent = 0;
  if (planned > breakEvenUnits && planned > 0) {
    marginOfSafetyPercent = Number((((planned - breakEvenUnits) / planned) * 100).toFixed(1));
  }

  return {
    contributionMarginPerUnit,
    contributionMarginRatioPercent,
    breakEvenUnits,
    breakEvenRevenue,
    projectedNetProfit,
    marginOfSafetyPercent,
  };
}

export interface ProfitMarginMarkupInput {
  costAmount: number;
  sellingPrice: number;
  targetMarkupPercent?: number;
  targetMarginPercent?: number;
}

export interface ProfitMarginMarkupResult {
  grossProfitAmount: number;
  actualMarginPercent: number;
  actualMarkupPercent: number;
  costMultiplier: number;
  priceFromTargetMarkup: number;
  priceFromTargetMargin: number;
}

export function calculateProfitMarginMarkup(input: ProfitMarginMarkupInput): ProfitMarginMarkupResult {
  const cost = Number.isFinite(input.costAmount) ? Math.max(0, input.costAmount) : 0;
  const price = Number.isFinite(input.sellingPrice) ? Math.max(0, input.sellingPrice) : 0;

  const grossProfitAmount = Number((price - cost).toFixed(2));
  const actualMarginPercent = price > 0
    ? Number(((grossProfitAmount / price) * 100).toFixed(2))
    : 0;
  const actualMarkupPercent = cost > 0
    ? Number(((grossProfitAmount / cost) * 100).toFixed(2))
    : 0;
  const costMultiplier = cost > 0 ? Number((price / cost).toFixed(2)) : 0;

  const targetMarkup = Number.isFinite(input.targetMarkupPercent) ? (input.targetMarkupPercent ?? 50) : 50;
  const priceFromTargetMarkup = Number((cost * (1 + targetMarkup / 100)).toFixed(2));

  const targetMargin = Number.isFinite(input.targetMarginPercent) ? (input.targetMarginPercent ?? 40) : 40;
  const priceFromTargetMargin = targetMargin < 100
    ? Number((cost / (1 - targetMargin / 100)).toFixed(2))
    : 0;

  return {
    grossProfitAmount,
    actualMarginPercent,
    actualMarkupPercent,
    costMultiplier,
    priceFromTargetMarkup,
    priceFromTargetMargin,
  };
}
