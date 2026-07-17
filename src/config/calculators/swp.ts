export const swpConfig = {
  corpus: {
    default: 1000000,
    min: 10000,
    max: 100000000,
    step: 10000,
  },

  withdrawal: {
    default: 10000,
    min: 100,
    max: 1000000,
    step: 100,
  },

  rate: {
    default: 10,
    min: 1,
    max: 30,
    step: 0.1,
  },

  tenure: {
    default: 20,
    min: 1,
    max: 40,
    step: 1,
  },
} as const;