export type BreedSize = 'small' | 'medium' | 'large' | 'giant';

export interface DogAgeParams {
  dogAge: number;
  breedSize: BreedSize | string;
}

export interface DogAgeResult {
  humanEquivalent: number | null;
  lifeStage: string;
  [key: string]: number | string | null;
}

export interface PuppyGrowthParams {
  ageWeeks: number;
  currentWeight: number;
  breedSize: BreedSize | string;
}

export interface PuppyGrowthResult {
  estimatedAdultWeight: number | null;
  lowEstimate: number | null;
  highEstimate: number | null;
  growthProgress: number | null;
  [key: string]: number | string | null;
}

export type CatLifeStageFactor =
  | 'neutered-adult'
  | 'intact-adult'
  | 'inactive-prone'
  | 'active-adult'
  | 'kitten-young'
  | 'kitten-older'
  | 'senior';

export interface CatCalorieParams {
  weightKg: number;
  factor: CatLifeStageFactor | string | number;
}

export interface CatCalorieResult {
  rer: number | null;
  dailyCalories: number | null;
  [key: string]: number | string | null;
}

const normalizeBreedSize = (size: string): BreedSize => {
  const s = String(size).toLowerCase().trim();
  if (s === 'small' || s === 'giant' || s === 'large') return s;
  return 'medium';
};

export function calculateDogAge(params: DogAgeParams): DogAgeResult {
  const { dogAge, breedSize: rawSize } = params;
  if (!Number.isFinite(dogAge) || dogAge < 0) {
    return { humanEquivalent: null, lifeStage: 'Invalid age' };
  }

  const breedSize = normalizeBreedSize(rawSize);
  const age = Math.min(30, Math.max(0, dogAge));

  let humanEquivalent = 0;
  if (age === 0) {
    humanEquivalent = 0;
  } else if (age <= 1) {
    const yearOneMax = breedSize === 'giant' ? 12 : 15;
    humanEquivalent = age * yearOneMax;
  } else if (age <= 2) {
    const yearOneMax = breedSize === 'giant' ? 12 : 15;
    const yearTwoTarget = breedSize === 'giant' ? 22 : 24;
    humanEquivalent = yearOneMax + (age - 1) * (yearTwoTarget - yearOneMax);
  } else {
    const base = breedSize === 'giant' ? 22 : 24;
    const ratePerYear =
      breedSize === 'small' ? 4 : breedSize === 'medium' ? 5 : breedSize === 'large' ? 6 : 8;
    humanEquivalent = base + (age - 2) * ratePerYear;
  }

  humanEquivalent = Math.round(humanEquivalent * 10) / 10;

  let lifeStage = 'Adult';
  if (age < 1) {
    lifeStage = 'Puppy';
  } else if (age < 3) {
    lifeStage = 'Young Adult';
  } else {
    const seniorStart =
      breedSize === 'giant' ? 5 : breedSize === 'large' ? 6 : 7;
    const geriatricStart =
      breedSize === 'giant' ? 8 : breedSize === 'large' ? 9 : breedSize === 'medium' ? 10 : 11;

    if (age >= geriatricStart) {
      lifeStage = 'Geriatric';
    } else if (age >= seniorStart) {
      lifeStage = 'Senior';
    } else {
      lifeStage = 'Mature Adult';
    }
  }

  return {
    humanEquivalent,
    lifeStage,
  };
}

// Milestone growth curve fractions [weeks, completion fraction]
const GROWTH_CURVES: Record<BreedSize, Array<[number, number]>> = {
  small: [
    [0, 0],
    [4, 0.15],
    [8, 0.3],
    [12, 0.48],
    [16, 0.64],
    [20, 0.76],
    [24, 0.85],
    [32, 0.94],
    [40, 0.98],
    [44, 1.0],
    [104, 1.0],
  ],
  medium: [
    [0, 0],
    [4, 0.12],
    [8, 0.24],
    [12, 0.38],
    [16, 0.5],
    [20, 0.62],
    [24, 0.72],
    [32, 0.85],
    [40, 0.94],
    [52, 1.0],
    [104, 1.0],
  ],
  large: [
    [0, 0],
    [4, 0.08],
    [8, 0.18],
    [12, 0.3],
    [16, 0.42],
    [20, 0.53],
    [24, 0.63],
    [32, 0.78],
    [40, 0.88],
    [52, 0.95],
    [72, 1.0],
    [104, 1.0],
  ],
  giant: [
    [0, 0],
    [4, 0.06],
    [8, 0.14],
    [12, 0.23],
    [16, 0.33],
    [20, 0.43],
    [24, 0.52],
    [32, 0.67],
    [40, 0.78],
    [52, 0.86],
    [72, 0.95],
    [96, 1.0],
    [104, 1.0],
  ],
};

function getGrowthFraction(ageWeeks: number, size: BreedSize): number {
  const curve = GROWTH_CURVES[size];
  if (ageWeeks <= curve[0][0]) return curve[0][1];
  const last = curve[curve.length - 1];
  if (ageWeeks >= last[0]) return last[1];

  for (let i = 0; i < curve.length - 1; i++) {
    const [w1, f1] = curve[i];
    const [w2, f2] = curve[i + 1];
    if (ageWeeks >= w1 && ageWeeks <= w2) {
      if (w2 === w1) return f1;
      const ratio = (ageWeeks - w1) / (w2 - w1);
      return f1 + ratio * (f2 - f1);
    }
  }
  return 1.0;
}

export function calculatePuppyGrowth(params: PuppyGrowthParams): PuppyGrowthResult {
  const { ageWeeks, currentWeight, breedSize: rawSize } = params;

  if (
    !Number.isFinite(ageWeeks) ||
    !Number.isFinite(currentWeight) ||
    ageWeeks < 4 ||
    currentWeight <= 0
  ) {
    return {
      estimatedAdultWeight: null,
      lowEstimate: null,
      highEstimate: null,
      growthProgress: null,
    };
  }

  const breedSize = normalizeBreedSize(rawSize);
  const boundedAge = Math.min(104, Math.max(4, ageWeeks));
  const fraction = getGrowthFraction(boundedAge, breedSize);

  if (fraction <= 0) {
    return {
      estimatedAdultWeight: null,
      lowEstimate: null,
      highEstimate: null,
      growthProgress: null,
    };
  }

  const estimatedAdultWeight = Math.round((currentWeight / fraction) * 10) / 10;
  const growthProgress = Math.min(100, Math.round(fraction * 1000) / 10);

  let margin = 0.1;
  if (boundedAge <= 12) {
    margin = 0.15;
  } else if (boundedAge <= 24) {
    margin = 0.1;
  } else if (boundedAge <= 40) {
    margin = 0.07;
  } else {
    margin = 0.05;
  }

  const lowEstimate = Math.max(currentWeight, Math.round(estimatedAdultWeight * (1 - margin) * 10) / 10);
  const highEstimate = Math.max(estimatedAdultWeight, Math.round(estimatedAdultWeight * (1 + margin) * 10) / 10);

  return {
    estimatedAdultWeight,
    lowEstimate,
    highEstimate,
    growthProgress,
  };
}

const CAT_FACTORS: Record<string, number> = {
  'neutered-adult': 1.2,
  'intact-adult': 1.4,
  'inactive-prone': 1.0,
  'active-adult': 1.6,
  'kitten-young': 2.5,
  'kitten-older': 2.0,
  senior: 1.1,
};

export function calculateCatCalories(params: CatCalorieParams): CatCalorieResult {
  const { weightKg, factor: rawFactor } = params;

  if (!Number.isFinite(weightKg) || weightKg <= 0) {
    return { rer: null, dailyCalories: null };
  }

  let factorMultiplier = 1.2;
  if (typeof rawFactor === 'number' && Number.isFinite(rawFactor) && rawFactor > 0) {
    factorMultiplier = rawFactor;
  } else if (typeof rawFactor === 'string') {
    const key = rawFactor.toLowerCase().trim();
    factorMultiplier = CAT_FACTORS[key] ?? 1.2;
  }

  // Resting Energy Requirement (RER) = 70 * weightKg^0.75
  const rawRer = 70 * Math.pow(weightKg, 0.75);
  if (!Number.isFinite(rawRer) || rawRer <= 0) {
    return { rer: null, dailyCalories: null };
  }

  const rer = Math.round(rawRer * 10) / 10;
  const dailyCalories = Math.round(rawRer * factorMultiplier);

  return {
    rer,
    dailyCalories,
  };
}
