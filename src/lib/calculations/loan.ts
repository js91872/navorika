export interface LoanInputs {
  amount: number;
  annualRate: number;
  years: number;
  loanType: string;
}

export interface LoanResult {
  monthlyEMI: number;
  totalPayment: number;
  totalInterest: number;
  principal: number;
  interestPercentage: number;
  principalPercentage: number;
  amortizationSchedule: AmortizationEntry[];
  summary: {
    monthlyPayment: number;
    totalPayment: number;
    totalInterest: number;
    payoffDate: Date;
  };
}

export interface AmortizationEntry {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  remainingBalance: number;
}

export function calculateLoan(inputs: LoanInputs): LoanResult {
  const { amount, annualRate, years } = inputs;
  
  const monthlyRate = annualRate / 100 / 12;
  const months = years * 12;

  let monthlyEMI: number;
  if (monthlyRate === 0) {
    monthlyEMI = amount / months;
  } else {
    const factor = Math.pow(1 + monthlyRate, months);
    monthlyEMI = amount * (monthlyRate * factor) / (factor - 1);
  }

  const totalPayment = monthlyEMI * months;
  const totalInterest = totalPayment - amount;
  const interestPercentage = (totalInterest / totalPayment) * 100;
  const principalPercentage = (amount / totalPayment) * 100;

  const amortizationSchedule: AmortizationEntry[] = [];
  let remainingBalance = amount;

  for (let month = 1; month <= months; month++) {
    const interestPayment = remainingBalance * monthlyRate;
    let principalPayment = monthlyEMI - interestPayment;

    if (month === months) {
      principalPayment = remainingBalance;
    }

    remainingBalance = Math.max(0, remainingBalance - principalPayment);

    amortizationSchedule.push({
      month,
      payment: monthlyEMI,
      principal: principalPayment,
      interest: interestPayment,
      remainingBalance: remainingBalance,
    });
  }

  const payoffDate = new Date();
  payoffDate.setMonth(payoffDate.getMonth() + months);

  return {
    monthlyEMI,
    totalPayment,
    totalInterest,
    principal: amount,
    interestPercentage,
    principalPercentage,
    amortizationSchedule,
    summary: {
      monthlyPayment: monthlyEMI,
      totalPayment,
      totalInterest,
      payoffDate,
    },
  };
}
