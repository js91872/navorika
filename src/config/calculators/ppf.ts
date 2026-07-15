export const ppfConfig = {
  yearlyInvestment: {
    default: 150000,
    min: 500,
    max: 150000,
    step: 500,
  },

  rate: {
    default: 7.1,
    min: 1,
    max: 12,
    step: 0.05,
  },

  tenure: {
    default: 15,
    min: 15,
    max: 50,
    step: 1,
  },
} as const;