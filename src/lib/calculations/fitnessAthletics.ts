/**
 * Pure calculation functions for Health, Fitness & Athletics (Batch 08 Wave D).
 * - Macronutrient Calculator
 * - Running Pace Calculator
 * - One-Rep Max Calculator
 * - Hydration Calculator
 */

export interface MacronutrientInput {
  dailyCalories: number;
  macroSplitGoal?: 'balanced' | 'fat-loss' | 'muscle-gain' | 'keto' | 'endurance' | string;
  bodyWeightKg?: number;
}

export interface MacronutrientResult {
  proteinGrams: number;
  proteinCalories: number;
  carbGrams: number;
  carbCalories: number;
  fatGrams: number;
  fatCalories: number;
  proteinPerKgBodyweight: number;
}

export function calculateMacronutrients(input: MacronutrientInput): MacronutrientResult {
  const calories = Number.isFinite(input.dailyCalories) ? Math.max(500, input.dailyCalories) : 2200;
  const goal = String(input.macroSplitGoal ?? 'balanced').toLowerCase();
  const weight = Number.isFinite(input.bodyWeightKg) && (input.bodyWeightKg ?? 0) > 0
    ? (input.bodyWeightKg ?? 75)
    : 75;

  let pPct = 30;
  let cPct = 40;
  let fPct = 30;

  if (goal.includes('fat') || goal.includes('loss') || goal.includes('cut')) {
    pPct = 35;
    cPct = 35;
    fPct = 30;
  } else if (goal.includes('muscle') || goal.includes('gain') || goal.includes('bulk')) {
    pPct = 30;
    cPct = 50;
    fPct = 20;
  } else if (goal.includes('keto') || goal.includes('low-carb')) {
    pPct = 25;
    cPct = 5;
    fPct = 70;
  } else if (goal.includes('endurance')) {
    pPct = 20;
    cPct = 60;
    fPct = 20;
  }

  const proteinCalories = Math.round(calories * (pPct / 100));
  const carbCalories = Math.round(calories * (cPct / 100));
  const fatCalories = Math.round(calories * (fPct / 100));

  const proteinGrams = Math.round(proteinCalories / 4);
  const carbGrams = Math.round(carbCalories / 4);
  const fatGrams = Math.round(fatCalories / 9);

  const proteinPerKgBodyweight = Number((proteinGrams / weight).toFixed(2));

  return {
    proteinGrams,
    proteinCalories,
    carbGrams,
    carbCalories,
    fatGrams,
    fatCalories,
    proteinPerKgBodyweight,
  };
}

export interface RunningPaceInput {
  raceDistancePreset?: string;
  distanceKm?: number;
  timeHours?: number;
  timeMinutes?: number;
  timeSeconds?: number;
}

export interface RunningPaceResult {
  pacePerKm: string;
  pacePerMile: string;
  speedKmh: number;
  speedMph: number;
  equivalent5kTime: string;
  equivalent10kTime: string;
  equivalentMarathonTime: string;
}

function formatDuration(totalSeconds: number): string {
  if (!Number.isFinite(totalSeconds) || totalSeconds <= 0) return '0:00';
  const sec = Math.round(totalSeconds);
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function calculateRunningPace(input: RunningPaceInput): RunningPaceResult {
  let dist = Number.isFinite(input.distanceKm) && (input.distanceKm ?? 0) > 0
    ? (input.distanceKm ?? 21.0975)
    : 21.0975;

  const preset = String(input.raceDistancePreset ?? '').toLowerCase();
  if (preset === '5k') {
    dist = 5;
  } else if (preset === '10k') {
    dist = 10;
  } else if (preset.includes('half')) {
    dist = 21.0975;
  } else if (preset.includes('marathon')) {
    dist = 42.195;
  }

  const h = Number.isFinite(input.timeHours) ? Math.max(0, input.timeHours ?? 0) : 0;
  const m = Number.isFinite(input.timeMinutes) ? Math.max(0, input.timeMinutes ?? 0) : 0;
  const s = Number.isFinite(input.timeSeconds) ? Math.max(0, input.timeSeconds ?? 0) : 0;

  const totalSeconds = h * 3600 + m * 60 + s;
  if (totalSeconds <= 0 || dist <= 0) {
    return {
      pacePerKm: '0:00 /km',
      pacePerMile: '0:00 /mi',
      speedKmh: 0,
      speedMph: 0,
      equivalent5kTime: '0:00',
      equivalent10kTime: '0:00',
      equivalentMarathonTime: '0:00',
    };
  }

  const distMiles = dist / 1.609344;
  const secPerKm = totalSeconds / dist;
  const secPerMile = totalSeconds / distMiles;

  const pacePerKm = `${formatDuration(secPerKm)} /km`;
  const pacePerMile = `${formatDuration(secPerMile)} /mi`;

  const speedKmh = Number(((dist / totalSeconds) * 3600).toFixed(2));
  const speedMph = Number(((distMiles / totalSeconds) * 3600).toFixed(2));

  // Pete Riegel race projection formula: T2 = T1 * (D2 / D1)^1.06
  const pred5kSec = totalSeconds * Math.pow(5 / dist, 1.06);
  const pred10kSec = totalSeconds * Math.pow(10 / dist, 1.06);
  const predMarathonSec = totalSeconds * Math.pow(42.195 / dist, 1.06);

  return {
    pacePerKm,
    pacePerMile,
    speedKmh,
    speedMph,
    equivalent5kTime: formatDuration(pred5kSec),
    equivalent10kTime: formatDuration(pred10kSec),
    equivalentMarathonTime: formatDuration(predMarathonSec),
  };
}

export interface OneRepMaxInput {
  weightLifted: number;
  repetitions: number;
  formulaMethod?: 'average' | 'epley' | 'brzycki' | 'lander' | 'lombardi' | string;
}

export interface OneRepMaxResult {
  estimated1rm: number;
  epleyEstimate: number;
  brzyckiEstimate: number;
  landerEstimate: number;
  rep95Percent: number;
  rep90Percent: number;
  rep85Percent: number;
  rep80Percent: number;
  rep70Percent: number;
}

export function calculateOneRepMax(input: OneRepMaxInput): OneRepMaxResult {
  const w = Number.isFinite(input.weightLifted) ? Math.max(0, input.weightLifted) : 0;
  const r = Number.isFinite(input.repetitions) ? Math.min(30, Math.max(1, Math.round(input.repetitions))) : 1;
  const method = String(input.formulaMethod ?? 'average').toLowerCase();

  if (w <= 0) {
    return {
      estimated1rm: 0,
      epleyEstimate: 0,
      brzyckiEstimate: 0,
      landerEstimate: 0,
      rep95Percent: 0,
      rep90Percent: 0,
      rep85Percent: 0,
      rep80Percent: 0,
      rep70Percent: 0,
    };
  }

  if (r === 1) {
    const max = Math.round(w);
    return {
      estimated1rm: max,
      epleyEstimate: max,
      brzyckiEstimate: max,
      landerEstimate: max,
      rep95Percent: Math.round(max * 0.95),
      rep90Percent: Math.round(max * 0.90),
      rep85Percent: Math.round(max * 0.85),
      rep80Percent: Math.round(max * 0.80),
      rep70Percent: Math.round(max * 0.70),
    };
  }

  const epley = w * (1 + r / 30);
  const brzycki = w * (36 / (37 - Math.min(r, 36)));
  const lander = (100 * w) / (101.3 - 2.67123 * r);
  const lombardi = w * Math.pow(r, 0.10);

  let chosen = (epley + brzycki) / 2;
  if (method === 'epley') {
    chosen = epley;
  } else if (method === 'brzycki') {
    chosen = brzycki;
  } else if (method === 'lander') {
    chosen = lander;
  } else if (method === 'lombardi') {
    chosen = lombardi;
  }

  const estimated1rm = Math.round(chosen);
  const epleyEstimate = Math.round(epley);
  const brzyckiEstimate = Math.round(brzycki);
  const landerEstimate = Math.round(lander);

  return {
    estimated1rm,
    epleyEstimate,
    brzyckiEstimate,
    landerEstimate,
    rep95Percent: Math.round(estimated1rm * 0.95),
    rep90Percent: Math.round(estimated1rm * 0.90),
    rep85Percent: Math.round(estimated1rm * 0.85),
    rep80Percent: Math.round(estimated1rm * 0.80),
    rep70Percent: Math.round(estimated1rm * 0.70),
  };
}

export interface HydrationInput {
  bodyWeightKg: number;
  exerciseDurationMinutes?: number;
  climateEnvironment?: 'temperate' | 'hot-dry' | 'hot-humid' | 'cold-high-altitude' | string;
}

export interface HydrationResult {
  totalWaterLiters: number;
  totalFluidOunces: number;
  standardCups8oz: number;
  baselineLiters: number;
  exerciseAdditionLiters: number;
}

export function calculateHydration(input: HydrationInput): HydrationResult {
  const weight = Number.isFinite(input.bodyWeightKg) ? Math.max(20, input.bodyWeightKg) : 70;
  const exerciseMins = Number.isFinite(input.exerciseDurationMinutes)
    ? Math.max(0, input.exerciseDurationMinutes ?? 0)
    : 0;
  const climate = String(input.climateEnvironment ?? 'temperate').toLowerCase();

  let climateLiters = 0;
  if (climate.includes('dry')) {
    climateLiters = 0.40;
  } else if (climate.includes('humid')) {
    climateLiters = 0.60;
  } else if (climate.includes('cold') || climate.includes('altitude')) {
    climateLiters = 0.30;
  }

  // Baseline: 35 mL per kg
  const baselineLiters = Number((weight * 0.035).toFixed(2));
  // Exercise sweat: ~350 mL per 30 minutes (11.667 mL/min)
  const exerciseMl = Math.round(exerciseMins * (350 / 30));
  const exerciseAdditionLiters = Math.round(exerciseMl / 10) / 100;

  const totalWaterLiters = Number((baselineLiters + exerciseAdditionLiters + climateLiters).toFixed(2));
  const totalFluidOunces = Number((totalWaterLiters * 33.814).toFixed(1));
  const standardCups8oz = Number((totalFluidOunces / 8).toFixed(1));

  return {
    totalWaterLiters,
    totalFluidOunces,
    standardCups8oz,
    baselineLiters,
    exerciseAdditionLiters,
  };
}
