export const proteinConfig = {
  weight: {
    default: 70,
    min: 20,
    max: 300,
    step: 0.5,
  },
  unit: {
    default: "metric",
    options: [
      { label: "Metric (kg)", value: "metric" },
      { label: "Imperial (lbs)", value: "imperial" },
    ],
  },
  activityLevel: {
    default: "moderate",
    options: [
      { label: "Sedentary (Little or no exercise)", value: "sedentary" },
      { label: "Lightly Active (1-3 days/week)", value: "light" },
      { label: "Moderately Active (3-5 days/week)", value: "moderate" },
      { label: "Very Active (6-7 days/week)", value: "very" },
      { label: "Extra Active (Athlete/Physical job)", value: "extra" },
    ],
  },
  goal: {
    default: "maintain",
    options: [
      { label: "Maintain", value: "maintain" },
      { label: "Build Muscle", value: "muscle" },
      { label: "Weight Loss", value: "lose" },
    ],
  },
} as const;
