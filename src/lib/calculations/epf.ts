export interface EPFResult {
  maturityAmount: number;
  employeeContribution: number;
  employerContribution: number;
  totalContribution: number;
  totalInterest: number;
}

export function calculateEPF(
  monthlySalary: number,
  employeeRate: number,
  annualInterest: number,
  years: number
): EPFResult {
  if (
    monthlySalary <= 0 ||
    employeeRate <= 0 ||
    annualInterest <= 0 ||
    years <= 0
  ) {
    return {
      maturityAmount: 0,
      employeeContribution: 0,
      employerContribution: 0,
      totalContribution: 0,
      totalInterest: 0,
    };
  }

  const monthlyRate = annualInterest / 100 / 12;

  const employeeContribution =
    (monthlySalary * employeeRate) / 100;

  // Simplified employer contribution (12%)
  const employerContribution =
    (monthlySalary * 12) / 100;

  const monthlyContribution =
    employeeContribution + employerContribution;

  const months = years * 12;

  let corpus = 0;

  for (let i = 0; i < months; i++) {
    corpus =
      (corpus + monthlyContribution) *
      (1 + monthlyRate);
  }

  const totalContribution =
    monthlyContribution * months;

  const totalInterest =
    corpus - totalContribution;

  return {
    maturityAmount: corpus,
    employeeContribution,
    employerContribution,
    totalContribution,
    totalInterest,
  };
}