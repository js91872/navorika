export interface BMRInputs {
  age: number;
  gender: 'male' | 'female';
  weight: number;
  height: number;
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very-active';
  goal?: 'maintain' | 'lose' | 'gain';
}

export interface BMRResult {
  bmr: number;
  tdee: number;
  dailyCalories: {
    maintain: number;
    lose: number;
    gain: number;
  };
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
  activityMultiplier: number;
}

const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  'very-active': 1.9,
};

export function calculateBMR(inputs: BMRInputs): BMRResult {
  const { age, gender, weight, height, activityLevel, goal = 'maintain' } = inputs;

  let bmr: number;
  if (gender === 'male') {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }

  const activityMultiplier = ACTIVITY_MULTIPLIERS[activityLevel];
  const tdee = bmr * activityMultiplier;

  const maintain = tdee;
  const lose = tdee - 500;
  const gain = tdee + 500;

  const protein = (maintain * 0.30) / 4;
  const carbs = (maintain * 0.40) / 4;
  const fat = (maintain * 0.30) / 9;

  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    dailyCalories: {
      maintain: Math.round(maintain),
      lose: Math.max(1200, Math.round(lose)),
      gain: Math.round(gain),
    },
    macros: {
      protein: Math.round(protein),
      carbs: Math.round(carbs),
      fat: Math.round(fat),
    },
    activityMultiplier,
  };
}

export function calculateMacros(
  calories: number,
  ratio: { protein: number; carbs: number; fat: number }
): { protein: number; carbs: number; fat: number } {
  const protein = (calories * ratio.protein / 100) / 4;
  const carbs = (calories * ratio.carbs / 100) / 4;
  const fat = (calories * ratio.fat / 100) / 9;
  
  return {
    protein: Math.round(protein),
    carbs: Math.round(carbs),
    fat: Math.round(fat),
  };
}
