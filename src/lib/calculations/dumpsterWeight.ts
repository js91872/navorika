export type DebrisUnit = 'cubicYards' | 'cubicFeet' | 'squareFeet' | 'tons' | 'pounds';
export type MaterialCondition = 'dry' | 'typical' | 'wet';

export interface DebrisMaterial {
  id: string;
  name: string;
  weightLbPerUnit: Partial<Record<DebrisUnit, number>>;
  moistureSensitive: boolean;
  notes: string;
}

export interface DebrisLineInput {
  materialId: string;
  quantity: number;
  unit: DebrisUnit;
  customWeightLbPerUnit?: number;
}

export interface DumpsterWeightResult {
  totalPounds: number;
  totalTons: number;
  allowanceTons: number;
  overageTons: number;
  overageFee: number;
  knownVolumeCubicYards: number;
  hasUnmeasuredVolume: boolean;
}

export const DEBRIS_UNIT_LABELS: Record<DebrisUnit, string> = {
  cubicYards: 'cubic yards',
  cubicFeet: 'cubic feet',
  squareFeet: 'square feet',
  tons: 'tons',
  pounds: 'pounds',
};

export const MATERIAL_CONDITION_MULTIPLIERS: Record<MaterialCondition, number> = {
  dry: 0.95,
  typical: 1,
  wet: 1.15,
};

// Planning factors for loose or demolished material, rounded from commonly used
// construction estimating ranges. They are deliberately easy to review and update.
// Actual weights vary with moisture, compaction, composition, thickness,
// contamination, and demolition method; scale tickets remain authoritative.
export const DEBRIS_MATERIALS: readonly DebrisMaterial[] = [
  {
    id: 'concrete',
    name: 'Concrete',
    weightLbPerUnit: { cubicYards: 4050, cubicFeet: 150 },
    moistureSensitive: false,
    notes: 'About 4,050 lb per cubic yard for normal-weight concrete.',
  },
  {
    id: 'asphalt',
    name: 'Asphalt',
    weightLbPerUnit: { cubicYards: 3900, cubicFeet: 144 },
    moistureSensitive: false,
    notes: 'About 3,900 lb per cubic yard; mix and compaction affect weight.',
  },
  {
    id: 'brick',
    name: 'Brick',
    weightLbPerUnit: { cubicYards: 3000, cubicFeet: 111 },
    moistureSensitive: false,
    notes: 'About 3,000 lb per cubic yard of broken masonry.',
  },
  {
    id: 'drywall',
    name: 'Drywall',
    weightLbPerUnit: { cubicYards: 500, cubicFeet: 18.5, squareFeet: 2.2 },
    moistureSensitive: true,
    notes: 'Square-foot estimate assumes typical 1/2-inch gypsum board.',
  },
  {
    id: 'roofing-shingles',
    name: 'Roofing shingles',
    weightLbPerUnit: { squareFeet: 2.5 },
    moistureSensitive: true,
    notes: 'About 250 lb per roofing square (100 sq ft) for one typical layer.',
  },
  {
    id: 'lumber',
    name: 'Lumber / wood',
    weightLbPerUnit: { cubicYards: 500, cubicFeet: 18.5 },
    moistureSensitive: true,
    notes: 'Loose demolition wood; species, fasteners, and packing vary widely.',
  },
  {
    id: 'soil',
    name: 'Soil / dirt',
    weightLbPerUnit: { cubicYards: 2200, cubicFeet: 81.5 },
    moistureSensitive: true,
    notes: 'Loose average soil; clay, sand, stones, and water can change weight.',
  },
  {
    id: 'gravel',
    name: 'Gravel',
    weightLbPerUnit: { cubicYards: 2800, cubicFeet: 104 },
    moistureSensitive: true,
    notes: 'Loose aggregate estimate; gradation and compaction affect density.',
  },
  {
    id: 'mixed-construction',
    name: 'Mixed construction debris',
    weightLbPerUnit: { cubicYards: 500, cubicFeet: 18.5 },
    moistureSensitive: true,
    notes: 'Broad planning average; a heavy-material mix can weigh much more.',
  },
  {
    id: 'household-junk',
    name: 'Household junk',
    weightLbPerUnit: { cubicYards: 300, cubicFeet: 11 },
    moistureSensitive: true,
    notes: 'Loose mixed-item estimate; appliances and dense items are not typical.',
  },
  {
    id: 'custom',
    name: 'Custom material',
    weightLbPerUnit: {},
    moistureSensitive: true,
    notes: 'Enter your own estimated pounds per selected unit.',
  },
] as const;

const directWeightFactors: Partial<Record<DebrisUnit, number>> = {
  tons: 2000,
  pounds: 1,
};

export function getDebrisMaterial(materialId: string): DebrisMaterial {
  return DEBRIS_MATERIALS.find(({ id }) => id === materialId) ?? DEBRIS_MATERIALS[0];
}

export function getAllowedUnits(materialId: string): DebrisUnit[] {
  const material = getDebrisMaterial(materialId);
  if (material.id === 'custom') return ['cubicYards', 'cubicFeet', 'squareFeet', 'tons', 'pounds'];
  return [...Object.keys(material.weightLbPerUnit) as DebrisUnit[], 'tons', 'pounds'];
}

export function calculateDebrisLinePounds(line: DebrisLineInput, condition: MaterialCondition): number {
  if (!Number.isFinite(line.quantity) || line.quantity <= 0) return 0;

  const material = getDebrisMaterial(line.materialId);
  const directFactor = directWeightFactors[line.unit];
  const factor = directFactor ?? (material.id === 'custom' ? line.customWeightLbPerUnit : material.weightLbPerUnit[line.unit]);
  if (!Number.isFinite(factor) || !factor || factor <= 0) return 0;

  const conditionMultiplier = directFactor || !material.moistureSensitive
    ? 1
    : MATERIAL_CONDITION_MULTIPLIERS[condition];
  return line.quantity * factor * conditionMultiplier;
}

export function calculateDumpsterWeight(
  lines: DebrisLineInput[],
  allowanceTons: number,
  overageRatePerTon: number,
  condition: MaterialCondition,
): DumpsterWeightResult {
  const totalPounds = lines.reduce((sum, line) => sum + calculateDebrisLinePounds(line, condition), 0);
  const totalTons = totalPounds / 2000;
  const safeAllowance = Number.isFinite(allowanceTons) ? Math.max(0, allowanceTons) : 0;
  const safeRate = Number.isFinite(overageRatePerTon) ? Math.max(0, overageRatePerTon) : 0;
  const overageTons = Math.max(0, totalTons - safeAllowance);

  const knownVolumeCubicYards = lines.reduce((sum, line) => {
    if (!Number.isFinite(line.quantity) || line.quantity <= 0) return sum;
    if (line.unit === 'cubicYards') return sum + line.quantity;
    if (line.unit === 'cubicFeet') return sum + line.quantity / 27;
    return sum;
  }, 0);

  return {
    totalPounds,
    totalTons,
    allowanceTons: safeAllowance,
    overageTons,
    overageFee: overageTons * safeRate,
    knownVolumeCubicYards,
    hasUnmeasuredVolume: lines.some((line) => line.quantity > 0 && line.unit !== 'cubicYards' && line.unit !== 'cubicFeet'),
  };
}
