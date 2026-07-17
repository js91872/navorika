export interface CompoundInterestResult {
  investedAmount: number;
  interestEarned: number;
  maturityAmount: number;
}

export function calculateCompoundInterest(
  principal: number,
  annualRate: number,
  years: number,
  frequency: number
): CompoundInterestResult {

  const rate = annualRate / 100;

  const maturityAmount =
    principal *
    Math.pow(
      1 + rate / frequency,
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