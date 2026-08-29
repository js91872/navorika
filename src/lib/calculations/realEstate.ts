const n = (value: number) => Number.isFinite(value) ? Math.max(0, value) : 0;
const rate = (value: number) => Math.min(100, n(value)) / 100;

export function calculateRentalCashFlow(input: { monthlyRent: number; otherIncome: number; vacancyPercent: number; propertyTax: number; insurance: number; maintenance: number; management: number; hoa: number; utilities: number; otherExpenses: number; debtService: number }) {
  const grossIncome = n(input.monthlyRent) + n(input.otherIncome);
  const vacancyLoss = grossIncome * rate(input.vacancyPercent);
  const effectiveIncome = grossIncome - vacancyLoss;
  const operatingExpenses = n(input.propertyTax) + n(input.insurance) + n(input.maintenance) + n(input.management) + n(input.hoa) + n(input.utilities) + n(input.otherExpenses);
  const noi = effectiveIncome - operatingExpenses;
  const monthlyCashFlow = noi - n(input.debtService);
  return { grossIncome, vacancyLoss, effectiveIncome, operatingExpenses, noi, debtService: n(input.debtService), monthlyCashFlow, annualCashFlow: monthlyCashFlow * 12 };
}

export function calculateRentalYield(input: { propertyValue: number; annualRent: number; annualExpenses: number }) {
  const value = n(input.propertyValue);
  const rent = n(input.annualRent);
  const netIncome = rent - n(input.annualExpenses);
  return { annualRent: rent, netIncome, grossYield: value > 0 ? rent / value * 100 : null, netYield: value > 0 ? netIncome / value * 100 : null };
}

export function calculateCapRate(input: { propertyValue: number; annualRent: number; vacancyPercent: number; annualOperatingExpenses: number }) {
  const effectiveIncome = n(input.annualRent) * (1 - rate(input.vacancyPercent));
  const noi = effectiveIncome - n(input.annualOperatingExpenses);
  return { effectiveIncome, noi, capRate: n(input.propertyValue) > 0 ? noi / n(input.propertyValue) * 100 : null };
}

export function calculateCashOnCash(input: { downPayment: number; closingCosts: number; rehabCosts: number; otherInitialCosts: number; annualCashFlow: number }) {
  const cashInvested = n(input.downPayment) + n(input.closingCosts) + n(input.rehabCosts) + n(input.otherInitialCosts);
  const annualCashFlow = Number.isFinite(input.annualCashFlow) ? input.annualCashFlow : 0;
  return { cashInvested, annualCashFlow, returnPercent: cashInvested > 0 ? annualCashFlow / cashInvested * 100 : null };
}

export function calculateBrrrr(input: { purchasePrice: number; purchaseCosts: number; rehabCosts: number; afterRepairValue: number; refinanceLtvPercent: number; refinanceCosts: number; monthlyRent: number; vacancyPercent: number; monthlyOperatingExpenses: number; monthlyDebtService: number }) {
  const totalProjectCash = n(input.purchasePrice) + n(input.purchaseCosts) + n(input.rehabCosts);
  const refinanceLoan = n(input.afterRepairValue) * rate(input.refinanceLtvPercent);
  const cashRecovered = Math.max(0, refinanceLoan - n(input.refinanceCosts));
  const cashLeftInDeal = Math.max(0, totalProjectCash - cashRecovered);
  const effectiveRent = n(input.monthlyRent) * (1 - rate(input.vacancyPercent));
  const noi = effectiveRent - n(input.monthlyOperatingExpenses);
  const monthlyCashFlow = noi - n(input.monthlyDebtService);
  const annualCashFlow = monthlyCashFlow * 12;
  return { totalProjectCash, refinanceLoan, cashRecovered, cashLeftInDeal, noi, monthlyCashFlow, annualCashFlow, cashOnCashPercent: cashLeftInDeal > 0 ? annualCashFlow / cashLeftInDeal * 100 : null };
}

export function calculateFlip(input: { purchasePrice: number; acquisitionCosts: number; rehabCost: number; financingCost: number; holdingCosts: number; sellingPrice: number; sellingCosts: number; otherCosts: number }) {
  const costBasis = n(input.purchasePrice) + n(input.acquisitionCosts) + n(input.rehabCost) + n(input.financingCost) + n(input.holdingCosts) + n(input.otherCosts);
  const netSaleProceeds = n(input.sellingPrice) - n(input.sellingCosts);
  const profit = netSaleProceeds - costBasis;
  return { costBasis, netSaleProceeds, profit, roiPercent: costBasis > 0 ? profit / costBasis * 100 : null, profitMarginPercent: n(input.sellingPrice) > 0 ? profit / n(input.sellingPrice) * 100 : null, breakEvenSalePrice: costBasis + n(input.sellingCosts) };
}
