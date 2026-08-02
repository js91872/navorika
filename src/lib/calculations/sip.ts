export interface SIPInputs {
  monthlyInvestment: number;
  expectedRate: number;
  timePeriod: number;
}

export interface SIPResult {
  totalInvested: number;
  estimatedReturns: number;
  totalValue: number;
  yearByYear: Array<{
    year: number;
    invested: number;
    value: number;
    returns: number;
  }>;
}

export function calculateSIP(inputs: SIPInputs): SIPResult {
  const { monthlyInvestment, expectedRate, timePeriod } = inputs;
  
  const monthlyRate = (expectedRate / 100) / 12;
  const months = timePeriod * 12;
  
  const totalInvested = monthlyInvestment * months;
  const totalValue = monthlyInvestment * 
    ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * 
    (1 + monthlyRate);
  const estimatedReturns = totalValue - totalInvested;

  // Year-by-year breakdown
  const yearByYear: SIPResult['yearByYear'] = [];
  for (let year = 1; year <= timePeriod; year++) {
    const m = year * 12;
    const yearValue = monthlyInvestment * 
      ((Math.pow(1 + monthlyRate, m) - 1) / monthlyRate) * 
      (1 + monthlyRate);
    const yearInvested = monthlyInvestment * m;
    yearByYear.push({
      year,
      invested: Math.round(yearInvested),
      value: Math.round(yearValue),
      returns: Math.round(yearValue - yearInvested),
    });
  }

  return {
    totalInvested: Math.round(totalInvested),
    estimatedReturns: Math.round(estimatedReturns),
    totalValue: Math.round(totalValue),
    yearByYear,
  };
}

export function calculateLumpsum(principal: number, rate: number, time: number): number {
  return principal * Math.pow(1 + rate / 100, time);
}
