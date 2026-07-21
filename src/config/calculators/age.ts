export const ageConfig = {
  dateFormat: {
    default: "DD/MM/YYYY",
    options: [
      { label: "DD/MM/YYYY", value: "DD/MM/YYYY" },
      { label: "MM/DD/YYYY", value: "MM/DD/YYYY" },
      { label: "YYYY-MM-DD", value: "YYYY-MM-DD" },
    ],
  },
} as const;
