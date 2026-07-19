export const retirementConfig = {
  monthlyInvestment: {
    default: 10000,
    min: 500,
    max: 1000000,
    step: 500,
  },

  annualReturn: {
    default: 12,
    min: 1,
    max: 25,
    step: 0.1,
  },

  tenure: {
    default: 25,
    min: 1,
    max: 50,
    step: 1,
  },
} as const;