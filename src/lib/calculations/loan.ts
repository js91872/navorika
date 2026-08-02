export interface LoanInputs {
  amount: number;
  rate: number;
  tenure: number;
  tenureUnit?: 'months' | 'years';
  processingFee?: number;
  insurance?: number;
}

export interface LoanResult {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  totalCost: number;
  amortizationSchedule: Array<{
    month: number;
    payment: number;
    principal: number;
    interest: number;
    balance: number;
    totalPaid: number;
  }>;
  summary: {
    interestRatio: number;
    principalRatio: number;
    breakevenPoint: number;
  };
}

export function calculateLoan(inputs: LoanInputs): LoanResult {
  const { 
    amount, 
    rate, 
    tenure, 
    tenureUnit = 'months',
    processingFee = 0,
    insurance = 0
  } = inputs;

  const monthlyRate = (rate / 100) / 12;
  const months = tenureUnit === 'years' ? tenure * 12 : tenure;
  
  const emi = amount * monthlyRate * Math.pow(1 + monthlyRate, months) / 
    (Math.pow(1 + monthlyRate, months) - 1);
  
  const totalPayment = emi * months;
  const totalInterest = totalPayment - amount;
  const totalCost = totalPayment + processingFee + insurance;

  const schedule: LoanResult['amortizationSchedule'] = [];
  let balance = amount;
  let totalPaid = 0;

  for (let month = 1; month <= Math.min(months, 360); month++) {
    const interest = balance * monthlyRate;
    const principalPaid = emi - interest;
    balance -= principalPaid;
    totalPaid += emi;

    schedule.push({
      month,
      payment: Math.round(emi),
      principal: Math.round(principalPaid),
      interest: Math.round(interest),
      balance: Math.max(0, Math.round(balance)),
      totalPaid: Math.round(totalPaid),
    });
  }

  const interestRatio = (totalInterest / totalPayment) * 100;
  const principalRatio = (amount / totalPayment) * 100;
  
  let breakevenPoint = 0;
  let cumulativeInterest = 0;
  for (let i = 0; i < schedule.length; i++) {
    cumulativeInterest += schedule[i].interest;
    if (cumulativeInterest > amount / 2) {
      breakevenPoint = schedule[i].month;
      break;
    }
  }

  return {
    monthlyPayment: Math.round(emi),
    totalPayment: Math.round(totalPayment),
    totalInterest: Math.round(totalInterest),
    totalCost: Math.round(totalCost),
    amortizationSchedule: schedule,
    summary: {
      interestRatio: Number(interestRatio.toFixed(1)),
      principalRatio: Number(principalRatio.toFixed(1)),
      breakevenPoint,
    },
  };
}
