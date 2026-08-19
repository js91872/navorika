export interface BMIInputs {
  weight: number;
  height: number;
  unit: 'metric' | 'imperial';
  feet?: number;
  inches?: number;
}

export interface BMIResult {
  bmi: number;
  category: 'Underweight' | 'Healthy Weight' | 'Overweight' | 'Obesity';
  healthyWeightRange: { min: number; max: number };
}

export function calculateBMI({ weight, height, unit, feet = 0, inches = 0 }: BMIInputs): BMIResult {
  const heightInMetres = height / 100;
  const totalInches = feet * 12 + inches;
  const bmi = unit === 'metric' ? weight / heightInMetres ** 2 : (703 * weight) / totalInches ** 2;
  const heightFactor = unit === 'metric' ? heightInMetres ** 2 : totalInches ** 2 / 703;

  return {
    bmi: Number(bmi.toFixed(1)),
    category: getBMICategory(bmi),
    healthyWeightRange: {
      min: Number((18.5 * heightFactor).toFixed(1)),
      max: Number((24.9 * heightFactor).toFixed(1)),
    },
  };
}

export function getBMICategory(bmi: number): BMIResult['category'] {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Healthy Weight';
  if (bmi < 30) return 'Overweight';
  return 'Obesity';
}
