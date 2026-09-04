export interface CaffeineHalfLifeParams {
  doseMg: number;
  hoursElapsed: number;
  halfLifeHours: number;
}

export interface CaffeineHalfLifeResult {
  remainingMg: number | null;
  remainingPercent: number | null;
  eliminatedMg: number | null;
  [key: string]: number | null;
}

export interface HrvDeviationParams {
  baselineHrv: number;
  currentHrv: number;
}

export interface HrvDeviationResult {
  absoluteDifference: number | null;
  percentDeviation: number | null;
  ratio: number | null;
  direction: string;
  [key: string]: number | string | null;
}

export function calculateCaffeineHalfLife(params: CaffeineHalfLifeParams): CaffeineHalfLifeResult {
  const { doseMg, hoursElapsed, halfLifeHours } = params;

  if (
    !Number.isFinite(doseMg) ||
    !Number.isFinite(hoursElapsed) ||
    !Number.isFinite(halfLifeHours) ||
    doseMg < 0 ||
    hoursElapsed < 0 ||
    halfLifeHours <= 0
  ) {
    return {
      remainingMg: null,
      remainingPercent: null,
      eliminatedMg: null,
    };
  }

  if (doseMg === 0) {
    return {
      remainingMg: 0,
      remainingPercent: 0,
      eliminatedMg: 0,
    };
  }

  // remaining = dose * 0.5^(hours / halfLife)
  const remaining = doseMg * Math.pow(0.5, hoursElapsed / halfLifeHours);
  const eliminated = Math.max(0, doseMg - remaining);
  const remainingPercent = (remaining / doseMg) * 100;

  return {
    remainingMg: Math.round(remaining * 10) / 10,
    remainingPercent: Math.round(remainingPercent * 10) / 10,
    eliminatedMg: Math.round(eliminated * 10) / 10,
  };
}

export function calculateHrvDeviation(params: HrvDeviationParams): HrvDeviationResult {
  const { baselineHrv, currentHrv } = params;

  if (
    !Number.isFinite(baselineHrv) ||
    !Number.isFinite(currentHrv) ||
    baselineHrv <= 0 ||
    currentHrv < 0
  ) {
    return {
      absoluteDifference: null,
      percentDeviation: null,
      ratio: null,
      direction: 'Invalid measurement',
    };
  }

  const diff = currentHrv - baselineHrv;
  const percentDeviation = (diff / baselineHrv) * 100;
  const ratio = currentHrv / baselineHrv;

  let direction = 'Equal to baseline';
  if (diff > 0.05) {
    direction = 'Above baseline';
  } else if (diff < -0.05) {
    direction = 'Below baseline';
  }

  return {
    absoluteDifference: Math.round(diff * 10) / 10,
    percentDeviation: Math.round(percentDeviation * 10) / 10,
    ratio: Math.round(ratio * 100) / 100,
    direction,
  };
}
