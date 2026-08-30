export type LinearUnit = 'm' | 'ft';
export type RebarDirection = 'both' | 'lengthwise' | 'widthwise';

const FEET_TO_METERS = 0.3048;

function positive(value: number, name: string): number {
  if (!Number.isFinite(value) || value <= 0) {
    throw new RangeError(`${name} must be greater than zero.`);
  }
  return value;
}

function nonNegative(value: number, name: string): number {
  if (!Number.isFinite(value) || value < 0) {
    throw new RangeError(`${name} cannot be negative.`);
  }
  return value;
}

function metres(value: number, unit: LinearUnit, name: string): number {
  const checked = positive(value, name);
  return unit === 'ft' ? checked * FEET_TO_METERS : checked;
}

export interface BrickQuantityInput {
  wallLength: number;
  wallThickness: number;
  wallHeight: number;
  unit: LinearUnit;
  brickLengthM: number;
  brickWidthM: number;
  brickHeightM: number;
  mortarJointMm: number;
  wastePercent: number;
}

export function calculateBrickQuantity(input: BrickQuantityInput) {
  const lengthM = metres(input.wallLength, input.unit, 'Wall length');
  const thicknessM = metres(input.wallThickness, input.unit, 'Wall thickness');
  const heightM = metres(input.wallHeight, input.unit, 'Wall height');
  const mortarM = nonNegative(input.mortarJointMm, 'Mortar joint') / 1000;
  const wastePercent = nonNegative(input.wastePercent, 'Waste');
  const nominalBrickVolume =
    (positive(input.brickLengthM, 'Brick length') + mortarM) *
    (positive(input.brickWidthM, 'Brick width') + mortarM) *
    (positive(input.brickHeightM, 'Brick height') + mortarM);
  const wallVolumeM3 = lengthM * thicknessM * heightM;
  const baseBricks = wallVolumeM3 / nominalBrickVolume;

  return {
    wallAreaM2: lengthM * heightM,
    wallVolumeM3,
    nominalBrickVolumeM3: nominalBrickVolume,
    nominalBricksPerM3: 1 / nominalBrickVolume,
    baseBricks: Math.ceil(baseBricks),
    totalBricks: Math.ceil(baseBricks * (1 + wastePercent / 100)),
  };
}

export interface RebarGridInput {
  slabLengthM: number;
  slabWidthM: number;
  barDiameterMm: number;
  maximumSpacingMm: number;
  clearCoverMm: number;
  direction: RebarDirection;
}

export function calculateRebarGrid(input: RebarGridInput) {
  const lengthM = positive(input.slabLengthM, 'Slab length');
  const widthM = positive(input.slabWidthM, 'Slab width');
  const diameterMm = positive(input.barDiameterMm, 'Bar diameter');
  const spacingM = positive(input.maximumSpacingMm, 'Maximum spacing') / 1000;
  const coverM = nonNegative(input.clearCoverMm, 'Clear cover') / 1000;
  const clearLengthM = lengthM - 2 * coverM;
  const clearWidthM = widthM - 2 * coverM;

  if (clearLengthM <= 0 || clearWidthM <= 0) {
    throw new RangeError('Clear cover must leave a positive grid length and width.');
  }

  const barsLengthwise =
    input.direction === 'both' || input.direction === 'lengthwise'
      ? Math.ceil(clearWidthM / spacingM) + 1
      : 0;
  const barsWidthwise =
    input.direction === 'both' || input.direction === 'widthwise'
      ? Math.ceil(clearLengthM / spacingM) + 1
      : 0;
  const totalLengthM =
    barsLengthwise * clearLengthM + barsWidthwise * clearWidthM;
  const theoreticalWeightKgPerM = diameterMm ** 2 / 162;

  return {
    clearLengthM,
    clearWidthM,
    barsLengthwise,
    barsWidthwise,
    totalBars: barsLengthwise + barsWidthwise,
    totalLengthM,
    theoreticalWeightKgPerM,
    totalWeightKg: totalLengthM * theoreticalWeightKgPerM,
  };
}

export interface BulkMaterialInput {
  length: number;
  width: number;
  depth: number;
  unit: LinearUnit;
  densityKgM3: number;
  wastePercent: number;
  truckPayloadKg: number;
}

export function calculateBulkMaterial(input: BulkMaterialInput) {
  const lengthM = metres(input.length, input.unit, 'Length');
  const widthM = metres(input.width, input.unit, 'Width');
  const depthM = metres(input.depth, input.unit, 'Depth');
  const densityKgM3 = positive(input.densityKgM3, 'Material density');
  const wastePercent = nonNegative(input.wastePercent, 'Waste');
  const truckPayloadKg = positive(input.truckPayloadKg, 'Truck payload');
  const measuredVolumeM3 = lengthM * widthM * depthM;
  const orderVolumeM3 = measuredVolumeM3 * (1 + wastePercent / 100);
  const weightKg = orderVolumeM3 * densityKgM3;

  return {
    areaM2: lengthM * widthM,
    measuredVolumeM3,
    orderVolumeM3,
    weightKg,
    tonnes: weightKg / 1000,
    truckLoads: Math.ceil(weightKg / truckPayloadKg),
  };
}

export interface ExcavationInput {
  length: number;
  width: number;
  depth: number;
  unit: LinearUnit;
  swellPercent: number;
  looseDensityKgM3: number;
  truckPayloadKg: number;
}

export function calculateExcavation(input: ExcavationInput) {
  const lengthM = metres(input.length, input.unit, 'Length');
  const widthM = metres(input.width, input.unit, 'Width');
  const depthM = metres(input.depth, input.unit, 'Depth');
  const swellPercent = nonNegative(input.swellPercent, 'Swell allowance');
  const looseDensityKgM3 = positive(input.looseDensityKgM3, 'Loose density');
  const truckPayloadKg = positive(input.truckPayloadKg, 'Truck payload');
  const bankVolumeM3 = lengthM * widthM * depthM;
  const looseVolumeM3 = bankVolumeM3 * (1 + swellPercent / 100);
  const looseWeightKg = looseVolumeM3 * looseDensityKgM3;

  return {
    bankVolumeM3,
    looseVolumeM3,
    looseWeightKg,
    truckLoads: Math.ceil(looseWeightKg / truckPayloadKg),
  };
}
