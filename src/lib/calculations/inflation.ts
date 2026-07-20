export interface InflationInputs {
  amount: number;
  inflationRate: number;
  years: number;
  frequency: 'yearly' | 'monthly';
}

export interface InflationResult {
  futureValue: number;
  purchasingPower: number;
  totalLoss: number;
  lossPercentage: number;
  yearlyBreakdown: YearlyBreakdown[];
  summary: {
    initialAmount: number;
    futureValue: number;
    purchasingPower: number;
    totalLoss: number;
    lossPercentage: number;
  };
}

export interface YearlyBreakdown {
  year: number;
  valueInFuture: number;
  purchasingPower: number;
  loss: number;
  cumulativeLoss: number;
}

export function calculateInflation(inputs: InflationInputs): InflationResult {
  const { amount, inflationRate, years, frequency } = inputs;

  const ratePerPeriod = inflationRate / 100 / (frequency === 'monthly' ? 12 : 1);
  const totalPeriods = years * (frequency === 'monthly' ? 12 : 1);

  // Calculate future value with inflation
  const futureValue = amount * Math.pow(1 + ratePerPeriod, totalPeriods);

  // Purchasing power: what today's money will be worth in the future
  const purchasingPower = amount / Math.pow(1 + ratePerPeriod, totalPeriods);

  const totalLoss = futureValue - amount;
  const lossPercentage = (totalLoss / futureValue) * 100;

  // Generate yearly breakdown
  const yearlyBreakdown: YearlyBreakdown[] = [];
  const periodsPerYear = frequency === 'monthly' ? 12 : 1;
  const yearlyRate = frequency === 'monthly' 
    ? Math.pow(1 + ratePerPeriod, 12) - 1
    : inflationRate / 100;

  for (let year = 1; year <= years; year++) {
    const valueAtYear = amount * Math.pow(1 + yearlyRate, year);
    const purchasingPowerAtYear = amount / Math.pow(1 + yearlyRate, year);
    const yearlyLoss = valueAtYear - amount;
    const cumulativeLoss = futureValue - amount;

    yearlyBreakdown.push({
      year,
      valueInFuture: valueAtYear,
      purchasingPower: purchasingPowerAtYear,
      loss: yearlyLoss,
      cumulativeLoss: cumulativeLoss,
    });
  }

  return {
    futureValue,
    purchasingPower,
    totalLoss,
    lossPercentage,
    yearlyBreakdown,
    summary: {
      initialAmount: amount,
      futureValue,
      purchasingPower,
      totalLoss,
      lossPercentage,
    },
  };
}
