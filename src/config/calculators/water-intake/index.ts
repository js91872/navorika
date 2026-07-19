export const waterIntakeConfig = {
  weight: {
    default: 70,
    min: 20,
    max: 300,
    step: 1,
    label: "Weight",
    suffix: "kg",
  },
  activityLevel: {
    default: 1.5,
    options: [
      { label: "Sedentary (little or no exercise)", value: 1.2 },
      { label: "Lightly active (1-3 days/week)", value: 1.375 },
      { label: "Moderately active (3-5 days/week)", value: 1.55 },
      { label: "Very active (6-7 days/week)", value: 1.725 },
      { label: "Super active (athlete, physical job)", value: 1.9 },
    ],
  },
  climate: {
    default: "moderate",
    options: [
      { label: "Cold", value: "cold" },
      { label: "Moderate", value: "moderate" },
      { label: "Hot", value: "hot" },
    ],
  },
  unit: {
    default: "metric",
    options: [
      { label: "Metric (kg)", value: "metric" },
      { label: "Imperial (lbs)", value: "imperial" },
    ],
  },
} as const;
