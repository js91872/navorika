export interface GambrelRoofInput {
  spanFt: number;
  buildingLengthFt: number;
  overhangFt: number;
  trussSpacingFt: number;
  lowerAngleDeg: number;
  upperAngleDeg: number;
  lowerRunProportion: number;
  wastePercent: number;
}

export interface GambrelRoofResult {
  halfSpan: number;
  lowerRun: number;
  upperRun: number;
  lowerRise: number;
  upperRise: number;
  roofHeight: number;
  breakPointHeight: number;
  lowerRafter: number;
  upperRafter: number;
  sideRafterLength: number;
  totalRafterPerTruss: number;
  eaveExtensionPerSide: number;
  totalRafterPerTrussWithOverhang: number;
  roofLengthWithOverhang: number;
  roofArea: number;
  roofAreaWithWaste: number;
  roofingSquares: number;
  trussCount: number;
  totalRafterLength: number;
}

export const GAMBREL_DEFAULTS: GambrelRoofInput = {
  spanFt: 12,
  buildingLengthFt: 16,
  overhangFt: 0.5,
  trussSpacingFt: 2,
  lowerAngleDeg: 60,
  upperAngleDeg: 30,
  lowerRunProportion: 0.5,
  wastePercent: 10,
};

const assertFinite = (value: number, name: string) => {
  if (!Number.isFinite(value)) throw new RangeError(`${name} must be a finite number.`);
};

const assertRange = (value: number, name: string, minimum: number, maximum: number) => {
  assertFinite(value, name);
  if (value < minimum || value > maximum) {
    throw new RangeError(`${name} must be between ${minimum} and ${maximum}.`);
  }
};

export function calculateGambrelRoof(input: GambrelRoofInput): GambrelRoofResult {
  assertRange(input.spanFt, 'Span', 4, 80);
  assertRange(input.buildingLengthFt, 'Building length', 4, 300);
  assertRange(input.overhangFt, 'Overhang', 0, 6);
  assertRange(input.trussSpacingFt, 'Truss spacing', 0.5, 4);
  assertRange(input.lowerAngleDeg, 'Lower roof angle', 5, 85);
  assertRange(input.upperAngleDeg, 'Upper roof angle', 5, 85);
  assertRange(input.lowerRunProportion, 'Gambrel break position', 0.1, 0.9);
  assertRange(input.wastePercent, 'Waste factor', 0, 50);

  const halfSpan = input.spanFt / 2;
  const lowerRun = halfSpan * input.lowerRunProportion;
  const upperRun = halfSpan - lowerRun;
  const lowerRadians = input.lowerAngleDeg * Math.PI / 180;
  const upperRadians = input.upperAngleDeg * Math.PI / 180;
  const lowerRise = lowerRun * Math.tan(lowerRadians);
  const upperRise = upperRun * Math.tan(upperRadians);
  const roofHeight = lowerRise + upperRise;
  const lowerRafter = Math.hypot(lowerRun, lowerRise);
  const upperRafter = Math.hypot(upperRun, upperRise);
  const sideRafterLength = lowerRafter + upperRafter;
  const totalRafterPerTruss = 2 * sideRafterLength;

  // The overhang is a horizontal plan dimension. It extends the lower slope at
  // each eave and both ends of the building for the roof-area estimate.
  const eaveExtensionPerSide = input.overhangFt / Math.cos(lowerRadians);
  const totalRafterPerTrussWithOverhang = 2 * (sideRafterLength + eaveExtensionPerSide);
  const roofLengthWithOverhang = input.buildingLengthFt + 2 * input.overhangFt;
  const roofArea = totalRafterPerTrussWithOverhang * roofLengthWithOverhang;
  const roofAreaWithWaste = roofArea * (1 + input.wastePercent / 100);
  const roofingSquares = roofAreaWithWaste / 100;
  const trussCount = Math.ceil(input.buildingLengthFt / input.trussSpacingFt) + 1;
  const totalRafterLength = totalRafterPerTrussWithOverhang * trussCount;

  const result = {
    halfSpan,
    lowerRun,
    upperRun,
    lowerRise,
    upperRise,
    roofHeight,
    breakPointHeight: lowerRise,
    lowerRafter,
    upperRafter,
    sideRafterLength,
    totalRafterPerTruss,
    eaveExtensionPerSide,
    totalRafterPerTrussWithOverhang,
    roofLengthWithOverhang,
    roofArea,
    roofAreaWithWaste,
    roofingSquares,
    trussCount,
    totalRafterLength,
  };

  if (Object.values(result).some((value) => !Number.isFinite(value))) {
    throw new RangeError('These inputs do not produce finite gambrel roof geometry.');
  }
  return result;
}
