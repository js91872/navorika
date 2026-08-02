export interface TaxInputs {
  annualIncome: number;
  regime: 'new' | 'old';
  age: number;
  deductions?: {
    section80C: number;
    section80D: number;
    section24: number;
    nps: number;
    other: number;
  };
  hra?: {
    rentPaid: number;
    basicSalary: number;
    cityType: 'metro' | 'non-metro';
  };
}

export interface TaxResult {
  taxableIncome: number;
  totalTax: number;
  cess: number;
  surcharge: number;
  totalLiability: number;
  effectiveRate: number;
  breakdown: Array<{
    slab: string;
    rate: number;
    income: number;
    tax: number;
  }>;
  savings: {
    totalDeductions: number;
    taxSaved: number;
  };
}

const NEW_REGIME_SLABS = [
  { min: 0, max: 300000, rate: 0 },
  { min: 300000, max: 600000, rate: 5 },
  { min: 600000, max: 900000, rate: 10 },
  { min: 900000, max: 1200000, rate: 15 },
  { min: 1200000, max: 1500000, rate: 20 },
  { min: 1500000, max: Infinity, rate: 30 },
];

const OLD_REGIME_SLABS = [
  { min: 0, max: 250000, rate: 0 },
  { min: 250000, max: 500000, rate: 5 },
  { min: 500000, max: 1000000, rate: 20 },
  { min: 1000000, max: Infinity, rate: 30 },
];

export function calculateTax(inputs: TaxInputs): TaxResult {
  const { annualIncome, regime, age, deductions = {}, hra } = inputs;
  
  let hraExemption = 0;
  if (hra) {
    const actualHRA = hra.basicSalary * 0.5;
    const rentExcess = hra.rentPaid - (hra.basicSalary * 0.1);
    const cityLimit = hra.cityType === 'metro' ? hra.basicSalary * 0.5 : hra.basicSalary * 0.4;
    hraExemption = Math.min(actualHRA, rentExcess, cityLimit);
  }

  let totalDeductions = 0;
  if (regime === 'old') {
    totalDeductions = Math.min(deductions.section80C || 0, 150000) +
      Math.min(deductions.section80D || 0, 25000) +
      (deductions.section24 || 0) +
      Math.min(deductions.nps || 0, 50000) +
      hraExemption +
      (deductions.other || 0);
  }

  const taxableIncome = Math.max(0, annualIncome - totalDeductions);
  const slabs = regime === 'new' ? NEW_REGIME_SLABS : OLD_REGIME_SLABS;
  
  let totalTax = 0;
  const breakdown: TaxResult['breakdown'] = [];
  let remainingIncome = taxableIncome;

  for (const slab of slabs) {
    if (remainingIncome <= 0) break;
    const taxableAmount = Math.min(remainingIncome, slab.max - slab.min);
    if (taxableAmount > 0) {
      const tax = (taxableAmount * slab.rate) / 100;
      totalTax += tax;
      breakdown.push({
        slab: `₹${(slab.min/1000).toFixed(0)}K - ${slab.max === Infinity ? 'Above' : `₹${(slab.max/1000).toFixed(0)}K`}`,
        rate: slab.rate,
        income: Math.round(taxableAmount),
        tax: Math.round(tax),
      });
      remainingIncome -= taxableAmount;
    }
  }

  if (totalTax > 0 && taxableIncome <= 500000) {
    const rebate = Math.min(totalTax, 12500);
    totalTax -= rebate;
  }

  const cess = totalTax * 0.04;
  
  let surcharge = 0;
  if (taxableIncome > 5000000) surcharge = totalTax * 0.10;
  if (taxableIncome > 10000000) surcharge = totalTax * 0.15;
  if (taxableIncome > 20000000) surcharge = totalTax * 0.25;
  if (taxableIncome > 50000000) surcharge = totalTax * 0.37;

  const totalLiability = totalTax + cess + surcharge;
  const effectiveRate = (totalLiability / annualIncome) * 100;

  return {
    taxableIncome: Math.round(taxableIncome),
    totalTax: Math.round(totalTax),
    cess: Math.round(cess),
    surcharge: Math.round(surcharge),
    totalLiability: Math.round(totalLiability),
    effectiveRate: Number(effectiveRate.toFixed(1)),
    breakdown,
    savings: {
      totalDeductions: Math.round(totalDeductions),
      taxSaved: Math.round((totalDeductions * 0.30)),
    },
  };
}

export function compareRegimes(income: number, deductions: number): {
  newRegime: TaxResult;
  oldRegime: TaxResult;
  recommendation: 'new' | 'old';
  savings: number;
} {
  const newResult = calculateTax({
    annualIncome: income,
    regime: 'new',
    age: 30,
  });

  const oldResult = calculateTax({
    annualIncome: income,
    regime: 'old',
    age: 30,
    deductions: {
      section80C: Math.min(deductions, 150000),
      section80D: 25000,
    },
  });

  const savings = Math.abs(newResult.totalLiability - oldResult.totalLiability);
  const recommendation = newResult.totalLiability < oldResult.totalLiability ? 'new' : 'old';

  return {
    newRegime: newResult,
    oldRegime: oldResult,
    recommendation,
    savings,
  };
}
