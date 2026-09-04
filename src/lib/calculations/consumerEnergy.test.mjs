import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateEvVsGas, calculateHeatPumpVsFurnace } from './consumerEnergy.ts';

test('EV vs gas calculation matches default reference case with positive savings', () => {
  const result = calculateEvVsGas({
    evPrice: 45000,
    gasPriceVehicle: 35000,
    annualMiles: 12000,
    evEfficiency: 30,
    electricityRate: 0.16,
    gasMpg: 30,
    fuelPrice: 3.5,
    evMaintenance: 500,
    gasMaintenance: 900,
  });

  assert.equal(result.pricePremium, 10000);
  assert.equal(result.evAnnualEnergy, 576);
  assert.equal(result.gasAnnualFuel, 1400);
  assert.equal(result.annualSavings, 1224);
  assert.ok(result.breakEvenYears !== null && Math.abs(result.breakEvenYears - 8.1699) < 0.001);
  assert.ok(result.breakEvenMiles !== null && Math.abs(result.breakEvenMiles - 98039.21) < 1);
});

test('EV vs gas returns immediate break-even when no price premium exists', () => {
  const result = calculateEvVsGas({
    evPrice: 30000,
    gasPriceVehicle: 35000,
    annualMiles: 12000,
    evEfficiency: 30,
    electricityRate: 0.16,
    gasMpg: 30,
    fuelPrice: 3.5,
  });

  assert.equal(result.pricePremium, -5000);
  assert.equal(result.breakEvenYears, 0);
  assert.equal(result.breakEvenMiles, 0);
});

test('EV vs gas returns null break-even when operating savings are zero or negative', () => {
  const result = calculateEvVsGas({
    evPrice: 50000,
    gasPriceVehicle: 30000,
    annualMiles: 12000,
    evEfficiency: 40,
    electricityRate: 0.50, // very expensive electricity ($2400)
    gasMpg: 50,
    fuelPrice: 2.0,        // cheap gas ($480)
    evMaintenance: 500,
    gasMaintenance: 500,
  });

  assert.equal(result.pricePremium, 20000);
  assert.ok(result.annualSavings < 0);
  assert.equal(result.breakEvenYears, null);
  assert.equal(result.breakEvenMiles, null);
});

test('EV vs gas sanitizes invalid and non-finite inputs safely', () => {
  const result = calculateEvVsGas({
    evPrice: Number.NaN,
    gasPriceVehicle: -10000,
    annualMiles: Number.NaN,
    evEfficiency: 0,
    electricityRate: 0,
    gasMpg: 0,
    fuelPrice: 0,
  });

  assert.equal(result.pricePremium, 0);
  assert.equal(result.breakEvenYears, 0);
  assert.equal(result.breakEvenMiles, 0);
});

test('heat pump vs furnace calculation matches default reference case', () => {
  const result = calculateHeatPumpVsFurnace({
    heatingDemand: 15000,
    cop: 3,
    electricityRate: 0.16,
    furnaceEfficiency: 90,
    fuelEnergyPrice: 0.08,
    heatPumpInstall: 12000,
    furnaceInstall: 7000,
  });

  assert.equal(result.heatPumpAnnualCost, 800);
  assert.ok(Math.abs(result.furnaceAnnualCost - 1333.333) < 0.01);
  assert.ok(Math.abs(result.annualSavings - 533.333) < 0.01);
  assert.equal(result.installPremium, 5000);
  assert.ok(result.paybackYears !== null && Math.abs(result.paybackYears - 9.375) < 0.001);
});

test('heat pump vs furnace returns 0 payback when install cost is equal or lower', () => {
  const result = calculateHeatPumpVsFurnace({
    heatingDemand: 15000,
    cop: 3,
    electricityRate: 0.16,
    furnaceEfficiency: 90,
    fuelEnergyPrice: 0.08,
    heatPumpInstall: 7000,
    furnaceInstall: 8000,
  });

  assert.equal(result.installPremium, -1000);
  assert.equal(result.paybackYears, 0);
});

test('heat pump vs furnace returns null payback when heat pump costs more to run', () => {
  const result = calculateHeatPumpVsFurnace({
    heatingDemand: 15000,
    cop: 2,
    electricityRate: 0.30, // heat pump costs $2,250
    furnaceEfficiency: 95,
    fuelEnergyPrice: 0.05, // furnace costs $789.47
    heatPumpInstall: 12000,
    furnaceInstall: 7000,
  });

  assert.ok(result.installPremium > 0);
  assert.ok(result.annualSavings < 0);
  assert.equal(result.paybackYears, null);
});
