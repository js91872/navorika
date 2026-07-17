export const compoundInterestConfig = {
  principal: {
    default: 100000,
    min: 1000,
    max: 100000000,
    step: 1000,
  },

  rate: {
    default: 8,
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

  frequency: {
    default: 4,

    options: [
      {
        label: "Yearly",
        value: 1,
      },
      {
        label: "Half-Yearly",
        value: 2,
      },
      {
        label: "Quarterly",
        value: 4,
      },
      {
        label: "Monthly",
        value: 12,
      },
    ],
  },
} as const;