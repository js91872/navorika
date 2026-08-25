export const PULSE_INTERVALS = [15, 30, 60] as const;

export type PulseInterval = (typeof PULSE_INTERVALS)[number];

export interface HeartRateRange {
  min: number;
  max: number;
}

export interface HeartRateEstimate {
  estimatedMaximum: number;
  heartRateReserve: number;
  moderateRange: HeartRateRange;
  vigorousRange: HeartRateRange;
}

export function calculatePulseBpm(beatsCounted: number, intervalSeconds: PulseInterval): number {
  if (!Number.isFinite(beatsCounted) || beatsCounted < 0) return 0;
  return Math.round(beatsCounted * (60 / intervalSeconds));
}

export function calculateHeartRateEstimate(age: number, restingHeartRate: number): HeartRateEstimate {
  const estimatedMaximum = 220 - age;

  return {
    estimatedMaximum,
    heartRateReserve: estimatedMaximum - restingHeartRate,
    moderateRange: {
      min: Math.round(estimatedMaximum * 0.5),
      max: Math.round(estimatedMaximum * 0.7),
    },
    vigorousRange: {
      min: Math.round(estimatedMaximum * 0.7),
      max: Math.round(estimatedMaximum * 0.85),
    },
  };
}
