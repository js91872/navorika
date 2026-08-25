export interface AirCompressorInput {
  compressorScfm: number;
  compressorRatedPsi: number;
  tankGallons: number;
  toolCfm: number;
  toolPsi: number;
  usagePercent: number;
}

export interface AirCompressorResult {
  averageToolCfm: number;
  demandRatio: number;
  continuousSurplusCfm: number;
  canKeepUp: boolean;
  status: 'comfortable' | 'borderline' | 'insufficient';
  approximateRuntimeMinutes: number | null;
  recommendedScfm: number;
}

const ATMOSPHERIC_PSI = 14.7;

function safeNumber(value: number): number {
  return Number.isFinite(value) ? Math.max(0, value) : 0;
}

export function calculateAirCompressor(
  input: AirCompressorInput,
): AirCompressorResult {
  const compressorScfm = safeNumber(input.compressorScfm);
  const compressorRatedPsi = safeNumber(input.compressorRatedPsi);
  const tankGallons = safeNumber(input.tankGallons);
  const toolCfm = safeNumber(input.toolCfm);
  const toolPsi = safeNumber(input.toolPsi);
  const usageFraction = Math.min(1, safeNumber(input.usagePercent) / 100);

  const averageToolCfm = toolCfm * usageFraction;
  const continuousSurplusCfm = compressorScfm - averageToolCfm;

  const demandRatio =
    compressorScfm > 0 ? averageToolCfm / compressorScfm : Infinity;

  let status: AirCompressorResult['status'];

  if (demandRatio <= 0.8) {
    status = 'comfortable';
  } else if (demandRatio <= 1) {
    status = 'borderline';
  } else {
    status = 'insufficient';
  }

  /*
   * Approximate usable tank air.
   *
   * A receiver stores compressed air, but real runtime depends on pressure
   * switch settings, regulator behavior, pump recovery, temperature,
   * pressure drop and tool cycling. We therefore expose this only as an
   * approximate planning value.
   *
   * We estimate usable free-air volume between the compressor's nominal
   * rated pressure and the required tool pressure.
   */
  const tankCubicFeet = tankGallons / 7.48052;

  const pressureDifferencePsi = Math.max(
    0,
    compressorRatedPsi - toolPsi,
  );

  const usableFreeAirCubicFeet =
    tankCubicFeet * (pressureDifferencePsi / ATMOSPHERIC_PSI);

  const deficitCfm = Math.max(0, averageToolCfm - compressorScfm);

  const approximateRuntimeMinutes =
    deficitCfm > 0 && usableFreeAirCubicFeet > 0
      ? usableFreeAirCubicFeet / deficitCfm
      : null;

  /*
   * 20% headroom is a practical planning margin, not a universal compressor
   * sizing requirement.
   */
  const recommendedScfm = averageToolCfm * 1.2;

  return {
    averageToolCfm,
    demandRatio,
    continuousSurplusCfm,
    canKeepUp: averageToolCfm <= compressorScfm,
    status,
    approximateRuntimeMinutes,
    recommendedScfm,
  };
}
