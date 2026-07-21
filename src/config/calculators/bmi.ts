export const bmiConfig = {
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
  unit: {
    default: "metric",
    options: [
      { label: "Metric (kg/cm)", value: "metric" },
      { label: "Imperial (lbs/in)", value: "imperial" },
    ],
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
} as const;
