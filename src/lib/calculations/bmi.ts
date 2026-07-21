export interface BMIInputs {
  weight: number;
  height: number;
  unit: 'metric' | 'imperial';
  age: number;
  gender: 'male' | 'female';
}

export interface BMIResult {
  bmi: number;
  category: string;
  color: string;
  description: string;
  healthyWeightRange: {
    min: number;
    max: number;
  };
  riskLevel: string;
}

export function calculateBMI(inputs: BMIInputs): BMIResult {
  let weightKg = inputs.weight;
  let heightM = inputs.height / 100;

  if (inputs.unit === 'imperial') {
    // Convert pounds to kg, inches to meters
    weightKg = inputs.weight * 0.453592;
    heightM = inputs.height * 0.0254;
  }

  const bmi = weightKg / (heightM * heightM);
  const roundedBMI = Math.round(bmi * 10) / 10;

  // Determine BMI category
  let category = '';
  let color = '';
  let description = '';
  let riskLevel = '';

  if (roundedBMI < 16) {
    category = 'Severe Underweight';
    color = 'text-red-600';
    description = 'You are severely underweight. Please consult a healthcare professional.';
    riskLevel = 'High';
  } else if (roundedBMI < 18.5) {
    category = 'Underweight';
    color = 'text-orange-500';
    description = 'You are underweight. Consider a balanced diet to reach a healthy weight.';
    riskLevel = 'Moderate';
  } else if (roundedBMI < 25) {
    category = 'Normal Weight';
    color = 'text-green-600';
    description = 'You are in the healthy weight range. Keep up the good work!';
    riskLevel = 'Low';
  } else if (roundedBMI < 30) {
    category = 'Overweight';
    color = 'text-orange-500';
    description = 'You are overweight. Consider a balanced diet and regular exercise.';
    riskLevel = 'Moderate';
  } else if (roundedBMI < 35) {
    category = 'Obese (Class I)';
    color = 'text-red-500';
    description = 'You are in the obese category. Please consult a healthcare professional.';
    riskLevel = 'High';
  } else if (roundedBMI < 40) {
    category = 'Obese (Class II)';
    color = 'text-red-600';
    description = 'You are in the severely obese category. Please consult a healthcare professional immediately.';
    riskLevel = 'Very High';
  } else {
    category = 'Obese (Class III)';
    color = 'text-red-700';
    description = 'You are in the very severely obese category. Please consult a healthcare professional immediately.';
    riskLevel = 'Extremely High';
  }

  // Healthy weight range (BMI 18.5 to 24.9)
  const healthyWeightMin = 18.5 * (heightM * heightM);
  const healthyWeightMax = 24.9 * (heightM * heightM);

  return {
    bmi: roundedBMI,
    category,
    color,
    description,
    healthyWeightRange: {
      min: Math.round(healthyWeightMin * 10) / 10,
      max: Math.round(healthyWeightMax * 10) / 10,
    },
    riskLevel,
  };
}
