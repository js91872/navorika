import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateAsphalt, calculateDimensionalWeight, calculateFlooring, calculateHouseConstructionCost, calculateRoofArea, calculateTankCapacity } from './projectEstimators.ts';

test('house construction estimate keeps land outside cost per built area', () => {
  const result = calculateHouseConstructionCost({ area: 2000, areaUnit: 'sqft', floors: 1, ratePerSqft: 150, siteAndSoftCosts: 25000, contingencyPercent: 10, landCost: 50000 });
  assert.equal(result.directConstructionCost, 300000); assert.equal(result.projectCostExcludingLand, 355000); assert.equal(result.totalCost, 405000); assert.equal(result.constructionCostPerSqft, 177.5);
});
test('house construction estimate converts square metres and rejects zero area', () => {
  assert.ok(Math.abs(calculateHouseConstructionCost({ area: 100, areaUnit: 'sqm', floors: 1, ratePerSqft: 1, siteAndSoftCosts: 0, contingencyPercent: 0, landCost: 0 }).totalArea - 1076.3910416709723) < 1e-9);
  assert.throws(() => calculateHouseConstructionCost({ area: 0, areaUnit: 'sqft', floors: 1, ratePerSqft: 1, siteAndSoftCosts: 0, contingencyPercent: 0, landCost: 0 }), RangeError);
});
test('water tank formulas cover rectangular, cylindrical, and spherical tanks', () => {
  assert.equal(calculateTankCapacity({ shape: 'rectangular', unit: 'm', length: 2, width: 1.5, height: 1.5, diameter: 1, radius: 1 }).volumeLiters, 4500);
  assert.ok(Math.abs(calculateTankCapacity({ shape: 'cylindrical', unit: 'm', length: 1, width: 1, height: 2, diameter: 2, radius: 1 }).volumeM3 - 2 * Math.PI) < 1e-12);
  assert.ok(Math.abs(calculateTankCapacity({ shape: 'spherical', unit: 'm', length: 1, width: 1, height: 1, diameter: 1, radius: 1 }).volumeM3 - 4 / 3 * Math.PI) < 1e-12);
});
test('water tank conversion treats feet as linear units and rejects invalid dimensions', () => {
  const result = calculateTankCapacity({ shape: 'rectangular', unit: 'ft', length: 1, width: 1, height: 1, diameter: 1, radius: 1 });
  assert.ok(Math.abs(result.volumeM3 - 0.028316846592) < 1e-12);
  assert.throws(() => calculateTankCapacity({ shape: 'spherical', unit: 'm', length: 1, width: 1, height: 1, diameter: 1, radius: 0 }), RangeError);
});
test('asphalt estimate applies density and waste after geometric volume', () => {
  const result = calculateAsphalt({ length: 20, width: 10, unit: 'm', thickness: 75, thicknessUnit: 'mm', densityKgM3: 2240, wastePercent: 5 });
  assert.equal(result.volumeM3, 15); assert.equal(result.weightKg, 33600); assert.equal(result.tonnes, 35.28); assert.equal(result.truckLoads, 2);
});
test('asphalt estimate converts inches and rejects negative waste', () => {
  assert.equal(calculateAsphalt({ length: 1, width: 1, unit: 'm', thickness: 1, thicknessUnit: 'inch', densityKgM3: 1000, wastePercent: 0 }).volumeM3, 0.0254);
  assert.throws(() => calculateAsphalt({ length: 1, width: 1, unit: 'm', thickness: 1, thicknessUnit: 'mm', densityKgM3: 1, wastePercent: -1 }), RangeError);
});
test('roof area applies the slope factor and waste to a simple uniform roof', () => {
  const result = calculateRoofArea({ length: 10, width: 10, unit: 'm', pitchRisePer12: 0, overhang: 0, wastePercent: 10 });
  assert.equal(result.flatArea, 100); assert.equal(result.roofArea, 100); assert.ok(Math.abs(result.roofingArea - 110) < 1e-12);
});
test('roof pitch uses rise over twelve and validates dimensions', () => {
  assert.ok(Math.abs(calculateRoofArea({ length: 1, width: 1, unit: 'm', pitchRisePer12: 12, overhang: 0, wastePercent: 0 }).pitchFactor - Math.sqrt(2)) < 1e-12);
  assert.throws(() => calculateRoofArea({ length: 0, width: 1, unit: 'm', pitchRisePer12: 1, overhang: 0, wastePercent: 0 }), RangeError);
});
test('flooring applies material waste but labor only to measured area', () => {
  const result = calculateFlooring({ length: 10, width: 10, unit: 'ft', materialRateSqft: 8, laborRateSqft: 3, wastePercent: 10 });
  assert.ok(Math.abs(result.areaSqft - 100) < 1e-9); assert.ok(Math.abs(result.materialCost - 880) < 1e-8); assert.ok(Math.abs(result.laborCost - 300) < 1e-8);
});
test('flooring rejects negative rates and waste', () => {
  assert.throws(() => calculateFlooring({ length: 1, width: 1, unit: 'm', materialRateSqft: -1, laborRateSqft: 0, wastePercent: 0 }), RangeError);
});
test('dimensional weight selects the larger billable weight', () => {
  const result = calculateDimensionalWeight({ length: 50, width: 40, height: 30, actualWeight: 8, divisor: 5000 });
  assert.equal(result.volume, 60000); assert.equal(result.dimensionalWeight, 12); assert.equal(result.billableWeight, 12); assert.equal(result.chargedBy, 'Dimensional weight');
});
test('dimensional weight rejects a zero divisor and handles actual-weight charging', () => {
  assert.equal(calculateDimensionalWeight({ length: 10, width: 10, height: 10, actualWeight: 5, divisor: 1000 }).chargedBy, 'Actual weight');
  assert.throws(() => calculateDimensionalWeight({ length: 1, width: 1, height: 1, actualWeight: 1, divisor: 0 }), RangeError);
});
