export interface BMIInputs {
  weight: number;
  height: number;
  age: number;
  gender: 'male' | 'female';
  activity: 'sedentary' | 'moderate' | 'active' | 'athlete';
  unit: 'metric' | 'imperial';
  feet?: number;
  inches?: number;
}

export interface BMIResult {
  bmi: number;
  category: string;
  color: 'default' | 'green' | 'blue' | 'purple' | 'amber' | 'rose';
  bodyFat: number;
  isAthleticSkew: boolean;
  healthyWeightRange: { min: number; max: number };
}

export function calculateBMI(inputs: BMIInputs): BMIResult {
  const { weight, height, age, gender, activity, unit, feet = 0, inches = 0 } = inputs;

  // Calculate BMI
  let bmiValue = 0;
  if (unit === 'metric') {
    const heightM = height / 100;
    bmiValue = weight / (heightM * heightM);
  } else {
    const totalInches = (feet * 12) + inches;
    bmiValue = (weight / (totalInches * totalInches)) * 703;
  }

  const rawBmi = Number(bmiValue.toFixed(1));
  
  // Adjust for gender
  const genderConstant = gender === 'female' ? 0 : 1;
  const sexAdjustment = gender === 'female' ? 0.96 : 1.0;
  const adjustedBmi = Number((rawBmi * sexAdjustment).toFixed(1));

  // Estimate body fat percentage
  let estimatedBodyFat = 1.20 * rawBmi + 0.23 * age - 10.8 * genderConstant - 5.4;
  
  // Activity adjustments
  const activityAdjustments = {
    sedentary: 0,
    moderate: 0,
    active: -3.0,
    athlete: -6.0,
  };
  estimatedBodyFat += activityAdjustments[activity] || 0;
  
  // Determine category
  let category = '';
  let color: BMIResult['color'] = 'default';
  
  if (adjustedBmi < 18.5) {
    category = 'Underweight';
    color = 'amber';
  } else if (adjustedBmi >= 18.5 && adjustedBmi < 25) {
    category = 'Normal Weight';
    color = 'green';
  } else if (adjustedBmi >= 25 && adjustedBmi < 30) {
    category = 'Overweight';
    color = 'purple';
  } else {
    category = 'Obese';
    color = 'rose';
  }

  // Calculate healthy weight range
  const minHealthy = 18.5 * (unit === 'metric' ? (height/100) ** 2 : ((feet*12 + inches) ** 2) / 703);
  const maxHealthy = 24.9 * (unit === 'metric' ? (height/100) ** 2 : ((feet*12 + inches) ** 2) / 703);

  return {
    bmi: adjustedBmi,
    category,
    color,
    bodyFat: Math.max(4, Number(estimatedBodyFat.toFixed(1))),
    isAthleticSkew: activity === 'athlete' && adjustedBmi >= 25,
    healthyWeightRange: {
      min: Number(minHealthy.toFixed(1)),
      max: Number(maxHealthy.toFixed(1)),
    },
  };
}

export function getBMICategory(bmi: number): string {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal Weight';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
}

export function getBMIEmoji(bmi: number): string {
  if (bmi < 18.5) return '📉';
  if (bmi < 25) return '✅';
  if (bmi < 30) return '⚠️';
  return '🚨';
}

export function getBMIColor(bmi: number): string {
  if (bmi < 18.5) return 'amber';
  if (bmi < 25) return 'green';
  if (bmi < 30) return 'purple';
  return 'rose';
}
