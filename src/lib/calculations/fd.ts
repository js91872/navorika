export interface FDResult {
  investedAmount: number;
  interestEarned: number;
  maturityAmount: number;
}

export function calculateFD(
  principal: number,
  annualRate: number,
  years: number,
  frequency: number
): FDResult {
  const maturityAmount =
    principal *
    Math.pow(
      1 + annualRate / (100 * frequency),
      frequency * years
    );

  const interestEarned =
    maturityAmount - principal;

  return {
    investedAmount: principal,
    interestEarned,
    maturityAmount,
  };
}