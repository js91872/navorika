export interface RDResult {
  investedAmount: number;
  interestEarned: number;
  maturityAmount: number;
}

export function calculateRD(
  monthlyDeposit: number,
  annualRate: number,
  years: number
): RDResult {

  const monthlyRate = annualRate / 12 / 100;

  const months = years * 12;

  let maturityAmount = 0;

  for (let i = 0; i < months; i++) {

    maturityAmount +=
      monthlyDeposit *
      Math.pow(1 + monthlyRate, months - i);

  }

  const investedAmount =
    monthlyDeposit * months;

  const interestEarned =
    maturityAmount - investedAmount;

  return {
    investedAmount,
    interestEarned,
    maturityAmount,
  };
}