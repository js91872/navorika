import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateShortTermRental, calculateHouseHacking } from './personalRealEstate.ts';

test('short-term rental matches default reference parameters', () => {
  const result = calculateShortTermRental({
    nightlyRate: 180,
    availableNights: 30,
    occupancy: 65,
    variableCost: 35,
    fixedCosts: 2200,
    platformFee: 3,
  });

  assert.equal(result.occupiedNights, 19.5);
  assert.equal(result.grossRevenue, 3510);
  assert.equal(result.platformFees, 105.3);
  assert.equal(result.totalCosts, 2987.8);
  assert.ok(Math.abs(result.monthlyProfit - 522.2) < 0.001);
  assert.ok(result.breakEvenOccupancy !== null && Math.abs(result.breakEvenOccupancy - 52.531) < 0.01);
});

test('short-term rental returns null break-even when nightly contribution is not positive', () => {
  const result = calculateShortTermRental({
    nightlyRate: 50,
    availableNights: 30,
    occupancy: 50,
    variableCost: 60, // exceeds nightly rate
    fixedCosts: 1000,
    platformFee: 5,
  });

  assert.equal(result.breakEvenOccupancy, null);
  assert.ok(result.monthlyProfit < 0);
});

test('short-term rental sanitizes non-finite inputs safely', () => {
  const result = calculateShortTermRental({
    nightlyRate: Number.NaN,
    availableNights: -5,
    occupancy: 200,
    variableCost: -10,
    fixedCosts: Number.NaN,
    platformFee: 150,
  });

  assert.equal(result.occupiedNights, 1);
  assert.equal(result.grossRevenue, 0);
  assert.equal(result.totalCosts, 0);
  assert.equal(result.breakEvenOccupancy, null);
});

test('house hacking matches default reference parameters', () => {
  const result = calculateHouseHacking({
    mortgage: 2200,
    taxInsurance: 600,
    hoa: 0,
    utilities: 300,
    maintenance: 250,
    other: 0,
    rentReceived: 1800,
    vacancy: 5,
  });

  assert.equal(result.grossHousingCost, 3350);
  assert.equal(result.effectiveRentIncome, 1710);
  assert.equal(result.effectiveHousingCost, 1640);
  assert.equal(result.annualEffectiveCost, 19680);
  assert.ok(result.costOffsetPercent !== null && Math.abs(result.costOffsetPercent - 51.0447) < 0.01);
});

test('house hacking allows negative effective cost when rent exceeds expenses', () => {
  const result = calculateHouseHacking({
    mortgage: 1500,
    taxInsurance: 400,
    hoa: 100,
    utilities: 200,
    maintenance: 150,
    rentReceived: 3000,
    vacancy: 0,
  });

  assert.equal(result.grossHousingCost, 2350);
  assert.equal(result.effectiveRentIncome, 3000);
  assert.equal(result.effectiveHousingCost, -650);
  assert.equal(result.annualEffectiveCost, -7800);
  assert.ok(result.costOffsetPercent !== null && result.costOffsetPercent > 100);
});
