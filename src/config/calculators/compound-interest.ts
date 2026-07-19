export const compoundInterestConfig = {
  principal: {
    default: 100000,
    min: 1000,
    max: 10000000,
    step: 1000,
  },
  rate: {
    default: 8,
    min: 1,
    max: 20,
    step: 0.05,
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
      { label: "Yearly", value: 1 },
      { label: "Half-Yearly", value: 2 },
      { label: "Quarterly", value: 4 },
      { label: "Monthly", value: 12 },
      { label: "Daily", value: 365 },
    ],
  },
  contribution: {
    default: 0,
    min: 0,
    max: 1000000,
    step: 1000,
  },
  contributionFrequency: {
    default: 12,
    options: [
      { label: "Monthly", value: 12 },
      { label: "Quarterly", value: 4 },
      { label: "Yearly", value: 1 },
    ],
  },
} as const;
