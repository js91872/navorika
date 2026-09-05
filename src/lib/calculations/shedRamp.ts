export interface ShedRampInput {
  rise: number;
  run: number;
}

export interface ShedRampResult {
  angleDegrees: number;
  slopePercent: number | null;
  rampLength: number;
  riseRunRatio: string;
  [key: string]: number | string | null;
}

function safeNumber(value: number): number {
  return Number.isFinite(value) ? Math.max(0, value) : 0;
}

export function calculateShedRamp(input: ShedRampInput): ShedRampResult {
  const rise = safeNumber(input.rise);
  const run = safeNumber(input.run);

  const rampLength = Math.hypot(rise, run);

  if (run === 0) {
    if (rise === 0) {
      return {
        angleDegrees: 0,
        slopePercent: 0,
        rampLength: 0,
        riseRunRatio: 'Flat (0 : 1)',
      };
    }
    return {
      angleDegrees: 90,
      slopePercent: null,
      rampLength: Number(rampLength.toFixed(2)),
      riseRunRatio: 'Vertical (1 : 0)',
    };
  }

  if (rise === 0) {
    return {
      angleDegrees: 0,
      slopePercent: 0,
      rampLength: Number(rampLength.toFixed(2)),
      riseRunRatio: 'Flat (0 : 1)',
    };
  }

  const angleRad = Math.atan(rise / run);
  const angleDegrees = angleRad * (180 / Math.PI);
  const slopePercent = (rise / run) * 100;
  const ratioDenominator = run / rise;
  const riseRunRatio = `1 : ${ratioDenominator.toFixed(1)}`;

  return {
    angleDegrees: Number(angleDegrees.toFixed(2)),
    slopePercent: Number(slopePercent.toFixed(2)),
    rampLength: Number(rampLength.toFixed(2)),
    riseRunRatio,
  };
}
