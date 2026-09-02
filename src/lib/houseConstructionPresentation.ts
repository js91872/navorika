import type { ExportCell } from './resultExport';
import type { calculateHouseConstructionCost } from './calculations/projectEstimators';

export type HouseConstructionResult = ReturnType<typeof calculateHouseConstructionCost>;
export type HouseConstructionFormatter = (amount: number) => string;

export function getHouseConstructionRows(result: HouseConstructionResult): readonly (readonly ExportCell[])[] {
  return [
    ['Item', 'Value'],
    ['Direct construction', result.directConstructionCost],
    ['Contingency', result.contingency],
    ['Site and soft costs', result.siteAndSoftCosts],
    ['Project excluding land', result.projectCostExcludingLand],
    ['Land cost', result.landCost],
    ['Total house cost', result.totalCost],
    ['Cost per sq ft', result.constructionCostPerSqft],
    ['Total area sq ft', result.totalArea],
  ];
}

export function getHouseConstructionSummary(result: HouseConstructionResult, formatCurrency: HouseConstructionFormatter): string {
  return `House construction estimate\nTotal: ${formatCurrency(result.totalCost)}\nProject excluding land: ${formatCurrency(result.projectCostExcludingLand)}\nTotal area: ${result.totalArea.toFixed(0)} sq ft`;
}
