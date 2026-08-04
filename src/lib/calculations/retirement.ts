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
  sustainabilityScore: number;
  monthlyContributionNeeded: number;
  totalContributions: number;
  totalReturns: number;
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

  // Calculate monthly expenses at retirement
  let monthlyExpenseAtRetirement = monthlyExpenses;
  for (let i = 0; i < yearsToRetirement * 12; i++) {
    monthlyExpenseAtRetirement *= (1 + inflationRateMonthly);
  }

  // Calculate corpus needed
  let corpusNeeded = 0;
  let currentExpense = monthlyExpenseAtRetirement;
  for (let i = 0; i < yearsInRetirement * 12; i++) {
    corpusNeeded += currentExpense / Math.pow(1 + monthlyRate, i);
    currentExpense *= (1 + inflationRateMonthly);
  }

  // Calculate accumulated savings
  let balance = currentSavings;
  let totalContributions = currentSavings;
  let totalReturns = 0;

  for (let year = 1; year <= yearsToRetirement; year++) {
    const yearlyContribution = monthlyContribution * 12 * Math.pow(1 + contributionIncreaseRate / 100, year - 1);
    const yearlyReturn = balance * (expectedReturn / 100);
    balance += yearlyContribution + yearlyReturn;
    totalContributions += yearlyContribution;
    totalReturns += yearlyReturn;
  }

  const corpusShortfall = Math.max(0, corpusNeeded - balance);
  const monthlyIncome = balance * (expectedReturn / 100 / 12);
  const inflationAdjustedIncome = monthlyIncome / Math.pow(1 + inflationRate / 100, yearsToRetirement);
  const yearsOfCoverage = Math.min(yearsInRetirement, Math.floor(balance / (monthlyExpenseAtRetirement * 12)));
  const sustainabilityScore = Math.min(100, (yearsOfCoverage / yearsInRetirement) * 100);

  // Calculate monthly contribution needed to reach goal
  let monthlyContributionNeeded = 0;
  if (corpusNeeded > balance) {
    const shortfall = corpusNeeded - balance;
    // Simple approximation for monthly contribution needed
    monthlyContributionNeeded = shortfall / (yearsToRetirement * 12);
  }

  return {
    retirementCorpus: Math.round(balance),
    monthlyIncome: Math.round(monthlyIncome),
    inflationAdjustedIncome: Math.round(inflationAdjustedIncome),
    corpusShortfall: Math.round(corpusShortfall),
    yearsOfCoverage,
    sustainabilityScore: Math.round(sustainabilityScore),
    monthlyContributionNeeded: Math.round(monthlyContributionNeeded),
    totalContributions: Math.round(totalContributions),
    totalReturns: Math.round(totalReturns),
  };
}
