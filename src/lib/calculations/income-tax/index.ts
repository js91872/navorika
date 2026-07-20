export interface IncomeTaxInputs {
  financialYear: string;
  regime: 'new' | 'old';
  income: number;
  deductions: number;
  hra: number;
  section80c: number;
  section80d: number;
  nps: number;
}

export interface IncomeTaxResult {
  totalIncome: number;
  totalDeductions: number;
  taxableIncome: number;
  taxAmount: number;
  healthAndEducationCess: number;
  totalTax: number;
  effectiveTaxRate: number;
  taxBreakdown: {
    slab: string;
    amount: number;
    tax: number;
  }[];
}

// New Regime Slabs (2025-26)
const NEW_REGIME_SLABS = [
  { min: 0, max: 300000, rate: 0 },
  { min: 300001, max: 700000, rate: 5 },
  { min: 700001, max: 1000000, rate: 10 },
  { min: 1000001, max: 1200000, rate: 15 },
  { min: 1200001, max: 1500000, rate: 20 },
  { min: 1500001, max: Infinity, rate: 30 },
];

// Old Regime Slabs (2025-26)
const OLD_REGIME_SLABS = [
  { min: 0, max: 250000, rate: 0 },
  { min: 250001, max: 500000, rate: 5 },
  { min: 500001, max: 1000000, rate: 20 },
  { min: 1000001, max: Infinity, rate: 30 },
];

export function calculateIncomeTax(inputs: IncomeTaxInputs): IncomeTaxResult {
  const { regime, income, hra, section80c, section80d, nps } = inputs;

  // Calculate total deductions
  const totalDeductions = regime === 'new' 
    ? 0 // No deductions in new regime
    : hra + section80c + section80d + nps;

  const taxableIncome = Math.max(0, income - totalDeductions);

  // Select slabs based on regime
  const slabs = regime === 'new' ? NEW_REGIME_SLABS : OLD_REGIME_SLABS;

  // Calculate tax
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
        slab: `₹${slab.min.toLocaleString()} - ₹${slab.max === Infinity ? 'Above' : slab.max.toLocaleString()}`,
        amount: slabAmount,
        tax: slabTax,
      });
      remainingIncome -= slabAmount;
    }
  }

  // Calculate Health and Education Cess (4% of tax)
  const healthAndEducationCess = taxAmount * 0.04;
  const totalTax = taxAmount + healthAndEducationCess;
  const effectiveTaxRate = income > 0 ? (totalTax / income) * 100 : 0;

  // Apply rebate under section 87A for income up to ₹7,00,000 (new regime) or ₹5,00,000 (old regime)
  let rebate = 0;
  if (regime === 'new' && taxableIncome <= 700000) {
    rebate = Math.min(taxAmount, 25000);
  } else if (regime === 'old' && taxableIncome <= 500000) {
    rebate = Math.min(taxAmount, 12500);
  }

  // Apply rebate
  const finalTax = Math.max(0, totalTax - rebate);

  return {
    totalIncome: income,
    totalDeductions,
    taxableIncome,
    taxAmount: finalTax - healthAndEducationCess + (rebate > 0 ? rebate : 0),
    healthAndEducationCess,
    totalTax: finalTax,
    effectiveTaxRate,
    taxBreakdown,
  };
}
