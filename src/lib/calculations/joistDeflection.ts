export interface JoistDeflectionInput {
  span: number;
  uniformLoad: number;
  spacing: number;
  elasticModulus: number;
  width: number;
  depth: number;
}

export interface JoistDeflectionResult {
  lineLoad: number;
  momentOfInertia: number;
  deflection: number;
  l360Limit: number;
  ratio: string;
  [key: string]: number | string;
}

function safeNumber(value: number): number {
  return Number.isFinite(value) ? Math.max(0, value) : 0;
}

export function calculateJoistDeflection(input: JoistDeflectionInput): JoistDeflectionResult {
  const spanFt = safeNumber(input.span);
  const uniformLoadPsf = safeNumber(input.uniformLoad);
  const spacingIn = safeNumber(input.spacing);
  const elasticModulusPsi = safeNumber(input.elasticModulus);
  const widthIn = safeNumber(input.width);
  const depthIn = safeNumber(input.depth);

  // Tributary line load in lb/ft
  const lineLoad = uniformLoadPsf * (spacingIn / 12);

  // Line load in lb/in
  const lineLoadPli = lineLoad / 12;

  // Moment of inertia I = b * d^3 / 12 (in^4)
  const momentOfInertia = (widthIn * Math.pow(depthIn, 3)) / 12;

  // Span in inches
  const spanIn = spanFt * 12;

  // Code deflection limit: L/360
  const l360Limit = spanIn / 360;

  let deflection = 0;
  let ratio = 'Not applicable';

  if (
    spanIn > 0 &&
    lineLoadPli > 0 &&
    elasticModulusPsi > 0 &&
    momentOfInertia > 0
  ) {
    // Delta = (5 * w * L^4) / (384 * E * I)
    const delta =
      (5 * lineLoadPli * Math.pow(spanIn, 4)) /
      (384 * elasticModulusPsi * momentOfInertia);

    if (Number.isFinite(delta) && delta > 0) {
      deflection = delta;
      const ratioValue = Math.round(spanIn / delta);
      ratio = `L / ${ratioValue}`;
    }
  }

  return {
    lineLoad: Number(lineLoad.toFixed(4)),
    momentOfInertia: Number(momentOfInertia.toFixed(4)),
    deflection: Number(deflection.toFixed(4)),
    l360Limit: Number(l360Limit.toFixed(4)),
    ratio,
  };
}
