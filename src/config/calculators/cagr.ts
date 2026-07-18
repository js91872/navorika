export const cagrConfig = {
  beginningValue: {
    default: 100000,
    min: 1000,
    max: 100000000,
    step: 1000,
  },

  endingValue: {
    default: 200000,
    min: 1000,
    max: 100000000,
    step: 1000,
  },

  tenure: {
    default: 7,
    min: 1,
    max: 50,
    step: 1,
  },
} as const;