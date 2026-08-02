export interface CompoundInterestInputs {
  principal: number;
  rate: number;
  time: number;
  compoundFrequency?: 'yearly' | 'half-yearly' | 'quarterly' | 'monthly' | 'daily';
  additionalContribution?: number;
  contributionFrequency?: 'monthly' | 'quarterly' | 'yearly';
  contributionTiming?: 'beginning' | 'end';
}

export interface CompoundInterestResult {
  finalAmount: number;
  totalInterest: number;
  totalContributions: number;
  annualBreakdown: Array<{
    year: number;
    startBalance: number;
    contribution: number;
    interest: number;
    endBalance: number;
    roi: number;
  }>;
  monthlyBreakdown?: Array<{
    month: number;
    balance: number;
  }>;
  summary: {
    effectiveRate: number;
    doublingTime: number;
    wealthMultiplier: number;
  };
}

const FREQUENCY_MAP = {
  yearly: 1,
  'half-yearly': 2,
  quarterly: 4,
  monthly: 12,
  daily: 365,
};

export function calculateCompoundInterest(inputs: CompoundInterestInputs): CompoundInterestResult {
  const { 
    principal, 
    rate, 
    time, 
    compoundFrequency = 'yearly',
    additionalContribution = 0,
    contributionFrequency = 'yearly',
    contributionTiming = 'end'
  } = inputs;

  const frequency = FREQUENCY_MAP[compoundFrequency];
  const ratePerPeriod = (rate / 100) / frequency;
  const totalPeriods = time * frequency;

  let balance = principal;
  let totalContributions = principal;
  const annualBreakdown: CompoundInterestResult['annualBreakdown'] = [];
  const monthlyBreakdown: CompoundInterestResult['monthlyBreakdown'] = [];

  const contributionPerPeriod = (() => {
    if (contributionFrequency === 'monthly') return additionalContribution;
    if (contributionFrequency === 'quarterly') return additionalContribution / 4;
    return additionalContribution / 12;
  })();

  for (let period = 1; period <= totalPeriods; period++) {
    const isContributionPeriod = (() => {
      if (contributionFrequency === 'monthly') return true;
      if (contributionFrequency === 'quarterly') return period % 3 === 0;
      return period % 12 === 0;
    })();

    if (isContributionPeriod && contributionTiming === 'beginning') {
      balance += contributionPerPeriod;
      totalContributions += contributionPerPeriod;
    }

    const interestEarned = balance * ratePerPeriod;
    balance += interestEarned;

    if (isContributionPeriod && contributionTiming === 'end') {
      balance += contributionPerPeriod;
      totalContributions += contributionPerPeriod;
    }

    if (period % 1 === 0) {
      monthlyBreakdown.push({
        month: period,
        balance: Math.round(balance),
      });
    }

    if (period % frequency === 0) {
      const year = period / frequency;
      const startBalance = balance - interestEarned - (isContributionPeriod ? contributionPerPeriod : 0);
      annualBreakdown.push({
        year,
        startBalance: Math.round(startBalance),
        contribution: Math.round(isContributionPeriod ? contributionPerPeriod : 0),
        interest: Math.round(interestEarned),
        endBalance: Math.round(balance),
        roi: Number(((balance / principal - 1) * 100).toFixed(1)),
      });
    }
  }

  const effectiveRate = Number((Math.pow(1 + ratePerPeriod, frequency) - 1) * 100);
  const doublingTime = 72 / rate;
  const wealthMultiplier = Number((balance / principal).toFixed(2));

  return {
    finalAmount: Math.round(balance),
    totalInterest: Math.round(balance - totalContributions),
    totalContributions: Math.round(totalContributions),
    annualBreakdown,
    monthlyBreakdown,
    summary: {
      effectiveRate: Number(effectiveRate.toFixed(2)),
      doublingTime: Number(doublingTime.toFixed(1)),
      wealthMultiplier,
    },
  };
}
