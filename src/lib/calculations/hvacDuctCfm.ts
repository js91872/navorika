export type DuctShape = 'round' | 'rectangular';

export interface HvacDuctCfmInput {
  ductShape: DuctShape | string;
  diameter?: number;
  width?: number;
  height?: number;
  velocity: number;
}

export interface HvacDuctCfmResult {
  ductArea: number;
  cfm: number;
  [key: string]: number;
}

function safeNumber(value: number | undefined): number {
  return typeof value === 'number' && Number.isFinite(value) ? Math.max(0, value) : 0;
}

export function calculateHvacDuctCfm(input: HvacDuctCfmInput): HvacDuctCfmResult {
  const isRectangular = input.ductShape === 'rectangular';
  const velocityFpm = safeNumber(input.velocity);

  let areaSqFt = 0;

  if (isRectangular) {
    const widthIn = safeNumber(input.width);
    const heightIn = safeNumber(input.height);
    if (widthIn > 0 && heightIn > 0) {
      areaSqFt = (widthIn * heightIn) / 144;
    }
  } else {
    // Round duct
    const diameterIn = safeNumber(input.diameter);
    if (diameterIn > 0) {
      const radiusIn = diameterIn / 2;
      const areaSqIn = Math.PI * radiusIn * radiusIn;
      areaSqFt = areaSqIn / 144;
    }
  }

  const cfm = areaSqFt * velocityFpm;

  return {
    ductArea: Number(areaSqFt.toFixed(4)),
    cfm: Number(cfm.toFixed(2)),
  };
}
