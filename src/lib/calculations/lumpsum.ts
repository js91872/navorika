export interface LumpsumResult {
  investedAmount: number;
  interestEarned: number;
  maturityAmount: number;
}

export function calculateLumpsum(
  investment: number,
  annualRate: number,
  years: number
): LumpsumResult {

  const maturityAmount =
    investment *
    Math.pow(1 + annualRate / 100, years);

  const interestEarned =
    maturityAmount - investment;

  return {
    investedAmount: investment,
    interestEarned,
    maturityAmount,
  };
}