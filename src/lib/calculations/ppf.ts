export interface PPFResult {
  investedAmount: number;
  interestEarned: number;
  maturityAmount: number;
}

export function calculatePPF(
  yearlyInvestment: number,
  annualRate: number,
  years: number
): PPFResult {

  const rate = annualRate / 100;

  let maturityAmount = 0;

  for (let year = 1; year <= years; year++) {

    maturityAmount =
      (maturityAmount + yearlyInvestment) *
      (1 + rate);

  }

  const investedAmount =
    yearlyInvestment * years;

  const interestEarned =
    maturityAmount - investedAmount;

  return {
    investedAmount,
    interestEarned,
    maturityAmount,
  };

}