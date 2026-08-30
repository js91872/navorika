export type LinearUnit = 'm' | 'ft';
const FT_TO_M = 0.3048;
const SQM_TO_SQFT = 10.763910416709722;
const positive = (value: number, name: string) => { if (!Number.isFinite(value) || value <= 0) throw new RangeError(`${name} must be greater than zero.`); return value; };
const nonNegative = (value: number, name: string) => { if (!Number.isFinite(value) || value < 0) throw new RangeError(`${name} cannot be negative.`); return value; };
const metres = (value: number, unit: LinearUnit) => positive(value, 'Dimension') * (unit === 'ft' ? FT_TO_M : 1);

export function calculateHouseConstructionCost(input: { area: number; areaUnit: 'sqft' | 'sqm'; floors: number; ratePerSqft: number; siteAndSoftCosts: number; contingencyPercent: number; landCost: number }) {
  const totalArea = positive(input.area, 'Area') * (input.areaUnit === 'sqm' ? SQM_TO_SQFT : 1) * positive(input.floors, 'Floors');
  const directConstructionCost = totalArea * nonNegative(input.ratePerSqft, 'Construction rate');
  const contingency = directConstructionCost * nonNegative(input.contingencyPercent, 'Contingency') / 100;
  const siteAndSoftCosts = nonNegative(input.siteAndSoftCosts, 'Site and soft costs');
  const landCost = nonNegative(input.landCost, 'Land cost');
  const projectCostExcludingLand = directConstructionCost + contingency + siteAndSoftCosts;
  return { totalArea, directConstructionCost, contingency, siteAndSoftCosts, projectCostExcludingLand, landCost, totalCost: projectCostExcludingLand + landCost, constructionCostPerSqft: projectCostExcludingLand / totalArea };
}
export function calculateTankCapacity(input: { shape: 'rectangular' | 'cylindrical' | 'spherical'; unit: LinearUnit; length: number; width: number; height: number; diameter: number; radius: number }) {
  let volumeM3: number;
  if (input.shape === 'rectangular') volumeM3 = metres(input.length, input.unit) * metres(input.width, input.unit) * metres(input.height, input.unit);
  else if (input.shape === 'cylindrical') volumeM3 = Math.PI * (metres(input.diameter, input.unit) / 2) ** 2 * metres(input.height, input.unit);
  else volumeM3 = 4 / 3 * Math.PI * metres(input.radius, input.unit) ** 3;
  return { volumeM3, volumeLiters: volumeM3 * 1000, volumeGallons: volumeM3 * 264.172052358 };
}
export function calculateAsphalt(input: { length: number; width: number; unit: LinearUnit; thickness: number; thicknessUnit: 'mm' | 'inch'; densityKgM3: number; wastePercent: number; truckCapacityTonnes?: number }) {
  const areaM2 = metres(input.length, input.unit) * metres(input.width, input.unit);
  const thicknessMm = positive(input.thickness, 'Thickness') * (input.thicknessUnit === 'inch' ? 25.4 : 1);
  const volumeM3 = areaM2 * thicknessMm / 1000; const weightKg = volumeM3 * positive(input.densityKgM3, 'Density');
  const tonnes = weightKg / 1000 * (1 + nonNegative(input.wastePercent, 'Waste') / 100);
  return { areaM2, thicknessMm, volumeM3, weightKg, tonnes, truckLoads: Math.ceil(tonnes / positive(input.truckCapacityTonnes ?? 20, 'Truck capacity')) };
}
export function calculateRoofArea(input: { length: number; width: number; unit: LinearUnit; pitchRisePer12: number; overhang: number; wastePercent: number }) {
  const overhangM = nonNegative(input.overhang, 'Overhang') * (input.unit === 'ft' ? FT_TO_M : 1);
  const pitchFactor = Math.sqrt(1 + (nonNegative(input.pitchRisePer12, 'Pitch') / 12) ** 2);
  const flatArea = (metres(input.length, input.unit) + 2 * overhangM) * (metres(input.width, input.unit) + 2 * overhangM);
  const roofArea = flatArea * pitchFactor; const roofingArea = roofArea * (1 + nonNegative(input.wastePercent, 'Waste') / 100);
  return { flatArea, pitchFactor, roofArea, roofingArea, squaresNeeded: roofingArea / 9.290304 };
}
export function calculateFlooring(input: { length: number; width: number; unit: LinearUnit; materialRateSqft: number; laborRateSqft: number; wastePercent: number }) {
  const areaSqft = metres(input.length, input.unit) * metres(input.width, input.unit) * SQM_TO_SQFT;
  const orderAreaSqft = areaSqft * (1 + nonNegative(input.wastePercent, 'Waste') / 100);
  const materialCost = orderAreaSqft * nonNegative(input.materialRateSqft, 'Material rate'); const laborCost = areaSqft * nonNegative(input.laborRateSqft, 'Labor rate');
  return { areaSqft, orderAreaSqft, materialCost, laborCost, totalCost: materialCost + laborCost };
}
export function calculateDimensionalWeight(input: { length: number; width: number; height: number; actualWeight: number; divisor: number }) {
  const volume = positive(input.length, 'Length') * positive(input.width, 'Width') * positive(input.height, 'Height');
  const dimensionalWeight = volume / positive(input.divisor, 'Divisor'); const actualWeight = positive(input.actualWeight, 'Actual weight');
  return { volume, dimensionalWeight, billableWeight: Math.max(actualWeight, dimensionalWeight), chargedBy: dimensionalWeight > actualWeight ? 'Dimensional weight' : 'Actual weight' };
}
