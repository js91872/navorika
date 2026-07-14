export const rdConfig = {
  monthlyDeposit: {
    default: 5000,
    min: 500,
    max: 100000,
    step: 500,
  },

  rate: {
    default: 7.5,
    min: 1,
    max: 12,
    step: 0.05,
  },

  tenure: {
    default: 5,
    min: 1,
    max: 10,
    step: 1,
  },
} as const;