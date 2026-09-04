/**
 * Standardized Powerlifting Relative Strength Coefficients
 *
 * 1. WILKS FORMULA (1994 IPF Standard)
 *    Author: Robert Wilks (Powerlifting Australia / IPF)
 *    Formula: Total * (500 / (a + b*x + c*x^2 + d*x^3 + e*x^4 + f*x^5))
 *    where x is bodyweight in kilograms.
 *
 * 2. DOTS FORMULA (Dynamic Objective Team Scoring)
 *    Author: Tim Konertz
 *    Formula: Total * (500 / (A*x^4 + B*x^3 + C*x^2 + D*x + E))
 *    where x is bodyweight in kilograms.
 */

export interface WilksDotsParams {
  sex: 'male' | 'female' | string;
  bodyweightKg: number;
  totalKg: number;
}

export interface WilksDotsResult {
  dotsScore: number | null;
  wilksScore: number | null;
  totalBodyweightRatio: number | null;
  [key: string]: number | null;
}

// Published Wilks (1994) Polynomial Denominator Coefficients
export const WILKS_COEFFICIENTS = {
  male: {
    a: -216.0475144,
    b: 16.2606339,
    c: -0.002388645,
    d: -0.00113732,
    e: 7.01863e-6,
    f: -1.291e-8,
  },
  female: {
    a: 594.31747775582,
    b: -27.23842536447,
    c: 0.82112226871,
    d: -0.00930733913,
    e: 4.731582e-5,
    f: -9.054e-8,
  },
} as const;

// Published DOTS 4th-Degree Polynomial Denominator Coefficients
export const DOTS_COEFFICIENTS = {
  male: {
    a: -0.000001093,
    b: 0.0007391293,
    c: -0.1918759221,
    d: 24.0900756,
    e: -307.75076,
  },
  female: {
    a: -0.0000010706,
    b: 0.0005158568,
    c: -0.1126655495,
    d: 13.6175032,
    e: -57.96288,
  },
} as const;

export function getWilksCoefficient(bodyweightKg: number, sex: 'male' | 'female'): number | null {
  if (!Number.isFinite(bodyweightKg) || bodyweightKg <= 0) return null;
  const c = WILKS_COEFFICIENTS[sex];
  const x = bodyweightKg;
  const denom =
    c.a +
    c.b * x +
    c.c * Math.pow(x, 2) +
    c.d * Math.pow(x, 3) +
    c.e * Math.pow(x, 4) +
    c.f * Math.pow(x, 5);

  if (denom <= 0 || !Number.isFinite(denom)) return null;
  return 500 / denom;
}

export function getDotsCoefficient(bodyweightKg: number, sex: 'male' | 'female'): number | null {
  if (!Number.isFinite(bodyweightKg) || bodyweightKg <= 0) return null;
  const c = DOTS_COEFFICIENTS[sex];
  const x = bodyweightKg;
  const denom =
    c.a * Math.pow(x, 4) +
    c.b * Math.pow(x, 3) +
    c.c * Math.pow(x, 2) +
    c.d * x +
    c.e;

  if (denom <= 0 || !Number.isFinite(denom)) return null;
  return 500 / denom;
}

export function calculateWilksDots(params: WilksDotsParams): WilksDotsResult {
  const { sex: rawSex, bodyweightKg, totalKg } = params;

  if (
    !Number.isFinite(bodyweightKg) ||
    !Number.isFinite(totalKg) ||
    bodyweightKg <= 0 ||
    totalKg < 0
  ) {
    return {
      dotsScore: null,
      wilksScore: null,
      totalBodyweightRatio: null,
    };
  }

  const sex: 'male' | 'female' = String(rawSex).toLowerCase().trim() === 'female' ? 'female' : 'male';

  const wilksCoeff = getWilksCoefficient(bodyweightKg, sex);
  const dotsCoeff = getDotsCoefficient(bodyweightKg, sex);

  if (wilksCoeff === null || dotsCoeff === null) {
    return {
      dotsScore: null,
      wilksScore: null,
      totalBodyweightRatio: null,
    };
  }

  const wilksScore = Math.round(totalKg * wilksCoeff * 100) / 100;
  const dotsScore = Math.round(totalKg * dotsCoeff * 100) / 100;
  const totalBodyweightRatio = Math.round((totalKg / bodyweightKg) * 100) / 100;

  return {
    dotsScore,
    wilksScore,
    totalBodyweightRatio,
  };
}
