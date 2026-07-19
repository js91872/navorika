export interface WaterIntakeInputs {
  weight: number;
  activityLevel: number;
  climate: 'cold' | 'moderate' | 'hot';
  unit: 'metric' | 'imperial';
}

export interface WaterIntakeResult {
  baseIntake: number; // base in ml
  activityAdjusted: number; // after activity
  climateAdjusted: number; // final in ml
  inLiters: number;
  inGlasses: number; // 250ml per glass
  recommendations: string[];
}

export function calculateWaterIntake(inputs: WaterIntakeInputs): WaterIntakeResult {
  const { weight, activityLevel, climate, unit } = inputs;

  // Convert weight to kg if imperial
  const weightInKg = unit === 'imperial' ? weight * 0.453592 : weight;

  // Base intake: 30-35ml per kg of body weight
  const baseIntake = weightInKg * 35; // using 35ml/kg as a moderate baseline

  // Adjust for activity level
  const activityAdjusted = baseIntake * activityLevel;

  // Adjust for climate
  let climateMultiplier = 1;
  if (climate === 'hot') {
    climateMultiplier = 1.3;
  } else if (climate === 'cold') {
    climateMultiplier = 0.9;
  }
  const climateAdjusted = activityAdjusted * climateMultiplier;

  const inLiters = climateAdjusted / 1000;
  const inGlasses = climateAdjusted / 250; // standard 250ml glass

  // Generate recommendations
  const recommendations = [
    `Based on your inputs, aim for ${inGlasses.toFixed(1)} glasses (250ml) of water daily.`,
    `This is approximately ${inLiters.toFixed(2)} liters per day.`,
  ];

  if (climate === 'hot') {
    recommendations.push('You live in a hot climate, so consider increasing intake during physical activity.');
  } else if (climate === 'cold') {
    recommendations.push('Your climate is cold, but don\'t forget to stay hydrated.');
  }

  if (activityLevel > 1.7) {
    recommendations.push('You are very active - increase intake on exercise days.');
  }

  return {
    baseIntake,
    activityAdjusted,
    climateAdjusted,
    inLiters,
    inGlasses,
    recommendations,
  };
}
