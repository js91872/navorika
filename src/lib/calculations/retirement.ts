export interface RetirementResult {
  futureCorpus: number;
  monthlyCorpus: number;
  totalInvestment: number;
  totalReturns: number;
}

export function calculateRetirement(
  monthlyInvestment: number,
  annualReturn: number,
  years: number
): RetirementResult {
  if (
    monthlyInvestment <= 0 ||
    annualReturn <= 0 ||
    years <= 0
  ) {
    return {
      futureCorpus: 0,
      monthlyCorpus: 0,
      totalInvestment: 0,
      totalReturns: 0,
    };
  }

  const monthlyRate = annualReturn / 100 / 12;
  const months = years * 12;

  const futureCorpus =
    monthlyInvestment *
    (((Math.pow(1 + monthlyRate, months) - 1) /
      monthlyRate) *
      (1 + monthlyRate));

  const totalInvestment =
    monthlyInvestment * months;

  const totalReturns =
    futureCorpus - totalInvestment;

  return {
    futureCorpus,
    monthlyCorpus: monthlyInvestment,
    totalInvestment,
    totalReturns,
  };
}