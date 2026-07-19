export interface CompoundInterestResult {
  initialPrincipal: number;
  totalContributions: number;
  interestEarned: number;
  maturityAmount: number;
  yearlyBreakdown: YearlyBreakdown[];
}

export interface YearlyBreakdown {
  year: number;
  openingBalance: number;
  contributions: number;
  interest: number;
  closingBalance: number;
}

export function calculateCompoundInterest(
  principal: number,
  annualRate: number,
  years: number,
  frequency: number,
  monthlyContribution: number = 0,
  contributionFrequency: number = 12
): CompoundInterestResult {
  const ratePerPeriod = annualRate / 100 / frequency;
  const totalPeriods = frequency * years;
  
  // Future value of initial principal
  const principalFV = principal * Math.pow(1 + ratePerPeriod, totalPeriods);
  
  // Future value of contributions (if any)
  let contributionsFV = 0;
  let totalContributions = monthlyContribution * 12 * years;
  
  if (monthlyContribution > 0) {
    const contributionRate = annualRate / 100 / contributionFrequency;
    const contributionPeriods = contributionFrequency * years;
    contributionsFV = monthlyContribution * (Math.pow(1 + contributionRate, contributionPeriods) - 1) / contributionRate;
  }
  
  const maturityAmount = principalFV + contributionsFV;
  const interestEarned = maturityAmount - principal - totalContributions;
  
  // Generate yearly breakdown
  const yearlyBreakdown: YearlyBreakdown[] = [];
  let currentBalance = principal;
  const periodsPerYear = frequency;
  
  for (let year = 1; year <= years; year++) {
    const openingBalance = currentBalance;
    const yearlyContributions = monthlyContribution * 12;
    let closingBalance = openingBalance;
    
    // Add contributions at the start of each period (simplified)
    closingBalance += yearlyContributions;
    
    // Apply compounding for the year
    const yearRate = Math.pow(1 + ratePerPeriod, periodsPerYear);
    const closingBalanceWithInterest = closingBalance * yearRate;
    const interest = closingBalanceWithInterest - closingBalance;
    
    closingBalance = closingBalanceWithInterest;
    
    yearlyBreakdown.push({
      year,
      openingBalance: Math.round(openingBalance * 100) / 100,
      contributions: yearlyContributions,
      interest: Math.round(interest * 100) / 100,
      closingBalance: Math.round(closingBalance * 100) / 100,
    });
    
    currentBalance = closingBalance;
  }
  
  return {
    initialPrincipal: principal,
    totalContributions: totalContributions,
    interestEarned: Math.round(interestEarned * 100) / 100,
    maturityAmount: Math.round(maturityAmount * 100) / 100,
    yearlyBreakdown,
  };
}
