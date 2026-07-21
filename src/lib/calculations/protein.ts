export interface ProteinInputs {
  weight: number;
  unit: 'metric' | 'imperial';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'very' | 'extra';
  goal: 'maintain' | 'muscle' | 'lose';
}

export interface ProteinResult {
  dailyProtein: number;
  perMeal: number;
  perMealCount: number;
  recommendations: string[];
  proteinPerKg: number;
}

export function calculateProtein(inputs: ProteinInputs): ProteinResult {
  let weightKg = inputs.weight;

  if (inputs.unit === 'imperial') {
    weightKg = inputs.weight * 0.453592;
  }

  // Protein recommendations based on activity and goal
  let proteinPerKg: number;

  // Base protein needs
  if (inputs.goal === 'sedentary') {
    proteinPerKg = 0.8;
  } else if (inputs.goal === 'maintain') {
    if (inputs.activityLevel === 'sedentary') proteinPerKg = 0.8;
    else if (inputs.activityLevel === 'light') proteinPerKg = 1.0;
    else if (inputs.activityLevel === 'moderate') proteinPerKg = 1.2;
    else if (inputs.activityLevel === 'very') proteinPerKg = 1.4;
    else proteinPerKg = 1.6;
  } else if (inputs.goal === 'muscle') {
    if (inputs.activityLevel === 'sedentary') proteinPerKg = 1.2;
    else if (inputs.activityLevel === 'light') proteinPerKg = 1.4;
    else if (inputs.activityLevel === 'moderate') proteinPerKg = 1.6;
    else if (inputs.activityLevel === 'very') proteinPerKg = 1.8;
    else proteinPerKg = 2.0;
  } else { // lose
    if (inputs.activityLevel === 'sedentary') proteinPerKg = 1.0;
    else if (inputs.activityLevel === 'light') proteinPerKg = 1.2;
    else if (inputs.activityLevel === 'moderate') proteinPerKg = 1.4;
    else if (inputs.activityLevel === 'very') proteinPerKg = 1.6;
    else proteinPerKg = 1.8;
  }

  const dailyProtein = Math.round(weightKg * proteinPerKg);

  // Distribute across meals (3-4 meals recommended)
  const meals = inputs.activityLevel === 'extra' || inputs.goal === 'muscle' ? 4 : 3;
  const perMeal = Math.round(dailyProtein / meals);

  const recommendations: string[] = [];

  if (dailyProtein < 50) {
    recommendations.push('Consider increasing protein intake for better health');
  } else if (dailyProtein < 100) {
    recommendations.push('Good protein intake for general health');
  } else if (dailyProtein < 150) {
    recommendations.push('Excellent for muscle maintenance and recovery');
  } else {
    recommendations.push('High protein intake suitable for athletes and bodybuilders');
  }

  if (inputs.goal === 'muscle') {
    recommendations.push('Spread protein evenly across 4-5 meals for optimal muscle synthesis');
  }

  if (inputs.goal === 'lose') {
    recommendations.push('Higher protein intake helps preserve muscle during weight loss');
  }

  const perMealCount = meals;

  return {
    dailyProtein,
    perMeal,
    perMealCount,
    recommendations,
    proteinPerKg,
  };
}
