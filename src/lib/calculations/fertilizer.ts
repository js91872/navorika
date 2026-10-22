export type FertilizerAreaUnit = 'sqft' | 'acre';
export type FertilizerRateUnit = 'per-1000-sqft' | 'per-acre';
export type FertilizerNutrient = 'n' | 'p2o5' | 'k2o';

export interface FertilizerCalculationInput {
  area: number;
  areaUnit: FertilizerAreaUnit;
  rate: number;
  rateUnit: FertilizerRateUnit;
  nutrient: FertilizerNutrient;
  npk: { n: number; p2o5: number; k2o: number };
  bagWeightLb?: number;
}

const SQFT_PER_ACRE = 43_560;

function positive(value: number, label: string): number {
  if (!Number.isFinite(value) || value <= 0) {
    throw new RangeError(`${label} must be greater than zero.`);
  }
  return value;
}

function percentage(value: number, label: string): number {
  if (!Number.isFinite(value) || value < 0 || value > 100) {
    throw new RangeError(`${label} must be between 0 and 100.`);
  }
  return value;
}

/**
 * Calculates product quantity from a user's supplied nutrient rate and the
 * guaranteed-analysis percentages on a fertilizer label. This function does
 * not recommend an application rate.
 */
export function calculateFertilizer(input: FertilizerCalculationInput) {
  const area = positive(input.area, 'Area');
  const rate = positive(input.rate, 'Nutrient rate');
  const grade = {
    n: percentage(input.npk.n, 'Nitrogen percentage'),
    p2o5: percentage(input.npk.p2o5, 'Phosphate percentage'),
    k2o: percentage(input.npk.k2o, 'Potash percentage'),
  };

  if (grade.n + grade.p2o5 + grade.k2o > 100.000001) {
    throw new RangeError('The three fertilizer percentages cannot add up to more than 100.');
  }

  const areaSqFt = input.areaUnit === 'acre'
    ? area * SQFT_PER_ACRE
    : input.areaUnit === 'sqft'
      ? area
      : (() => { throw new RangeError('Choose square feet or acres for the area unit.'); })();
  const rateAreaSqFt = input.rateUnit === 'per-acre'
    ? SQFT_PER_ACRE
    : input.rateUnit === 'per-1000-sqft'
      ? 1_000
      : (() => { throw new RangeError('Choose a rate unit of per 1,000 square feet or per acre.'); })();
  const nutrientFraction = grade[input.nutrient] / 100;

  if (nutrientFraction <= 0) {
    throw new RangeError('The selected nutrient has to be greater than 0% on the fertilizer label.');
  }

  const productLbPerRateArea = rate / nutrientFraction;
  const rateAreaCount = areaSqFt / rateAreaSqFt;
  const totalProductLb = productLbPerRateArea * rateAreaCount;
  const nutrientsPerRateArea = {
    n: productLbPerRateArea * grade.n / 100,
    p2o5: productLbPerRateArea * grade.p2o5 / 100,
    k2o: productLbPerRateArea * grade.k2o / 100,
  };
  const nutrientsForArea = {
    n: nutrientsPerRateArea.n * rateAreaCount,
    p2o5: nutrientsPerRateArea.p2o5 * rateAreaCount,
    k2o: nutrientsPerRateArea.k2o * rateAreaCount,
  };

  let bagCoverageSqFt: number | null = null;
  let exactBags: number | null = null;
  let wholeBags: number | null = null;
  if (input.bagWeightLb !== undefined && input.bagWeightLb !== null) {
    const bagWeightLb = positive(input.bagWeightLb, 'Bag weight');
    bagCoverageSqFt = (bagWeightLb / productLbPerRateArea) * rateAreaSqFt;
    exactBags = totalProductLb / bagWeightLb;
    wholeBags = Math.ceil(exactBags);
  }

  return {
    areaSqFt,
    rateAreaSqFt,
    productLbPerRateArea,
    totalProductLb,
    nutrientsPerRateArea,
    nutrientsForArea,
    bagCoverageSqFt,
    exactBags,
    wholeBags,
  };
}
