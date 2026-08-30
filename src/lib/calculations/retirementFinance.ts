export type EpfCalculationInput = {
  monthlyContributionWage: number;
  employeeContributionRate: number;
  employerContributionRate?: number;
  epsRate?: number;
  epsWageCeiling?: number;
  annualInterestRate: number;
  openingBalance: number;
  annualSalaryGrowthRate: number;
  years: number;
};

export type EpfCalculationResult = {
  months: number;
  closingEpfBalance: number;
  employeeContributions: number;
  employerEpfContributions: number;
  epsContributions: number;
  interestEarned: number;
  finalMonthlyContributionWage: number;
};

export type NpsCalculationInput = {
  openingCorpus: number;
  monthlyContribution: number;
  annualContributionIncreaseRate: number;
  annualReturnRate: number;
  years: number;
  annuityAllocationRate: number;
  annualAnnuityRate: number;
};

export type NpsCalculationResult = {
  months: number;
  projectedCorpus: number;
  openingCorpus: number;
  newContributions: number;
  investmentGain: number;
  annuityAllocation: number;
  withdrawableAmount: number;
  estimatedAnnualPension: number;
  estimatedMonthlyPension: number;
};

function requireFinite(name: string, value: number) {
  if (!Number.isFinite(value)) {
    throw new RangeError(`${name} must be a finite number.`);
  }
}

function requireRange(name: string, value: number, minimum: number, maximum: number) {
  requireFinite(name, value);
  if (value < minimum || value > maximum) {
    throw new RangeError(`${name} must be between ${minimum} and ${maximum}.`);
  }
}

function projectionMonths(years: number) {
  requireRange('Years', years, 0, 60);
  return Math.round(years * 12);
}

/**
 * Estimates an EPF balance using monthly running balances. Contributions are
 * rounded to rupees, a month's contribution starts earning interest in the
 * following month, and accrued interest is rounded and credited every 12 months.
 */
export function calculateEpfProjection(input: EpfCalculationInput): EpfCalculationResult {
  const employerRate = input.employerContributionRate ?? 12;
  const epsRate = input.epsRate ?? 8.33;
  const epsCeiling = input.epsWageCeiling ?? 15_000;

  requireRange('Monthly contribution wage', input.monthlyContributionWage, 0, 100_000_000);
  requireRange('Employee contribution rate', input.employeeContributionRate, 0, 100);
  requireRange('Employer contribution rate', employerRate, 0, 100);
  requireRange('EPS rate', epsRate, 0, 100);
  requireRange('EPS wage ceiling', epsCeiling, 0, 100_000_000);
  requireRange('Annual interest rate', input.annualInterestRate, 0, 25);
  requireRange('Opening balance', input.openingBalance, 0, 1_000_000_000_000);
  requireRange('Annual salary growth rate', input.annualSalaryGrowthRate, 0, 100);

  const months = projectionMonths(input.years);
  const monthlyInterestRate = input.annualInterestRate / 100 / 12;
  let balance = input.openingBalance;
  let accruedInterest = 0;
  let interestEarned = 0;
  let employeeContributions = 0;
  let employerEpfContributions = 0;
  let epsContributions = 0;

  for (let month = 0; month < months; month += 1) {
    accruedInterest += balance * monthlyInterestRate;

    const completedYears = Math.floor(month / 12);
    const monthlyWage = input.monthlyContributionWage
      * Math.pow(1 + input.annualSalaryGrowthRate / 100, completedYears);
    const employeeContribution = Math.round(monthlyWage * input.employeeContributionRate / 100);
    const employerContribution = Math.round(monthlyWage * employerRate / 100);
    const epsContribution = Math.min(
      employerContribution,
      Math.round(Math.min(monthlyWage, epsCeiling) * epsRate / 100),
    );
    const employerEpfContribution = employerContribution - epsContribution;

    employeeContributions += employeeContribution;
    employerEpfContributions += employerEpfContribution;
    epsContributions += epsContribution;
    balance += employeeContribution + employerEpfContribution;

    if ((month + 1) % 12 === 0) {
      const creditedInterest = Math.round(accruedInterest);
      balance += creditedInterest;
      interestEarned += creditedInterest;
      accruedInterest = 0;
    }
  }

  if (accruedInterest > 0) {
    const estimatedAccruedInterest = Math.round(accruedInterest);
    balance += estimatedAccruedInterest;
    interestEarned += estimatedAccruedInterest;
  }

  const completedGrowthYears = months === 0 ? 0 : Math.floor((months - 1) / 12);

  return {
    months,
    closingEpfBalance: balance,
    employeeContributions,
    employerEpfContributions,
    epsContributions,
    interestEarned,
    finalMonthlyContributionWage: input.monthlyContributionWage
      * Math.pow(1 + input.annualSalaryGrowthRate / 100, completedGrowthYears),
  };
}

/**
 * Projects an NPS corpus with end-of-month contributions. The contribution is
 * stepped up after each completed year; corpus return and annuity payout rate
 * remain separate assumptions.
 */
export function calculateNpsProjection(input: NpsCalculationInput): NpsCalculationResult {
  requireRange('Opening corpus', input.openingCorpus, 0, 1_000_000_000_000);
  requireRange('Monthly contribution', input.monthlyContribution, 0, 100_000_000);
  requireRange('Annual contribution increase rate', input.annualContributionIncreaseRate, 0, 100);
  requireRange('Annual return rate', input.annualReturnRate, 0, 100);
  requireRange('Annuity allocation rate', input.annuityAllocationRate, 0, 100);
  requireRange('Annual annuity rate', input.annualAnnuityRate, 0, 100);

  const months = projectionMonths(input.years);
  const monthlyReturnRate = input.annualReturnRate / 100 / 12;
  let corpus = input.openingCorpus;
  let newContributions = 0;

  for (let month = 0; month < months; month += 1) {
    corpus *= 1 + monthlyReturnRate;
    const completedYears = Math.floor(month / 12);
    const contribution = input.monthlyContribution
      * Math.pow(1 + input.annualContributionIncreaseRate / 100, completedYears);
    corpus += contribution;
    newContributions += contribution;
  }

  const investmentGain = corpus - input.openingCorpus - newContributions;
  const annuityAllocation = corpus * input.annuityAllocationRate / 100;
  const withdrawableAmount = corpus - annuityAllocation;
  const estimatedAnnualPension = annuityAllocation * input.annualAnnuityRate / 100;

  return {
    months,
    projectedCorpus: corpus,
    openingCorpus: input.openingCorpus,
    newContributions,
    investmentGain,
    annuityAllocation,
    withdrawableAmount,
    estimatedAnnualPension,
    estimatedMonthlyPension: estimatedAnnualPension / 12,
  };
}
