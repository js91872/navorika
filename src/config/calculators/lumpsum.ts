export const lumpsumConfig = {
  investment: {
    default: 100000,
    min: 1000,
    max: 100000000,
    step: 1000,
  },

  rate: {
    default: 12,
    min: 1,
    max: 30,
    step: 0.1,
  },

  tenure: {
    default: 10,
    min: 1,
    max: 40,
    step: 1,
  },
} as const;