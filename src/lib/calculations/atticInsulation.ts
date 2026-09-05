export interface AtticInsulationInput {
  atticArea: number;
  installedCostPerArea: number;
  annualHeatingCoolingCost: number;
  estimatedSavingsPercent: number;
  rebates: number;
}

export interface AtticInsulationResult {
  grossProjectCost: number;
  netProjectCost: number;
  annualSavings: number;
  monthlySavings: number;
  paybackYears: number | null;
  [key: string]: number | null;
}

function safeNumber(value: number): number {
  return Number.isFinite(value) ? Math.max(0, value) : 0;
}

export function calculateAtticInsulation(input: AtticInsulationInput): AtticInsulationResult {
  const atticArea = safeNumber(input.atticArea);
  const installedCostPerArea = safeNumber(input.installedCostPerArea);
  const annualHeatingCoolingCost = safeNumber(input.annualHeatingCoolingCost);
  const estimatedSavingsPercent = Math.min(100, safeNumber(input.estimatedSavingsPercent));
  const rebates = safeNumber(input.rebates);

  const grossProjectCost = atticArea * installedCostPerArea;
  const netProjectCost = Math.max(0, grossProjectCost - rebates);

  const annualSavings = annualHeatingCoolingCost * (estimatedSavingsPercent / 100);
  const monthlySavings = annualSavings / 12;

  const paybackYears =
    annualSavings > 0 ? (netProjectCost === 0 ? 0 : netProjectCost / annualSavings) : null;

  return {
    grossProjectCost,
    netProjectCost,
    annualSavings,
    monthlySavings,
    paybackYears,
  };
}
