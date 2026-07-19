export const epfConfig = {
  monthlySalary: {
    default: 50000,
    min: 5000,
    max: 500000,
    step: 1000,
  },

  employeeContribution: {
    default: 12,
    min: 1,
    max: 20,
    step: 0.5,
  },

  annualInterest: {
    default: 8.25,
    min: 1,
    max: 15,
    step: 0.1,
  },

  tenure: {
    default: 20,
    min: 1,
    max: 40,
    step: 1,
  },
} as const;