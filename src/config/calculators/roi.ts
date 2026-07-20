export const roiConfig = {
  initialInvestment: {
    default: 100000,
    min: 0,
    max: 100000000,
    step: 1000,
  },
  finalValue: {
    default: 150000,
    min: 0,
    max: 1000000000,
    step: 1000,
  },
  timePeriod: {
    default: 5,
    min: 1,
    max: 50,
    step: 1,
  },
  additionalContributions: {
    default: 0,
    min: 0,
    max: 10000000,
    step: 1000,
  },
  contributionFrequency: {
    default: "yearly",
    options: [
      { label: "Yearly", value: "yearly" },
      { label: "Monthly", value: "monthly" },
      { label: "Quarterly", value: "quarterly" },
    ],
  },
  calculationMethod: {
    default: "simple",
    options: [
      { label: "Simple ROI", value: "simple" },
      { label: "Annualized ROI", value: "annualized" },
      { label: "With Contributions", value: "contributions" },
    ],
  },
} as const;
