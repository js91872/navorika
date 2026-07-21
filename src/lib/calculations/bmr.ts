export interface BMRInputs {
  weight: number;
  height: number;
  age: number;
  gender: 'male' | 'female';
  unit: 'metric' | 'imperial';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'very' | 'extra';
}

export interface BMRResult {
  bmr: number;
  maintenanceCalories: number;
  activityLevels: {
    sedentary: number;
    light: number;
    moderate: number;
    very: number;
    extra: number;
  };
}

export function calculateBMR(inputs: BMRInputs): BMRResult {
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

  // Activity multipliers
  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    very: 1.725,
    extra: 1.9,
  };

  const maintenanceCalories = bmr * activityMultipliers[inputs.activityLevel];

  return {
    bmr: Math.round(bmr),
    maintenanceCalories: Math.round(maintenanceCalories),
    activityLevels: {
      sedentary: Math.round(bmr * 1.2),
      light: Math.round(bmr * 1.375),
      moderate: Math.round(bmr * 1.55),
      very: Math.round(bmr * 1.725),
      extra: Math.round(bmr * 1.9),
    },
  };
}
