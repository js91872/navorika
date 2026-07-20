export const loanConfig = {
  amount: {
    default: 500000,
    min: 1000,
    max: 100000000,
    step: 1000,
  },
  rate: {
    default: 8.5,
    min: 0.5,
    max: 20,
    step: 0.05,
  },
  tenure: {
    default: 5,
    min: 1,
    max: 40,
    step: 1,
  },
  loanType: {
    default: "personal",
    options: [
      { label: "Personal Loan", value: "personal" },
      { label: "Home Loan", value: "home" },
      { label: "Car Loan", value: "car" },
      { label: "Education Loan", value: "education" },
      { label: "Business Loan", value: "business" },
    ],
  },
} as const;
