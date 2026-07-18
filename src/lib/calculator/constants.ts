export const CALCULATOR_LIMITS = {
  amount: {
    min: 0,
    max: 100000000,
    step: 1000,
  },

  rate: {
    min: 0,
    max: 50,
    step: 0.1,
  },

  tenure: {
    min: 1,
    max: 50,
    step: 1,
  },
} as const;