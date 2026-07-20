export interface IncomeTaxResult {
  totalIncome: number;
  totalDeductions: number;
  taxableIncome: number;
  taxAmount: number;
  healthAndEducationCess: number;
  totalTax: number;
  effectiveTaxRate: number;
  rebateApplied: number;
  taxBreakdown: {
    slab: string;
    amount: number;
    tax: number;
  }[];
}

// New Regime Slabs for FY 2026-27 (Income-tax Rules, 2026)
const NEW_REGIME_SLABS = [
  { min: 0, max: 300000, rate: 0 },
  { min: 300001, max: 700000, rate: 5 },
  { min: 700001, max: 1000000, rate: 10 },
  { min: 1000001, max: 1200000, rate: 15 },
  { min: 1200001, max: 1500000, rate: 20 },
  { min: 1500001, max: Infinity, rate: 30 },
];

// Old Regime Slabs for FY 2026-27
const OLD_REGIME_SLABS = [
  { min: 0, max: 250000, rate: 0 },
  { min: 250001, max: 500000, rate: 5 },
  { min: 500001, max: 1000000, rate: 20 },
  { min: 1000001, max: Infinity, rate: 30 },
];

export function calculateIncomeTax(
  income: number,
  regime: string,
  hra: number,
  section80c: number,
  section80d: number,
  nps: number,
  standardDeduction: number = 0
): IncomeTaxResult {
  let totalDeductions = 0;
  
  if (regime === 'old') {
    totalDeductions = hra + section80c + section80d + nps + standardDeduction;
  } else {
    totalDeductions = standardDeduction;
  }

  const taxableIncome = Math.max(0, income - totalDeductions);
  const slabs = regime === 'new' ? NEW_REGIME_SLABS : OLD_REGIME_SLABS;

  let taxAmount = 0;
  let remainingIncome = taxableIncome;
  const taxBreakdown: { slab: string; amount: number; tax: number }[] = [];

  for (const slab of slabs) {
    if (remainingIncome <= 0) break;

    const slabAmount = Math.min(remainingIncome, slab.max - slab.min);
    if (slabAmount > 0) {
      const slabTax = (slabAmount * slab.rate) / 100;
      taxAmount += slabTax;
      taxBreakdown.push({
        slab: slab.max === Infinity 
          ? `Above ₹${slab.min.toLocaleString()}` 
          : `₹${slab.min.toLocaleString()} - ₹${slab.max.toLocaleString()}`,
        amount: slabAmount,
        tax: slabTax,
      });
      remainingIncome -= slabAmount;
    }
  }

  let rebate = 0;
  if (regime === 'new' && taxableIncome <= 700000) {
    rebate = Math.min(taxAmount, 25000);
  } else if (regime === 'old' && taxableIncome <= 500000) {
    rebate = Math.min(taxAmount, 12500);
  }

  const taxAfterRebate = Math.max(0, taxAmount - rebate);
  const healthAndEducationCess = taxAfterRebate * 0.04;

  const totalTax = taxAfterRebate + healthAndEducationCess;
  const effectiveTaxRate = income > 0 ? (totalTax / income) * 100 : 0;

  return {
    totalIncome: income,
    totalDeductions,
    taxableIncome,
    taxAmount: taxAmount,
    healthAndEducationCess,
    totalTax,
    effectiveTaxRate,
    rebateApplied: rebate,
    taxBreakdown,
  };
}
