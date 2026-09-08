/**
 * Pure calculation functions for Masonry & Water Takeoffs (Batch 08 Wave A).
 * - Mortar Calculator
 * - Concrete Block Calculator
 * - Rainwater Harvesting Calculator
 */

export interface MortarInput {
  unitCount: number;
  masonryType: 'brick' | 'block' | string;
  jointThicknessInches?: number;
  wastePercent?: number;
  bagWeightLb?: number;
}

export interface MortarResult {
  baseVolumeFt3: number;
  adjustedVolumeFt3: number;
  cubicYards: number;
  cubicMeters: number;
  premixBags: number;
  cementBags94lb: number;
  sandTons: number;
}

export function calculateMortar(input: MortarInput): MortarResult {
  const units = Number.isFinite(input.unitCount) ? Math.max(0, input.unitCount) : 0;
  const joint = Number.isFinite(input.jointThicknessInches) && (input.jointThicknessInches ?? 0) > 0
    ? (input.jointThicknessInches ?? 0.375)
    : 0.375;
  const waste = Number.isFinite(input.wastePercent) ? Math.max(0, input.wastePercent ?? 0) : 0;
  const bagWeight = Number.isFinite(input.bagWeightLb) && (input.bagWeightLb ?? 0) > 0
    ? (input.bagWeightLb ?? 80)
    : 80;

  // Standard reference yield at 3/8" (0.375") joint:
  // - Brick: 5.0 ft³ per 1,000 modular bricks
  // - Block: 13.5 ft³ per 100 8x8x16 CMU blocks
  const isBlock = String(input.masonryType).toLowerCase().includes('block');
  const baseYieldPerUnit = isBlock ? (13.5 / 100) : (5.0 / 1000);
  const thicknessFactor = joint / 0.375;

  const baseVolumeFt3 = units * baseYieldPerUnit * thicknessFactor;
  const adjustedVolumeFt3 = baseVolumeFt3 * (1 + waste / 100);
  const cubicYards = adjustedVolumeFt3 / 27;
  const cubicMeters = adjustedVolumeFt3 * 0.0283168466;

  // Bag yield: 80 lb yields ~0.67 ft³, 60 lb yields ~0.50 ft³, 94 lb yields ~0.78 ft³
  const ft3PerBag = (bagWeight / 80) * 0.67;
  const premixBags = adjustedVolumeFt3 > 0 ? Math.ceil(adjustedVolumeFt3 / ft3PerBag) : 0;

  // Site-mix Type N: 1 bag (94 lb) cement yields approx 3.2 ft³ mixed mortar
  const cementBags94lb = adjustedVolumeFt3 > 0 ? Math.ceil(adjustedVolumeFt3 / 3.2) : 0;
  // Sand required: 3 ft³ of sand per cement bag, density ~80 lb/ft³ loose damp -> 240 lb / bag
  const sandTons = Number(((cementBags94lb * 240) / 2000).toFixed(2));

  return {
    baseVolumeFt3: Number(baseVolumeFt3.toFixed(2)),
    adjustedVolumeFt3: Number(adjustedVolumeFt3.toFixed(2)),
    cubicYards: Number(cubicYards.toFixed(3)),
    cubicMeters: Number(cubicMeters.toFixed(3)),
    premixBags,
    cementBags94lb,
    sandTons,
  };
}

export interface ConcreteBlockInput {
  wallLengthFt: number;
  wallHeightFt: number;
  openingsAreaFt2?: number;
  blockType?: string;
  coreFillOption?: string;
  wastePercent?: number;
}

export interface ConcreteBlockResult {
  netWallAreaFt2: number;
  exactBlocks: number;
  purchaseBlocks: number;
  mortarBags80lb: number;
  coreFillGroutYards: number;
}

export function calculateConcreteBlock(input: ConcreteBlockInput): ConcreteBlockResult {
  const length = Number.isFinite(input.wallLengthFt) ? Math.max(0, input.wallLengthFt) : 0;
  const height = Number.isFinite(input.wallHeightFt) ? Math.max(0, input.wallHeightFt) : 0;
  const openings = Number.isFinite(input.openingsAreaFt2) ? Math.max(0, input.openingsAreaFt2 ?? 0) : 0;
  const waste = Number.isFinite(input.wastePercent) ? Math.max(0, input.wastePercent ?? 0) : 0;

  const grossArea = length * height;
  const netWallAreaFt2 = Number(Math.max(0, grossArea - openings).toFixed(2));

  // Nominal 8x8x16 CMU block face is 16" × 8" = 1.125 blocks per square foot
  const exactBlocks = Number((netWallAreaFt2 * 1.125).toFixed(1));
  const purchaseBlocks = exactBlocks > 0 ? Math.ceil(exactBlocks * (1 + waste / 100)) : 0;

  // Mortar: approx 13.5 ft³ per 100 blocks, 80lb bag yields 0.67 ft³
  const mortarFt3 = purchaseBlocks * 0.135;
  const mortarBags80lb = mortarFt3 > 0 ? Math.ceil(mortarFt3 / 0.67) : 0;

  // Core fill grout: standard 8" CMU block has 2 cores, ~0.33 ft³ per core
  // Frequency multiplier:
  const fill = String(input.coreFillOption ?? 'cores-32in').toLowerCase();
  let coresPerBlock = 0.5; // default: 32 inches o.c. (1 core every 2 blocks)
  if (fill.includes('solid') || fill.includes('100')) {
    coresPerBlock = 2.0;
  } else if (fill.includes('16')) {
    coresPerBlock = 1.0;
  } else if (fill.includes('none') || fill.includes('hollow')) {
    coresPerBlock = 0;
  }

  const groutFt3 = purchaseBlocks * coresPerBlock * 0.33;
  const coreFillGroutYards = Number((groutFt3 / 27).toFixed(2));

  return {
    netWallAreaFt2,
    exactBlocks,
    purchaseBlocks,
    mortarBags80lb,
    coreFillGroutYards,
  };
}

export interface RainwaterHarvestingInput {
  catchmentAreaFt2: number;
  annualRainfallInches: number;
  roofMaterial?: string;
  filtrationLossPercent?: number;
  storageDays?: number;
}

export interface RainwaterHarvestingResult {
  annualYieldGallons: number;
  annualYieldLiters: number;
  monthlyAverageGallons: number;
  recommendedTankGallons: number;
  recommendedTankLiters: number;
}

export function calculateRainwaterHarvesting(input: RainwaterHarvestingInput): RainwaterHarvestingResult {
  const area = Number.isFinite(input.catchmentAreaFt2) ? Math.max(0, input.catchmentAreaFt2) : 0;
  const rain = Number.isFinite(input.annualRainfallInches) ? Math.max(0, input.annualRainfallInches) : 0;
  const filterLoss = Number.isFinite(input.filtrationLossPercent)
    ? Math.min(100, Math.max(0, input.filtrationLossPercent ?? 5))
    : 5;
  const days = Number.isFinite(input.storageDays) && (input.storageDays ?? 0) > 0
    ? (input.storageDays ?? 21)
    : 21;

  // Runoff coefficients based on roof catchment material
  const mat = String(input.roofMaterial ?? 'metal').toLowerCase();
  let coeff = 0.95; // metal
  if (mat.includes('tile') || mat.includes('clay') || mat.includes('concrete')) {
    coeff = 0.85;
  } else if (mat.includes('shingle') || mat.includes('asphalt')) {
    coeff = 0.80;
  } else if (mat.includes('membrane') || mat.includes('flat') || mat.includes('epdm')) {
    coeff = 0.85;
  }

  // 1 inch of rain on 1 ft² = 0.6233 US gallons
  const rawGallons = area * rain * 0.6233 * coeff * (1 - filterLoss / 100);
  const annualYieldGallons = Math.round(Math.max(0, rawGallons));
  const annualYieldLiters = Math.round(annualYieldGallons * 3.78541);
  const monthlyAverageGallons = Math.round(annualYieldGallons / 12);

  // Storage tank recommendation: buffer for dry-period days
  const dailyAverageGallons = annualYieldGallons / 365;
  const recommendedTankGallons = Math.ceil(dailyAverageGallons * days);
  const recommendedTankLiters = Math.ceil(recommendedTankGallons * 3.78541);

  return {
    annualYieldGallons,
    annualYieldLiters,
    monthlyAverageGallons,
    recommendedTankGallons,
    recommendedTankLiters,
  };
}
