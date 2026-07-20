export const incomeTaxConfig = {
  income: {
    default: 800000,
    min: 0,
    max: 50000000,
    step: 10000,
  },
  regime: {
    default: "new",
    options: [
      { label: "New Tax Regime", value: "new" },
      { label: "Old Tax Regime", value: "old" },
    ],
  },
  hra: {
    default: 0,
    min: 0,
    max: 500000,
    step: 1000,
  },
  section80c: {
    default: 0,
    min: 0,
    max: 150000,
    step: 1000,
  },
  section80d: {
    default: 0,
    min: 0,
    max: 50000,
    step: 1000,
  },
  nps: {
    default: 0,
    min: 0,
    max: 50000,
    step: 1000,
  },
  standardDeduction: {
    default: 75000,
    min: 0,
    max: 75000,
    step: 1000,
  },
} as const;
