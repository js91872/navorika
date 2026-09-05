import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateMaterialWaste } from './materialWaste.ts';

test('materialWaste: standard calculation with defaults', () => {
  const result = calculateMaterialWaste({
    netQuantity: 1000,
    wastePercent: 10,
    unitCost: 2.5,
  });

  assert.equal(result.wasteQuantity, 100);
  assert.equal(result.orderQuantity, 1100);
  assert.equal(result.netMaterialCost, 2500);
  assert.equal(result.wasteCost, 250);
  assert.equal(result.totalMaterialCost, 2750);
});

test('materialWaste: zero waste allowance orders exactly net quantity with zero waste cost', () => {
  const result = calculateMaterialWaste({
    netQuantity: 500,
    wastePercent: 0,
    unitCost: 4.0,
  });

  assert.equal(result.wasteQuantity, 0);
  assert.equal(result.orderQuantity, 500);
  assert.equal(result.netMaterialCost, 2000);
  assert.equal(result.wasteCost, 0);
  assert.equal(result.totalMaterialCost, 2000);
});

test('materialWaste: zero unit cost preserves quantities and produces zero costs without error', () => {
  const result = calculateMaterialWaste({
    netQuantity: 750,
    wastePercent: 15,
    unitCost: 0,
  });

  assert.equal(result.wasteQuantity, 112.5);
  assert.equal(result.orderQuantity, 862.5);
  assert.equal(result.netMaterialCost, 0);
  assert.equal(result.wasteCost, 0);
  assert.equal(result.totalMaterialCost, 0);
});

test('materialWaste: 100% waste allowance doubles order quantity', () => {
  const result = calculateMaterialWaste({
    netQuantity: 200,
    wastePercent: 100,
    unitCost: 10,
  });

  assert.equal(result.wasteQuantity, 200);
  assert.equal(result.orderQuantity, 400);
  assert.equal(result.netMaterialCost, 2000);
  assert.equal(result.wasteCost, 2000);
  assert.equal(result.totalMaterialCost, 4000);
});

test('materialWaste: handles negative and non-finite inputs safely', () => {
  const result = calculateMaterialWaste({
    netQuantity: -100,
    wastePercent: NaN,
    unitCost: -5,
  });

  assert.equal(result.wasteQuantity, 0);
  assert.equal(result.orderQuantity, 0);
  assert.equal(result.netMaterialCost, 0);
  assert.equal(result.wasteCost, 0);
  assert.equal(result.totalMaterialCost, 0);
});
