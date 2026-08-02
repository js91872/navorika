export interface HealthInputs {
  // Common inputs
  age: number;
  gender: 'male' | 'female';
  weight: number; // in kg
  height: number; // in cm
  activityLevel?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very-active';
}

// ==================== TDEE CALCULATOR ====================
export function calculateTDEE(inputs: HealthInputs): {
  bmr: number;
  tdee: number;
  activityMultiplier: number;
} {
  const { age, gender, weight, height, activityLevel = 'sedentary' } = inputs;
  
  // Mifflin-St Jeor Equation
  let bmr = 10 * weight + 6.25 * height - 5 * age;
  bmr += gender === 'male' ? 5 : -161;

  const multipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    'very-active': 1.9,
  };
  
  const multiplier = multipliers[activityLevel] || 1.2;
  const tdee = bmr * multiplier;

  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    activityMultiplier: multiplier,
  };
}

// ==================== BODY FAT CALCULATOR ====================
export function calculateBodyFat(inputs: {
  gender: 'male' | 'female';
  waist: number; // cm
  hip?: number; // cm (for females)
  neck: number; // cm
  height: number; // cm
}): { bodyFat: number; category: string } {
  const { gender, waist, hip = 0, neck, height } = inputs;
  
  let bodyFat: number;
  if (gender === 'male') {
    // Navy method
    bodyFat = 86.010 * Math.log10(waist - neck) - 70.041 * Math.log10(height) + 36.76;
  } else {
    bodyFat = 163.205 * Math.log10(waist + hip - neck) - 97.684 * Math.log10(height) - 78.387;
  }

  // Categories
  let category = '';
  if (gender === 'male') {
    if (bodyFat < 6) category = 'Essential Fat';
    else if (bodyFat < 14) category = 'Athlete';
    else if (bodyFat < 18) category = 'Fitness';
    else if (bodyFat < 25) category = 'Acceptable';
    else category = 'Obese';
  } else {
    if (bodyFat < 14) category = 'Essential Fat';
    else if (bodyFat < 21) category = 'Athlete';
    else if (bodyFat < 25) category = 'Fitness';
    else if (bodyFat < 32) category = 'Acceptable';
    else category = 'Obese';
  }

  return {
    bodyFat: Math.round(bodyFat * 10) / 10,
    category,
  };
}

// ==================== IDEAL WEIGHT CALCULATOR ====================
export function calculateIdealWeight(inputs: {
  gender: 'male' | 'female';
  height: number; // cm
}): {
  robinson: number;
  miller: number;
  devine: number;
  hamwi: number;
  bmi: number;
} {
  const { gender, height } = inputs;
  const heightInInches = height / 2.54;
  
  // Robinson formula (1983)
  let robinson = 52 + 1.9 * (heightInInches - 60);
  if (gender === 'female') robinson = 49 + 1.7 * (heightInInches - 60);
  
  // Miller formula (1983)
  let miller = 56.2 + 1.41 * (heightInInches - 60);
  if (gender === 'female') miller = 53.1 + 1.36 * (heightInInches - 60);
  
  // Devine formula (1974)
  let devine = 50 + 2.3 * (heightInInches - 60);
  if (gender === 'female') devine = 45.5 + 2.3 * (heightInInches - 60);
  
  // Hamwi formula (1964)
  let hamwi = 48 + 2.7 * (heightInInches - 60);
  if (gender === 'female') hamwi = 45.5 + 2.2 * (heightInInches - 60);
  
  // BMI-based ideal weight (BMI = 22)
  const bmi = 22 * (height / 100) * (height / 100);

  return {
    robinson: Math.round(robinson),
    miller: Math.round(miller),
    devine: Math.round(devine),
    hamwi: Math.round(hamwi),
    bmi: Math.round(bmi * 10) / 10,
  };
}

// ==================== WATER INTAKE CALCULATOR ====================
export function calculateWaterIntake(inputs: {
  weight: number; // kg
  age: number;
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very-active';
  isPregnant?: boolean;
  isBreastfeeding?: boolean;
}): { dailyWater: number; glasses: number } {
  const { weight, age, activityLevel, isPregnant = false, isBreastfeeding = false } = inputs;
  
  // Base: 30-35 ml per kg
  let water = weight * 33;
  
  // Age adjustment
  if (age > 65) water *= 0.9;
  
  // Activity adjustment
  const activityFactors = {
    sedentary: 1,
    light: 1.1,
    moderate: 1.2,
    active: 1.3,
    'very-active': 1.4,
  };
  water *= activityFactors[activityLevel] || 1;
  
  // Pregnancy/breastfeeding
  if (isPregnant) water += 300;
  if (isBreastfeeding) water += 700;
  
  // Convert to glasses (250ml)
  const glasses = water / 250;

  return {
    dailyWater: Math.round(water),
    glasses: Math.round(glasses * 10) / 10,
  };
}

// ==================== MACRO CALCULATOR ====================
export function calculateMacros(inputs: {
  weight: number; // kg
  tdee: number;
  goal: 'maintain' | 'lose' | 'gain';
  proteinRatio?: number; // grams per kg
  fatRatio?: number; // percentage
}): {
  protein: number;
  carbs: number;
  fat: number;
  calories: number;
} {
  const { weight, tdee, goal, proteinRatio = 1.6, fatRatio = 30 } = inputs;
  
  // Adjust calories based on goal
  let calories = tdee;
  if (goal === 'lose') calories = tdee - 500;
  else if (goal === 'gain') calories = tdee + 300;
  
  // Protein: 1.6-2.2g per kg
  const protein = weight * proteinRatio;
  
  // Fat: 20-35% of calories
  const fat = (calories * (fatRatio / 100)) / 9;
  
  // Carbs: remaining calories
  const carbs = (calories - (protein * 4) - (fat * 9)) / 4;

  return {
    protein: Math.round(protein),
    carbs: Math.round(carbs),
    fat: Math.round(fat),
    calories: Math.round(calories),
  };
}

// ==================== LEAN BODY MASS ====================
export function calculateLeanBodyMass(inputs: {
  weight: number; // kg
  bodyFat: number; // percentage
}): { lbm: number; fatMass: number } {
  const { weight, bodyFat } = inputs;
  const fatMass = weight * (bodyFat / 100);
  const lbm = weight - fatMass;
  
  return {
    lbm: Math.round(lbm * 10) / 10,
    fatMass: Math.round(fatMass * 10) / 10,
  };
}

// ==================== WAIST-TO-HIP RATIO ====================
export function calculateWHR(inputs: {
  waist: number; // cm
  hip: number; // cm
}): { ratio: number; risk: string } {
  const { waist, hip } = inputs;
  const ratio = waist / hip;
  
  let risk = 'Low';
  if (ratio > 0.95) risk = 'High';
  else if (ratio > 0.85) risk = 'Moderate';
  
  return {
    ratio: Math.round(ratio * 100) / 100,
    risk,
  };
}

// ==================== WAIST-TO-HEIGHT RATIO ====================
export function calculateWHRatio(inputs: {
  waist: number; // cm
  height: number; // cm
}): { ratio: number; risk: string } {
  const { waist, height } = inputs;
  const ratio = waist / height;
  
  let risk = 'Low';
  if (ratio > 0.6) risk = 'High';
  else if (ratio > 0.5) risk = 'Moderate';
  
  return {
    ratio: Math.round(ratio * 100) / 100,
    risk,
  };
}
