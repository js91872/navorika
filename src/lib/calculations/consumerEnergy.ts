const n = (value: number | undefined) => (typeof value === 'number' && Number.isFinite(value) ? Math.max(0, value) : 0);

export interface EvVsGasInput {
  evPrice: number;
  gasPriceVehicle: number;
  annualMiles: number;
  evEfficiency: number;
  electricityRate: number;
  gasMpg: number;
  fuelPrice: number;
  evMaintenance?: number;
  gasMaintenance?: number;
}

export interface EvVsGasResult {
  [key: string]: number | null;
  pricePremium: number;
  evAnnualEnergy: number;
  gasAnnualFuel: number;
  annualSavings: number;
  breakEvenYears: number | null;
  breakEvenMiles: number | null;
}

export function calculateEvVsGas(input: EvVsGasInput): EvVsGasResult {
  const evPrice = n(input.evPrice);
  const gasPriceVehicle = n(input.gasPriceVehicle);
  const annualMiles = n(input.annualMiles);
  const evEfficiency = n(input.evEfficiency);
  const electricityRate = n(input.electricityRate);
  const gasMpg = n(input.gasMpg);
  const fuelPrice = n(input.fuelPrice);
  const evMaintenance = n(input.evMaintenance);
  const gasMaintenance = n(input.gasMaintenance);

  const evAnnualEnergy = annualMiles * (evEfficiency / 100) * electricityRate;
  const gasAnnualFuel = gasMpg > 0 ? (annualMiles / gasMpg) * fuelPrice : 0;
  const annualSavings = gasAnnualFuel + gasMaintenance - (evAnnualEnergy + evMaintenance);
  const pricePremium = evPrice - gasPriceVehicle;

  let breakEvenYears: number | null = null;
  let breakEvenMiles: number | null = null;

  if (pricePremium <= 0) {
    breakEvenYears = 0;
    breakEvenMiles = 0;
  } else if (annualSavings > 0) {
    breakEvenYears = pricePremium / annualSavings;
    breakEvenMiles = breakEvenYears * annualMiles;
  }

  return {
    pricePremium,
    evAnnualEnergy,
    gasAnnualFuel,
    annualSavings,
    breakEvenYears,
    breakEvenMiles,
  };
}

export interface HeatPumpFurnaceInput {
  heatingDemand: number;
  cop: number;
  electricityRate: number;
  furnaceEfficiency: number;
  fuelEnergyPrice: number;
  heatPumpInstall: number;
  furnaceInstall: number;
}

export interface HeatPumpFurnaceResult {
  [key: string]: number | null;
  heatPumpAnnualCost: number;
  furnaceAnnualCost: number;
  annualSavings: number;
  installPremium: number;
  paybackYears: number | null;
}

export function calculateHeatPumpVsFurnace(input: HeatPumpFurnaceInput): HeatPumpFurnaceResult {
  const heatingDemand = n(input.heatingDemand);
  const cop = Math.max(0.1, n(input.cop));
  const electricityRate = n(input.electricityRate);
  const furnaceEfficiency = Math.min(100, Math.max(1, n(input.furnaceEfficiency)));
  const fuelEnergyPrice = n(input.fuelEnergyPrice);
  const heatPumpInstall = n(input.heatPumpInstall);
  const furnaceInstall = n(input.furnaceInstall);

  const heatPumpElectricityUse = cop > 0 ? heatingDemand / cop : 0;
  const heatPumpAnnualCost = heatPumpElectricityUse * electricityRate;
  const furnaceFuelInput = heatingDemand / (furnaceEfficiency / 100);
  const furnaceAnnualCost = furnaceFuelInput * fuelEnergyPrice;

  const annualSavings = furnaceAnnualCost - heatPumpAnnualCost;
  const installPremium = heatPumpInstall - furnaceInstall;

  let paybackYears: number | null = null;

  if (installPremium <= 0) {
    paybackYears = 0;
  } else if (annualSavings > 0) {
    paybackYears = installPremium / annualSavings;
  }

  return {
    heatPumpAnnualCost,
    furnaceAnnualCost,
    annualSavings,
    installPremium,
    paybackYears,
  };
}
