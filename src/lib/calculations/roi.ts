export interface ROIInputs {
  initialInvestment: number;
  finalValue: number;
  timePeriod: number;
  additionalContributions: number;
  contributionFrequency: 'yearly' | 'monthly' | 'quarterly';
  calculationMethod: 'simple' | 'annualized' | 'contributions';
}

export interface ROIResult {
  totalReturn: number;
  totalReturnPercentage: number;
  annualizedReturn: number;
  netProfit: number;
  totalContributions: number;
  totalValue: number;
  breakdown: {
    initialInvestment: number;
    finalValue: number;
    additionalContributions: number;
    totalContributions: number;
    netProfit: number;
  };
  yearlyBreakdown?: YearlyBreakdown[];
}

export interface YearlyBreakdown {
  year: number;
  startValue: number;
  contributions: number;
  growth: number;
  endValue: number;
  roi: number;
}

export function calculateROI(inputs: ROIInputs): ROIResult {
  const {
    initialInvestment,
    finalValue,
    timePeriod,
    additionalContributions,
    contributionFrequency,
    calculationMethod,
  } = inputs;

  let totalContributions = additionalContributions * timePeriod;
  let adjustedFinalValue = finalValue;
  let totalInvested = initialInvestment;

  // Adjust for contribution frequency
  let contributionsPerYear = 1;
  if (contributionFrequency === 'monthly') {
    contributionsPerYear = 12;
    totalContributions = additionalContributions * timePeriod * 12;
  } else if (contributionFrequency === 'quarterly') {
    contributionsPerYear = 4;
    totalContributions = additionalContributions * timePeriod * 4;
  }

  // Method 1: Simple ROI
  if (calculationMethod === 'simple') {
    const totalReturn = finalValue - initialInvestment;
    const totalReturnPercentage = initialInvestment > 0 ? (totalReturn / initialInvestment) * 100 : 0;

    return {
      totalReturn,
      totalReturnPercentage,
      annualizedReturn: timePeriod > 0 ? ((Math.pow(1 + totalReturnPercentage / 100, 1 / timePeriod) - 1) * 100) : 0,
      netProfit: totalReturn,
      totalContributions: 0,
      totalValue: finalValue,
      breakdown: {
        initialInvestment,
        finalValue,
        additionalContributions: 0,
        totalContributions: 0,
        netProfit: totalReturn,
      },
    };
  }

  // Method 2: Annualized ROI
  if (calculationMethod === 'annualized') {
    const totalReturn = finalValue - initialInvestment;
    const totalReturnPercentage = initialInvestment > 0 ? (totalReturn / initialInvestment) * 100 : 0;
    const annualizedReturn = timePeriod > 0 ? ((Math.pow(finalValue / initialInvestment, 1 / timePeriod) - 1) * 100) : 0;

    return {
      totalReturn,
      totalReturnPercentage,
      annualizedReturn,
      netProfit: totalReturn,
      totalContributions: 0,
      totalValue: finalValue,
      breakdown: {
        initialInvestment,
        finalValue,
        additionalContributions: 0,
        totalContributions: 0,
        netProfit: totalReturn,
      },
    };
  }

  // Method 3: With Contributions
  if (calculationMethod === 'contributions') {
    totalInvested = initialInvestment + totalContributions;
    const netProfit = finalValue - totalInvested;
    const totalReturnPercentage = totalInvested > 0 ? (netProfit / totalInvested) * 100 : 0;
    const annualizedReturn = timePeriod > 0 ? ((Math.pow(finalValue / totalInvested, 1 / timePeriod) - 1) * 100) : 0;

    // Generate yearly breakdown
    const yearlyBreakdown: YearlyBreakdown[] = [];
    let currentValue = initialInvestment;
    const yearlyGrowthRate = timePeriod > 0 ? Math.pow(finalValue / initialInvestment, 1 / timePeriod) - 1 : 0;

    for (let year = 1; year <= timePeriod; year++) {
      const yearlyContributions = additionalContributions * contributionsPerYear;
      const startValue = currentValue;
      const growth = startValue * yearlyGrowthRate;
      const endValue = startValue + growth + yearlyContributions;
      const roi = startValue > 0 ? (growth / startValue) * 100 : 0;

      yearlyBreakdown.push({
        year,
        startValue: Math.round(startValue * 100) / 100,
        contributions: yearlyContributions,
        growth: Math.round(growth * 100) / 100,
        endValue: Math.round(endValue * 100) / 100,
        roi: Math.round(roi * 100) / 100,
      });

      currentValue = endValue;
    }

    return {
      totalReturn: netProfit,
      totalReturnPercentage,
      annualizedReturn,
      netProfit,
      totalContributions,
      totalValue: finalValue,
      breakdown: {
        initialInvestment,
        finalValue,
        additionalContributions,
        totalContributions,
        netProfit,
      },
      yearlyBreakdown,
    };
  }

  // Fallback: Simple ROI
  const totalReturn = finalValue - initialInvestment;
  const totalReturnPercentage = initialInvestment > 0 ? (totalReturn / initialInvestment) * 100 : 0;

  return {
    totalReturn,
    totalReturnPercentage,
    annualizedReturn: timePeriod > 0 ? ((Math.pow(1 + totalReturnPercentage / 100, 1 / timePeriod) - 1) * 100) : 0,
    netProfit: totalReturn,
    totalContributions: 0,
    totalValue: finalValue,
    breakdown: {
      initialInvestment,
      finalValue,
      additionalContributions: 0,
      totalContributions: 0,
      netProfit: totalReturn,
    },
  };
}
