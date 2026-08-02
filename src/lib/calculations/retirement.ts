export interface RetirementInputs {
  currentAge: number;
  retirementAge: number;
  lifeExpectancy: number;
  currentSavings: number;
  monthlyExpenses: number;
  inflationRate: number;
  expectedReturn: number;
  monthlyContribution: number;
  contributionIncreaseRate: number;
}

export interface RetirementResult {
  retirementCorpus: number;
  monthlyIncome: number;
  inflationAdjustedIncome: number;
  corpusShortfall: number;
  yearsOfCoverage: number;
  annualBreakdown: Array<{
    year: number;
    age: number;
    savings: number;
    contributions: number;
    returns: number;
    balance: number;
  }>;
  postRetirement: Array<{
    year: number;
    age: number;
    balance: number;
    withdrawal: number;
    remaining: number;
  }>;
  summary: {
    totalContributions: number;
    totalReturns: number;
    withdrawalRate: number;
    sustainabilityScore: number;
  };
}

export function calculateRetirement(inputs: RetirementInputs): RetirementResult {
  const {
    currentAge,
    retirementAge,
    lifeExpectancy,
    currentSavings,
    monthlyExpenses,
    inflationRate,
    expectedReturn,
    monthlyContribution,
    contributionIncreaseRate,
  } = inputs;

  const yearsToRetirement = retirementAge - currentAge;
  const yearsInRetirement = lifeExpectancy - retirementAge;
  const monthlyRate = expectedReturn / 100 / 12;
  const inflationRateMonthly = inflationRate / 100 / 12;

  let monthlyExpenseAtRetirement = monthlyExpenses;
  for (let i = 0; i < yearsToRetirement * 12; i++) {
    monthlyExpenseAtRetirement *= (1 + inflationRateMonthly);
  }

  let corpusNeeded = 0;
  let currentExpense = monthlyExpenseAtRetirement;
  for (let i = 0; i < yearsInRetirement * 12; i++) {
    corpusNeeded += currentExpense / Math.pow(1 + monthlyRate, i);
    currentExpense *= (1 + inflationRateMonthly);
  }

  let balance = currentSavings;
  let totalContributions = currentSavings;
  const annualBreakdown: RetirementResult['annualBreakdown'] = [];

  for (let year = 1; year <= yearsToRetirement; year++) {
    const yearlyContributions = monthlyContribution * 12 * Math.pow(1 + contributionIncreaseRate / 100, year - 1);
    const yearlyReturn = balance * (expectedReturn / 100);
    
    balance += yearlyContributions + yearlyReturn;
    totalContributions += yearlyContributions;

    annualBreakdown.push({
      year,
      age: currentAge + year,
      savings: Math.round(yearlyContributions),
      contributions: Math.round(yearlyContributions),
      returns: Math.round(yearlyReturn),
      balance: Math.round(balance),
    });
  }

  let postRetirementBalance = balance;
  let currentWithdrawal = monthlyExpenseAtRetirement;
  const postRetirement: RetirementResult['postRetirement'] = [];

  for (let year = 1; year <= yearsInRetirement; year++) {
    const yearlyWithdrawal = currentWithdrawal * 12;
    
    if (postRetirementBalance < 0) break;
    
    const yearlyReturn = postRetirementBalance * (expectedReturn / 100);
    postRetirementBalance = postRetirementBalance + yearlyReturn - yearlyWithdrawal;
    
    postRetirement.push({
      year,
      age: retirementAge + year,
      balance: Math.round(postRetirementBalance),
      withdrawal: Math.round(yearlyWithdrawal),
      remaining: Math.round(postRetirementBalance),
    });

    currentWithdrawal *= (1 + inflationRateMonthly);
  }

  const corpusShortfall = Math.max(0, corpusNeeded - balance);
  const monthlyIncome = balance * (expectedReturn / 100 / 12);
  const inflationAdjustedIncome = monthlyIncome / Math.pow(1 + inflationRate / 100, yearsToRetirement);
  const yearsOfCoverage = postRetirement.filter(p => p.balance > 0).length;
  const sustainabilityScore = Math.min(100, (yearsOfCoverage / yearsInRetirement) * 100);

  return {
    retirementCorpus: Math.round(balance),
    monthlyIncome: Math.round(monthlyIncome),
    inflationAdjustedIncome: Math.round(inflationAdjustedIncome),
    corpusShortfall: Math.round(corpusShortfall),
    yearsOfCoverage,
    annualBreakdown,
    postRetirement,
    summary: {
      totalContributions: Math.round(totalContributions),
      totalReturns: Math.round(balance - totalContributions),
      withdrawalRate: Number((monthlyIncome / balance * 100 * 12).toFixed(1)),
      sustainabilityScore: Number(sustainabilityScore.toFixed(0)),
    },
  };
}
