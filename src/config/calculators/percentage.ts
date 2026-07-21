export const percentageConfig = {
  mode: {
    default: "find-percentage",
    options: [
      { label: "Find Percentage", value: "find-percentage" },
      { label: "Find Value", value: "find-value" },
      { label: "Find Change", value: "find-change" },
      { label: "Find Difference", value: "find-difference" },
    ],
  },
} as const;
