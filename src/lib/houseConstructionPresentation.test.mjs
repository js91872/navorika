import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateHouseConstructionCost } from './calculations/projectEstimators.ts';
import { getHouseConstructionRows, getHouseConstructionSummary } from './houseConstructionPresentation.ts';

test('House presentation helpers preserve the calculator result without changing assumptions', () => {
  const result = calculateHouseConstructionCost({ area: 2000, areaUnit: 'sqft', floors: 1, ratePerSqft: 150, siteAndSoftCosts: 25000, contingencyPercent: 10, landCost: 50000 });
  assert.equal(getHouseConstructionRows(result).find(([label]) => label === 'Total house cost')?.[1], result.totalCost);
  assert.match(getHouseConstructionSummary(result, (value) => `$${value}`), /Total: \$405000/);
});
