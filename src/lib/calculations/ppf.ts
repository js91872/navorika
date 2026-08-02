export interface PPFInputs {
  annualInvestment: number;
  currentBalance: number;
  tenure: number;
  rate: number;
}

export interface PPFResult {
  maturityAmount: number;
  totalInvestment: number;
  totalInterest: number;
  yearByYear: Array<{
    year: number;
    balance: number;
    investment: number;
    interest: number;
  }>;
}

export function calculatePPF(inputs: PPFInputs): PPFResult {
  const { annualInvestment, currentBalance, tenure, rate } = inputs;
  
  let balance = currentBalance;
  const yearByYear: PPFResult['yearByYear'] = [];
  let totalInvestment = currentBalance;
  
  for (let year = 1; year <= tenure; year++) {
    const interest = balance * (rate / 100);
    balance += annualInvestment + interest;
    totalInvestment += annualInvestment;
    
    yearByYear.push({
      year,
      balance: Math.round(balance),
      investment: Math.round(annualInvestment),
      interest: Math.round(interest),
    });
  }

  return {
    maturityAmount: Math.round(balance),
    totalInvestment: Math.round(totalInvestment),
    totalInterest: Math.round(balance - totalInvestment),
    yearByYear,
  };
}
