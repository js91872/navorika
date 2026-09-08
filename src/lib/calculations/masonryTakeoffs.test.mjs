import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateMortar,
  calculateConcreteBlock,
  calculateRainwaterHarvesting
} from './masonryTakeoffs.ts';

test('mortar: calculates standard brick batch correctly', () => {
  const res = calculateMortar({
    unitCount: 1000,
    masonryType: 'brick',
    jointThicknessInches: 0.375,
    wastePercent: 10,
    bagWeightLb: 80,
  });
  // 1,000 bricks at 3/8" = 5.0 ft³ base, 5.5 ft³ adjusted with 10% waste
  assert.equal(res.baseVolumeFt3, 5.0);
  assert.equal(res.adjustedVolumeFt3, 5.5);
  assert.equal(res.cubicYards, 0.204);
  assert.equal(res.premixBags, Math.ceil(5.5 / 0.67)); // 9 bags
  assert.ok(res.cementBags94lb > 0);
  assert.ok(res.sandTons > 0);
});

test('mortar: calculates CMU block volume correctly', () => {
  const res = calculateMortar({
    unitCount: 200,
    masonryType: 'block',
    jointThicknessInches: 0.375,
    wastePercent: 0,
    bagWeightLb: 80,
  });
  // 200 blocks at 13.5 ft³ / 100 = 27 ft³
  assert.equal(res.baseVolumeFt3, 27.0);
  assert.equal(res.adjustedVolumeFt3, 27.0);
  assert.equal(res.cubicYards, 1.0);
  assert.equal(res.premixBags, Math.ceil(27.0 / 0.67));
});

test('mortar: handles zero, negative and non-finite inputs safely', () => {
  const zero = calculateMortar({
    unitCount: 0,
    masonryType: 'brick',
  });
  assert.equal(zero.baseVolumeFt3, 0);
  assert.equal(zero.adjustedVolumeFt3, 0);
  assert.equal(zero.premixBags, 0);

  const neg = calculateMortar({
    unitCount: -50,
    masonryType: 'brick',
    jointThicknessInches: -1,
    wastePercent: -10,
  });
  assert.equal(neg.baseVolumeFt3, 0);
  assert.equal(neg.premixBags, 0);
});

test('concreteBlock: calculates wall block count and grout schedule', () => {
  const res = calculateConcreteBlock({
    wallLengthFt: 30,
    wallHeightFt: 8,
    openingsAreaFt2: 40,
    blockType: '8x8x16',
    coreFillOption: 'cores-32in',
    wastePercent: 10,
  });
  // gross: 240, net: 200 ft²
  assert.equal(res.netWallAreaFt2, 200);
  // exact blocks = 200 * 1.125 = 225
  assert.equal(res.exactBlocks, 225);
  // purchase blocks with 10% waste = ceil(225 * 1.1) = 248
  assert.equal(res.purchaseBlocks, 248);
  assert.ok(res.mortarBags80lb > 0);
  assert.ok(res.coreFillGroutYards > 0);
});

test('concreteBlock: handles solid grouting vs hollow cores', () => {
  const solid = calculateConcreteBlock({
    wallLengthFt: 20,
    wallHeightFt: 10,
    coreFillOption: 'solid',
    wastePercent: 0,
  });
  const hollow = calculateConcreteBlock({
    wallLengthFt: 20,
    wallHeightFt: 10,
    coreFillOption: 'none',
    wastePercent: 0,
  });
  assert.equal(hollow.coreFillGroutYards, 0);
  assert.ok(solid.coreFillGroutYards > 0);
  assert.equal(solid.purchaseBlocks, hollow.purchaseBlocks);
});

test('concreteBlock: handles zero and negative inputs safely', () => {
  const zero = calculateConcreteBlock({
    wallLengthFt: 0,
    wallHeightFt: 8,
  });
  assert.equal(zero.netWallAreaFt2, 0);
  assert.equal(zero.exactBlocks, 0);
  assert.equal(zero.purchaseBlocks, 0);
  assert.equal(zero.mortarBags80lb, 0);
  assert.equal(zero.coreFillGroutYards, 0);
});

test('rainwaterHarvesting: calculates annual yield and cistern recommendation', () => {
  const res = calculateRainwaterHarvesting({
    catchmentAreaFt2: 2000,
    annualRainfallInches: 35,
    roofMaterial: 'metal',
    filtrationLossPercent: 5,
    storageDays: 30,
  });
  // 2000 * 35 * 0.6233 * 0.95 * 0.95 = ~39,376 gallons
  assert.ok(res.annualYieldGallons > 35000 && res.annualYieldGallons < 45000);
  assert.ok(res.annualYieldLiters > res.annualYieldGallons * 3.7);
  assert.equal(res.monthlyAverageGallons, Math.round(res.annualYieldGallons / 12));
  assert.ok(res.recommendedTankGallons > 0);
  assert.ok(res.recommendedTankLiters > res.recommendedTankGallons);
});

test('rainwaterHarvesting: handles zero and invalid input without NaN', () => {
  const zero = calculateRainwaterHarvesting({
    catchmentAreaFt2: 0,
    annualRainfallInches: 0,
  });
  assert.equal(zero.annualYieldGallons, 0);
  assert.equal(zero.annualYieldLiters, 0);
  assert.equal(zero.monthlyAverageGallons, 0);
  assert.equal(zero.recommendedTankGallons, 0);

  const neg = calculateRainwaterHarvesting({
    catchmentAreaFt2: -1000,
    annualRainfallInches: -20,
    filtrationLossPercent: 150,
  });
  assert.equal(neg.annualYieldGallons, 0);
  assert.equal(Number.isNaN(neg.annualYieldGallons), false);
});
