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
  if (!Number.isFinite(principal) || principal <= 0) throw new RangeError('Principal must be greater than zero.');
  if (!Number.isFinite(rate) || rate < 0) throw new RangeError('Interest rate cannot be negative.');
  if (!Number.isFinite(tenure) || tenure <= 0) throw new RangeError('Tenure must be greater than zero.');
  const monthlyRate = (rate / 100) / 12;
  const months = Math.round(tenureUnit === 'years' ? tenure * 12 : tenure);
  if (months > 1200) throw new RangeError('Tenure cannot exceed 1,200 months.');
  const factor = Math.pow(1 + monthlyRate, months);
  const emi = monthlyRate === 0 ? principal / months : principal * monthlyRate * factor / (factor - 1);
  
  const totalPayment = emi * months;
  const totalInterest = totalPayment - principal;

  const schedule: EMIResult['amortizationSchedule'] = [];
  let balance = principal;
  
  for (let month = 1; month <= months; month++) {
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
