export interface EMIResult {
  emi: number;
  totalInterest: number;
  totalPayment: number;
}

export function calculateEMI(
  principal: number,
  annualRate: number,
  years: number
): EMIResult {
  const monthlyRate = annualRate / 12 / 100;
  const months = years * 12;

  const emi =
    (principal *
      monthlyRate *
      Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1);

  const totalPayment = emi * months;
  const totalInterest = totalPayment - principal;

  return {
    emi,
    totalInterest,
    totalPayment,
  };
}