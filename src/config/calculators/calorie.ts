export const calorieConfig = {
  weight: {
    default: 70,
    min: 20,
    max: 300,
    step: 0.5,
  },
  height: {
    default: 170,
    min: 100,
    max: 250,
    step: 1,
  },
  age: {
    default: 30,
    min: 2,
    max: 120,
    step: 1,
  },
  gender: {
    default: "male",
    options: [
      { label: "Male", value: "male" },
      { label: "Female", value: "female" },
    ],
  },
  unit: {
    default: "metric",
    options: [
      { label: "Metric (kg/cm)", value: "metric" },
      { label: "Imperial (lbs/in)", value: "imperial" },
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
      { label: "Maintain Weight", value: "maintain" },
      { label: "Lose Weight", value: "lose" },
      { label: "Gain Weight", value: "gain" },
    ],
  },
} as const;
