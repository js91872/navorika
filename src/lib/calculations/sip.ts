export interface SIPResult {
  investedAmount: number;
  estimatedReturns: number;
  maturityAmount: number;
}

export function calculateSIP(
  monthlyInvestment: number,
  annualReturn: number,
  years: number
): SIPResult {
  const monthlyRate = annualReturn / 12 / 100;
  const months = years * 12;

  const maturityAmount =
    monthlyInvestment *
    (((Math.pow(1 + monthlyRate, months) - 1) /
      monthlyRate) *
      (1 + monthlyRate));

  const investedAmount = monthlyInvestment * months;

  const estimatedReturns =
    maturityAmount - investedAmount;

  return {
    investedAmount,
    estimatedReturns,
    maturityAmount,
  };
}