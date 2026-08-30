export type CubicUnit = 'm3' | 'yd3' | 'ft3';
export type LinearUnit = 'm' | 'ft';
export type TileUnit = 'cm' | 'in';
export type SteelShape = 'round' | 'square' | 'rectangular' | 'i-section';

const M3_PER_YD3 = 0.764554857984;
const M3_PER_FT3 = 0.028316846592;
const M_PER_FT = 0.3048;

function finite(value: number, name: string) {
  if (!Number.isFinite(value)) throw new RangeError(`${name} must be a finite number.`);
  return value;
}

function positive(value: number, name: string) {
  finite(value, name);
  if (value <= 0) throw new RangeError(`${name} must be greater than zero.`);
  return value;
}

function nonNegative(value: number, name: string) {
  finite(value, name);
  if (value < 0) throw new RangeError(`${name} cannot be negative.`);
  return value;
}

export function ceilPurchase(value: number) {
  finite(value, 'Purchase quantity');
  return Math.ceil(value - Number.EPSILON * Math.max(1, Math.abs(value)) * 16);
}

export function applyAllowance(value: number, percent: number) {
  nonNegative(value, 'Base quantity');
  nonNegative(percent, 'Allowance');
  return value * (1 + percent / 100);
}

export function calculateCementTakeoff(input: {
  wetVolume: number;
  unit: CubicUnit;
  ratio: readonly [number, number, number];
  bagKg: number;
  dryVolumeFactor?: number;
  cementDensityKgM3?: number;
}) {
  positive(input.wetVolume, 'Wet concrete volume');
  input.ratio.forEach((part, index) => positive(part, ['Cement ratio', 'Sand ratio', 'Aggregate ratio'][index]));
  positive(input.bagKg, 'Bag mass');
  const dryVolumeFactor = positive(input.dryVolumeFactor ?? 1.54, 'Dry-volume factor');
  const cementDensityKgM3 = positive(input.cementDensityKgM3 ?? 1440, 'Cement bulk density');
  const factor = input.unit === 'yd3' ? M3_PER_YD3 : input.unit === 'ft3' ? M3_PER_FT3 : 1;
  const wetVolumeM3 = input.wetVolume * factor;
  const dryVolumeM3 = wetVolumeM3 * dryVolumeFactor;
  const totalParts = input.ratio.reduce((sum, part) => sum + part, 0);
  const cementVolumeM3 = dryVolumeM3 * input.ratio[0] / totalParts;
  const cementKg = cementVolumeM3 * cementDensityKgM3;
  const exactBags = cementKg / input.bagKg;
  return {
    wetVolumeM3,
    dryVolumeM3,
    cementVolumeM3,
    cementKg,
    exactBags,
    bagsToBuy: ceilPurchase(exactBags),
    sandVolumeM3: dryVolumeM3 * input.ratio[1] / totalParts,
    aggregateVolumeM3: dryVolumeM3 * input.ratio[2] / totalParts,
  };
}

export function calculateSandTakeoff(input: {
  length: number; width: number; depth: number; unit: LinearUnit;
  densityKgM3: number; wastePercent?: number; bagKg?: number; payloadKg?: number;
}) {
  [input.length, input.width, input.depth].forEach((value, index) => positive(value, ['Length', 'Width', 'Depth'][index]));
  positive(input.densityKgM3, 'Bulk density');
  const bagKg = positive(input.bagKg ?? 25, 'Bag mass');
  const payloadKg = positive(input.payloadKg ?? 15000, 'Truck payload');
  const wastePercent = nonNegative(input.wastePercent ?? 0, 'Waste allowance');
  const factor = input.unit === 'ft' ? M_PER_FT : 1;
  const baseVolumeM3 = input.length * factor * input.width * factor * input.depth * factor;
  const adjustedVolumeM3 = applyAllowance(baseVolumeM3, wastePercent);
  const baseWeightKg = baseVolumeM3 * input.densityKgM3;
  const adjustedWeightKg = adjustedVolumeM3 * input.densityKgM3;
  return {
    baseVolumeM3, adjustedVolumeM3, baseWeightKg, adjustedWeightKg,
    exactBags: adjustedWeightKg / bagKg,
    bagsToBuy: ceilPurchase(adjustedWeightKg / bagKg),
    exactLoads: adjustedWeightKg / payloadKg,
    loadsToPlan: ceilPurchase(adjustedWeightKg / payloadKg),
  };
}

export function calculatePaintTakeoff(input: {
  length: number; width: number; height: number; unit: LinearUnit;
  openingsArea?: number; includeCeiling: boolean; coats: number; coverageM2L: number;
  wastePercent?: number; canLitres?: number;
}) {
  [input.length, input.width, input.height].forEach((value, index) => positive(value, ['Room length', 'Room width', 'Room height'][index]));
  positive(input.coats, 'Coats');
  positive(input.coverageM2L, 'Coverage');
  const canLitres = positive(input.canLitres ?? 5, 'Can size');
  const openingsArea = nonNegative(input.openingsArea ?? 0, 'Openings area');
  const wastePercent = nonNegative(input.wastePercent ?? 0, 'Waste allowance');
  const factor = input.unit === 'ft' ? M_PER_FT : 1;
  const lengthM = input.length * factor, widthM = input.width * factor, heightM = input.height * factor;
  const grossWallAreaM2 = 2 * (lengthM + widthM) * heightM;
  const openingsM2 = openingsArea * factor * factor;
  if (openingsM2 > grossWallAreaM2) throw new RangeError('Openings area cannot exceed gross wall area.');
  const ceilingAreaM2 = input.includeCeiling ? lengthM * widthM : 0;
  const netOneCoatAreaM2 = grossWallAreaM2 - openingsM2 + ceilingAreaM2;
  const coatedAreaM2 = netOneCoatAreaM2 * input.coats;
  const baseLitres = coatedAreaM2 / input.coverageM2L;
  const adjustedLitres = applyAllowance(baseLitres, wastePercent);
  return { grossWallAreaM2, openingsM2, ceilingAreaM2, netOneCoatAreaM2, coatedAreaM2, baseLitres, adjustedLitres, exactCans: adjustedLitres / canLitres, cansToBuy: ceilPurchase(adjustedLitres / canLitres) };
}

export function calculateTileTakeoff(input: {
  length: number; width: number; projectUnit: LinearUnit;
  tileLength: number; tileWidth: number; tileUnit: TileUnit;
  gapMm: number; wastePercent?: number; tilesPerBox?: number;
}) {
  [input.length, input.width, input.tileLength, input.tileWidth].forEach((value, index) => positive(value, ['Project length', 'Project width', 'Tile length', 'Tile width'][index]));
  const gapM = nonNegative(input.gapMm, 'Joint gap') / 1000;
  const wastePercent = nonNegative(input.wastePercent ?? 0, 'Waste allowance');
  const projectFactor = input.projectUnit === 'ft' ? M_PER_FT : 1;
  const tileFactor = input.tileUnit === 'in' ? 0.0254 : 0.01;
  const lengthM = input.length * projectFactor, widthM = input.width * projectFactor;
  const tileLengthM = input.tileLength * tileFactor, tileWidthM = input.tileWidth * tileFactor;
  const tilesAlongLength = ceilPurchase((lengthM + gapM) / (tileLengthM + gapM));
  const tilesAlongWidth = ceilPurchase((widthM + gapM) / (tileWidthM + gapM));
  const fittedGridTiles = tilesAlongLength * tilesAlongWidth;
  const adjustedTiles = applyAllowance(fittedGridTiles, wastePercent);
  const tilesToBuy = ceilPurchase(adjustedTiles);
  let boxes: number | null = null;
  if (input.tilesPerBox !== undefined) boxes = ceilPurchase(tilesToBuy / positive(input.tilesPerBox, 'Tiles per box'));
  return { projectAreaM2: lengthM * widthM, tileAreaM2: tileLengthM * tileWidthM, tilesAlongLength, tilesAlongWidth, fittedGridTiles, adjustedTiles, tilesToBuy, wasteTiles: tilesToBuy - fittedGridTiles, boxes };
}

export function calculateSteelWeight(input: {
  shape: SteelShape; diameterMm?: number; widthMm?: number; heightMm?: number;
  thicknessMm?: number; lengthM: number; quantity: number; densityKgM3?: number;
}) {
  positive(input.lengthM, 'Length');
  positive(input.quantity, 'Quantity');
  const densityKgM3 = positive(input.densityKgM3 ?? 7850, 'Steel density');
  let areaM2: number;
  if (input.shape === 'round') {
    const radius = positive(input.diameterMm ?? 0, 'Diameter') / 2000;
    areaM2 = Math.PI * radius ** 2;
  } else if (input.shape === 'square') {
    areaM2 = (positive(input.widthMm ?? 0, 'Side width') / 1000) ** 2;
  } else if (input.shape === 'rectangular') {
    areaM2 = positive(input.widthMm ?? 0, 'Width') / 1000 * positive(input.heightMm ?? 0, 'Height') / 1000;
  } else {
    const flangeWidthM = positive(input.widthMm ?? 0, 'Flange width') / 1000;
    const clearWebHeightM = positive(input.heightMm ?? 0, 'Clear web height') / 1000;
    const uniformThicknessM = positive(input.thicknessMm ?? 0, 'Uniform thickness') / 1000;
    areaM2 = 2 * flangeWidthM * uniformThicknessM + clearWebHeightM * uniformThicknessM;
  }
  const kgPerM = areaM2 * densityKgM3;
  return { areaM2, kgPerM, totalLengthM: input.lengthM * input.quantity, totalKg: kgPerM * input.lengthM * input.quantity };
}
