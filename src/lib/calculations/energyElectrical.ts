export type LengthUnit = 'm' | 'ft';
export type CircuitPhase = 'single' | 'three';
export type Conductor = 'copper' | 'aluminum';

const FEET_TO_METRES = 0.3048;
const positive = (value: number, name: string) => {
  if (!Number.isFinite(value) || value <= 0) throw new RangeError(`${name} must be greater than zero.`);
  return value;
};
const nonNegative = (value: number, name: string) => {
  if (!Number.isFinite(value) || value < 0) throw new RangeError(`${name} cannot be negative.`);
  return value;
};

export function calculateElectricityCost(input: { watts: number; hoursPerDay: number; days: number; ratePerKwh: number }) {
  const watts = nonNegative(input.watts, 'Power');
  const hoursPerDay = nonNegative(input.hoursPerDay, 'Hours per day');
  const days = nonNegative(input.days, 'Days');
  const ratePerKwh = nonNegative(input.ratePerKwh, 'Rate');
  if (hoursPerDay > 24) throw new RangeError('Hours per day cannot exceed 24.');
  const dailyKwh = watts / 1000 * hoursPerDay;
  const dailyCost = dailyKwh * ratePerKwh;
  return { dailyKwh, totalKwh: dailyKwh * days, totalCost: dailyCost * days, dailyCost, monthlyCost: dailyCost * 30, yearlyCost: dailyCost * 365 };
}

export function calculateSolarSystem(input: { dailyKwh: number; peakSunHours: number; panelWatts: number; systemLossPercent: number }) {
  const dailyKwh = positive(input.dailyKwh, 'Daily energy use');
  const peakSunHours = positive(input.peakSunHours, 'Peak sun hours');
  const panelWatts = positive(input.panelWatts, 'Panel wattage');
  const systemLossPercent = nonNegative(input.systemLossPercent, 'System loss');
  if (systemLossPercent >= 100) throw new RangeError('System loss must be below 100%.');
  const retainedOutput = 1 - systemLossPercent / 100;
  const requiredSystemKw = dailyKwh / (peakSunHours * retainedOutput);
  const panelsNeeded = Math.ceil(requiredSystemKw * 1000 / panelWatts);
  const actualSystemSizeKw = panelsNeeded * panelWatts / 1000;
  return { dailyKwh, requiredSystemKw, panelsNeeded, actualSystemSizeKw, annualProductionKwh: actualSystemSizeKw * peakSunHours * 365 * retainedOutput };
}

export const COPPER_RESISTANCE_OHM_PER_M: Record<string, number> = {
  '18': 0.02095, '16': 0.01317, '14': 0.008286, '12': 0.005211, '10': 0.003277,
  '8': 0.002061, '6': 0.001296, '4': 0.000815, '3': 0.000646, '2': 0.000513,
  '1': 0.000406, '0': 0.000322, '00': 0.000256, '000': 0.000203, '0000': 0.000161,
};
const WIRE_TABLE: Record<string, { copper: number; aluminum: number; aluminumOhmPerM: number }> = {
  '14': { copper: 15, aluminum: 0, aluminumOhmPerM: 0.0136 }, '12': { copper: 20, aluminum: 15, aluminumOhmPerM: 0.00855 },
  '10': { copper: 30, aluminum: 25, aluminumOhmPerM: 0.00538 }, '8': { copper: 40, aluminum: 35, aluminumOhmPerM: 0.00338 },
  '6': { copper: 55, aluminum: 40, aluminumOhmPerM: 0.00213 }, '4': { copper: 70, aluminum: 55, aluminumOhmPerM: 0.00134 },
  '3': { copper: 85, aluminum: 65, aluminumOhmPerM: 0.00106 }, '2': { copper: 95, aluminum: 75, aluminumOhmPerM: 0.000842 },
  '1': { copper: 110, aluminum: 85, aluminumOhmPerM: 0.000667 }, '0': { copper: 125, aluminum: 100, aluminumOhmPerM: 0.000529 },
  '00': { copper: 145, aluminum: 115, aluminumOhmPerM: 0.00042 }, '000': { copper: 165, aluminum: 130, aluminumOhmPerM: 0.000333 },
  '0000': { copper: 195, aluminum: 150, aluminumOhmPerM: 0.000264 },
};
const WIRE_GAUGE_ORDER = ['14', '12', '10', '8', '6', '4', '3', '2', '1', '0', '00', '000', '0000'] as const;

export function calculateVoltageDrop(input: { voltage: number; current: number; length: number; unit: LengthUnit; resistanceOhmPerM: number; phase: CircuitPhase; maxDropPercent: number }) {
  const voltage = positive(input.voltage, 'Voltage');
  const current = nonNegative(input.current, 'Current');
  const lengthM = positive(input.length, 'Length') * (input.unit === 'ft' ? FEET_TO_METRES : 1);
  const multiplier = input.phase === 'three' ? Math.sqrt(3) : 2;
  const voltageDrop = multiplier * current * positive(input.resistanceOhmPerM, 'Resistance') * lengthM;
  const voltageDropPercent = voltageDrop / voltage * 100;
  return { voltageDrop, voltageDropPercent, lengthM, isAcceptable: voltageDropPercent <= positive(input.maxDropPercent, 'Maximum voltage drop') };
}

export function recommendWireSize(input: { voltage: number; current: number; length: number; unit: LengthUnit; conductor: Conductor; phase: CircuitPhase; loadFactorPercent: number; maxDropPercent: number }) {
  const current = positive(input.current, 'Current');
  const designCurrent = current * positive(input.loadFactorPercent, 'Load factor') / 100;
  let lastResult: (ReturnType<typeof calculateVoltageDrop> & { recommendedGauge: string; ampacity: number; designCurrent: number; meetsCriteria: boolean }) | null = null;
  for (const gauge of WIRE_GAUGE_ORDER) {
    const data = WIRE_TABLE[gauge];
    const ampacity = data[input.conductor];
    const resistanceOhmPerM = input.conductor === 'copper' ? COPPER_RESISTANCE_OHM_PER_M[gauge] : data.aluminumOhmPerM;
    const drop = calculateVoltageDrop({ ...input, current, resistanceOhmPerM });
    lastResult = { recommendedGauge: gauge, ampacity, designCurrent, ...drop, meetsCriteria: ampacity >= designCurrent && drop.isAcceptable };
    if (lastResult.meetsCriteria) return lastResult;
  }
  return lastResult!;
}
