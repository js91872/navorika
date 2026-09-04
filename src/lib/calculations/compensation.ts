const n = (value: number | undefined) => (typeof value === 'number' && Number.isFinite(value) ? Math.max(0, value) : 0);

export interface TotalCompInput {
  salary: number;
  bonus: number;
  equityTotal: number;
  vestingYears: number;
  retirement?: number;
  benefits?: number;
  signingBonus?: number;
}

export interface TotalCompResult {
  [key: string]: number | null;
  annualizedEquity: number;
  recurringComp: number;
  firstYearComp: number;
  monthlyEquivalent: number;
  baseSalaryShare: number | null;
}

export function calculateTotalCompensation(input: TotalCompInput): TotalCompResult {
  const salary = n(input.salary);
  const bonus = n(input.bonus);
  const equityTotal = n(input.equityTotal);
  const vestingYears = Math.max(0.1, n(input.vestingYears));
  const retirement = n(input.retirement);
  const benefits = n(input.benefits);
  const signingBonus = n(input.signingBonus);

  const annualizedEquity = vestingYears > 0 ? equityTotal / vestingYears : 0;
  const recurringComp = salary + bonus + annualizedEquity + retirement + benefits;
  const firstYearComp = recurringComp + signingBonus;
  const monthlyEquivalent = recurringComp / 12;
  const baseSalaryShare = recurringComp > 0 ? (salary / recurringComp) * 100 : null;

  return {
    annualizedEquity,
    recurringComp,
    firstYearComp,
    monthlyEquivalent,
    baseSalaryShare,
  };
}
