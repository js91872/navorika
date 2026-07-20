export const inflationConfig = {
  amount: {
    default: 100000,
    min: 100,
    max: 100000000,
    step: 1000,
  },
  inflationRate: {
    default: 6,
    min: 0.5,
    max: 20,
    step: 0.05,
  },
  years: {
    default: 10,
    min: 1,
    max: 50,
    step: 1,
  },
  frequency: {
    default: "yearly",
    options: [
      { label: "Yearly", value: "yearly" },
      { label: "Monthly", value: "monthly" },
    ],
  },
} as const;
