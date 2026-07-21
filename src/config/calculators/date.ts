export const dateConfig = {
  operation: {
    default: "add",
    options: [
      { label: "Add", value: "add" },
      { label: "Subtract", value: "subtract" },
      { label: "Difference", value: "difference" },
    ],
  },
  unit: {
    default: "days",
    options: [
      { label: "Days", value: "days" },
      { label: "Weeks", value: "weeks" },
      { label: "Months", value: "months" },
      { label: "Years", value: "years" },
    ],
  },
} as const;
