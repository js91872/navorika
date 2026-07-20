export const incomeTaxConfig = {
  financialYear: {
    default: "2025-26",
    options: [
      { label: "2025-26 (Current)", value: "2025-26" },
      { label: "2024-25", value: "2024-25" },
      { label: "2023-24", value: "2023-24" },
    ],
  },
  regime: {
    default: "new",
    options: [
      { label: "New Tax Regime", value: "new" },
      { label: "Old Tax Regime", value: "old" },
    ],
  },
  income: {
    default: 800000,
    min: 0,
    max: 50000000,
    step: 10000,
  },
  deductions: {
    default: 150000,
    min: 0,
    max: 500000,
    step: 1000,
  },
  hra: {
    default: 0,
    min: 0,
    max: 500000,
    step: 1000,
  },
  section80c: {
    default: 150000,
    min: 0,
    max: 150000,
    step: 1000,
  },
  section80d: {
    default: 25000,
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
} as const;
