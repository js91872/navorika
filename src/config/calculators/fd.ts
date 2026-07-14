export const fdConfig = {
  amount: {
    default: 100000,
    min: 1000,
    max: 10000000,
    step: 1000,
  },

  rate: {
    default: 7.25,
    min: 1,
    max: 12,
    step: 0.05,
  },

  tenure: {
    default: 5,
    min: 1,
    max: 20,
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