export interface FDInputs {
  principal: number;
  rate: number;
  tenure: number;
  compoundingFrequency?: 'monthly' | 'quarterly' | 'half-yearly' | 'yearly';
  seniorCitizen?: boolean;
}

export interface FDResult {
  maturityAmount: number;
  totalInterest: number;
  effectiveRate: number;
  monthlyInterest?: number;
  quarterlyBreakdown: Array<{
    quarter: number;
    balance: number;
    interest: number;
  }>;
}

const FREQUENCY_MAP = {
  monthly: 12,
  quarterly: 4,
  'half-yearly': 2,
  yearly: 1,
};

export function calculateFD(inputs: FDInputs): FDResult {
  const { 
    principal, 
    rate, 
    tenure, 
    compoundingFrequency = 'quarterly',
    seniorCitizen = false,
  } = inputs;

  const adjustedRate = seniorCitizen ? rate + 0.5 : rate;
  const frequency = FREQUENCY_MAP[compoundingFrequency];
  const periods = tenure * frequency;
  const ratePerPeriod = (adjustedRate / 100) / frequency;
  
  const maturityAmount = principal * Math.pow(1 + ratePerPeriod, periods);
  const totalInterest = maturityAmount - principal;
  
  const effectiveRate = (Math.pow(1 + ratePerPeriod, frequency) - 1) * 100;
  const monthlyInterest = (principal * adjustedRate / 100) / 12;

  const quarterlyBreakdown: FDResult['quarterlyBreakdown'] = [];
  let balance = principal;
  
  for (let q = 1; q <= periods; q++) {
    const interest = balance * ratePerPeriod;
    balance += interest;
    
    if (q % frequency === 0 || q === periods) {
      quarterlyBreakdown.push({
        quarter: Math.ceil(q / frequency),
        balance: Math.round(balance),
        interest: Math.round(interest),
      });
    }
  }

  return {
    maturityAmount: Math.round(maturityAmount),
    totalInterest: Math.round(totalInterest),
    effectiveRate: Number(effectiveRate.toFixed(2)),
    monthlyInterest: Math.round(monthlyInterest),
    quarterlyBreakdown,
  };
}
