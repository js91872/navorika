import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateElectricityCost, calculateSolarSystem, calculateVoltageDrop, COPPER_RESISTANCE_OHM_PER_M, recommendWireSize } from './energyElectrical.ts';

test('electricity cost converts watts and hours to kWh and cost', () => {
  const result = calculateElectricityCost({ watts: 1000, hoursPerDay: 4, days: 30, ratePerKwh: 0.15 });
  assert.equal(result.dailyKwh, 4); assert.equal(result.totalKwh, 120); assert.equal(result.totalCost, 18);
});
test('electricity cost accepts zero use and rejects impossible daily hours', () => {
  assert.equal(calculateElectricityCost({ watts: 0, hoursPerDay: 0, days: 0, ratePerKwh: 0 }).totalCost, 0);
  assert.throws(() => calculateElectricityCost({ watts: 1, hoursPerDay: 25, days: 1, ratePerKwh: 1 }), RangeError);
});
test('solar sizing balances daily energy after user-entered losses', () => {
  const result = calculateSolarSystem({ dailyKwh: 30, peakSunHours: 5, panelWatts: 400, systemLossPercent: 20 });
  assert.equal(result.requiredSystemKw, 7.5); assert.equal(result.panelsNeeded, 19); assert.equal(result.actualSystemSizeKw, 7.6);
});
test('solar sizing rejects zero sun and total system loss', () => {
  assert.throws(() => calculateSolarSystem({ dailyKwh: 1, peakSunHours: 0, panelWatts: 400, systemLossPercent: 20 }), RangeError);
  assert.throws(() => calculateSolarSystem({ dailyKwh: 1, peakSunHours: 5, panelWatts: 400, systemLossPercent: 100 }), RangeError);
});
test('single-phase voltage drop uses round-trip conductor length', () => {
  const result = calculateVoltageDrop({ voltage: 120, current: 15, length: 39, unit: 'ft', resistanceOhmPerM: COPPER_RESISTANCE_OHM_PER_M['14'], phase: 'single', maxDropPercent: 3 });
  assert.ok(Math.abs(result.voltageDrop - 2.95492) < 0.001); assert.equal(result.isAcceptable, true);
});
test('three-phase voltage drop uses square-root-three multiplier', () => {
  const result = calculateVoltageDrop({ voltage: 400, current: 20, length: 100, unit: 'm', resistanceOhmPerM: 0.001, phase: 'three', maxDropPercent: 1 });
  assert.ok(Math.abs(result.voltageDrop - Math.sqrt(3) * 2) < 1e-12); assert.equal(result.isAcceptable, true);
});
test('voltage drop rejects zero voltage and unknown resistance', () => {
  assert.throws(() => calculateVoltageDrop({ voltage: 0, current: 20, length: 1, unit: 'm', resistanceOhmPerM: 1, phase: 'single', maxDropPercent: 3 }), RangeError);
  assert.throws(() => calculateVoltageDrop({ voltage: 120, current: 20, length: 1, unit: 'm', resistanceOhmPerM: undefined, phase: 'single', maxDropPercent: 3 }), RangeError);
});
test('wire recommendation selects the first size meeting both planning criteria', () => {
  const result = recommendWireSize({ voltage: 120, current: 20, length: 10, unit: 'm', conductor: 'copper', phase: 'single', loadFactorPercent: 125, maxDropPercent: 3 });
  assert.equal(result.recommendedGauge, '10'); assert.equal(result.meetsCriteria, true);
});
test('wire recommendation flags loads beyond the simplified table', () => {
  const result = recommendWireSize({ voltage: 120, current: 300, length: 100, unit: 'm', conductor: 'copper', phase: 'single', loadFactorPercent: 125, maxDropPercent: 3 });
  assert.equal(result.recommendedGauge, '0000'); assert.equal(result.meetsCriteria, false);
});
