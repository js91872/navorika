export interface EMIInputs {
  principal: number;
  rate: number;
  tenure: number;
  tenureUnit?: 'months' | 'years';
}

export interface EMIResult {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  amortizationSchedule: Array<{
    month: number;
    payment: number;
    principal: number;
    interest: number;
    balance: number;
  }>;
}

export function calculateEMI(inputs: EMIInputs): EMIResult {
  const { principal, rate, tenure, tenureUnit = 'months' } = inputs;
  
  const monthlyRate = (rate / 100) / 12;
  const months = tenureUnit === 'years' ? tenure * 12 : tenure;
  
  const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, months) / 
    (Math.pow(1 + monthlyRate, months) - 1);
  
  const totalPayment = emi * months;
  const totalInterest = totalPayment - principal;

  const schedule: EMIResult['amortizationSchedule'] = [];
  let balance = principal;
  
  for (let month = 1; month <= Math.min(months, 360); month++) {
    const interest = balance * monthlyRate;
    const principalPaid = emi - interest;
    balance -= principalPaid;
    
    schedule.push({
      month,
      payment: Math.round(emi),
      principal: Math.round(principalPaid),
      interest: Math.round(interest),
      balance: Math.max(0, Math.round(balance)),
    });
  }

  return {
    monthlyPayment: Math.round(emi),
    totalPayment: Math.round(totalPayment),
    totalInterest: Math.round(totalInterest),
    amortizationSchedule: schedule,
  };
}
