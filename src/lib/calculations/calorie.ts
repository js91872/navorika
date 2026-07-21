export interface CalorieInputs {
  weight: number;
  height: number;
  age: number;
  gender: 'male' | 'female';
  unit: 'metric' | 'imperial';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'very' | 'extra';
  goal: 'maintain' | 'lose' | 'gain';
}

export interface CalorieResult {
  bmr: number;
  maintenanceCalories: number;
  goalCalories: number;
  protein: number;
  carbs: number;
  fat: number;
  macros: {
    protein: { grams: number; calories: number; percentage: number };
    carbs: { grams: number; calories: number; percentage: number };
    fat: { grams: number; calories: number; percentage: number };
  };
}

export function calculateCalories(inputs: CalorieInputs): CalorieResult {
  let weightKg = inputs.weight;
  let heightCm = inputs.height;

  if (inputs.unit === 'imperial') {
    weightKg = inputs.weight * 0.453592;
    heightCm = inputs.height * 2.54;
  }

  // Mifflin-St Jeor Equation
  let bmr: number;
  if (inputs.gender === 'male') {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * inputs.age + 5;
  } else {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * inputs.age - 161;
  }

  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    very: 1.725,
    extra: 1.9,
  };

  const maintenanceCalories = bmr * activityMultipliers[inputs.activityLevel];

  // Adjust for goal
  let goalMultiplier = 1;
  let goalLabel = '';
  if (inputs.goal === 'lose') {
    goalMultiplier = 0.85; // 15% deficit
    goalLabel = 'Weight Loss';
  } else if (inputs.goal === 'gain') {
    goalMultiplier = 1.15; // 15% surplus
    goalLabel = 'Weight Gain';
  } else {
    goalLabel = 'Maintenance';
  }

  const goalCalories = Math.round(maintenanceCalories * goalMultiplier);

  // Macro split (40% carbs, 30% protein, 30% fat)
  const proteinCalories = goalCalories * 0.30;
  const carbsCalories = goalCalories * 0.40;
  const fatCalories = goalCalories * 0.30;

  return {
    bmr: Math.round(bmr),
    maintenanceCalories: Math.round(maintenanceCalories),
    goalCalories,
    protein: Math.round(proteinCalories / 4),
    carbs: Math.round(carbsCalories / 4),
    fat: Math.round(fatCalories / 9),
    macros: {
      protein: {
        grams: Math.round(proteinCalories / 4),
        calories: Math.round(proteinCalories),
        percentage: 30,
      },
      carbs: {
        grams: Math.round(carbsCalories / 4),
        calories: Math.round(carbsCalories),
        percentage: 40,
      },
      fat: {
        grams: Math.round(fatCalories / 9),
        calories: Math.round(fatCalories),
        percentage: 30,
      },
    },
  };
}
