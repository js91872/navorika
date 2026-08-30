import test from 'node:test';
import assert from 'node:assert/strict';

import { calculateBricks, calculateConcrete } from './construction.ts';
import { calculateEstimate } from './constructionEstimate.ts';
import { postHoleConcrete, roofPitch, stairs } from './constructionExpansion.ts';
import { calculateBrickQuantity, calculateBulkMaterial, calculateExcavation, calculateRebarGrid } from './constructionQuantities.ts';
import { calculateEgressWindow } from './egressWindow.ts';
import { calculateOshaPortableToilets } from './oshaPortableToilet.ts';
import { calculateLadderSafeReach } from './ladderSafeReach.ts';
import { calculateDumpsterWeight } from './dumpsterWeight.ts';
import { calculateAirCompressor } from './airCompressor.ts';
import { calculateSawKerf } from './sawKerf.ts';

const close = (actual, expected, tolerance = 1e-9) => assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} was not within ${tolerance} of ${expected}`);

test('concrete estimate applies waste before the nominal dry-volume ratio', () => {
  const result = calculateConcrete({ length: 10, width: 5, height: 0.2, unit: 'meters', wastage: 10 });
  assert.equal(result.volume, 11); assert.equal(result.cement, 3.08); assert.equal(result.sand, 4.62); assert.equal(result.aggregate, 9.24);
});
test('concrete estimate converts cubic feet from exact linear conversion', () => {
  assert.equal(calculateConcrete({ length: 1, width: 1, height: 1, unit: 'feet', wastage: 0 }).volume, 0.03);
});
test('concrete estimate rejects impossible dimensions and negative waste', () => {
  assert.throws(() => calculateConcrete({ length: 0, width: 1, height: 1, unit: 'meters' }), RangeError);
  assert.throws(() => calculateConcrete({ length: 1, width: 1, height: 1, unit: 'meters', wastage: -1 }), RangeError);
});
test('legacy brick helper subtracts wall mortar volume instead of adding it to each brick', () => {
  assert.deepEqual(calculateBricks({ wallLength: 1, wallHeight: 1, wallThickness: 1, brickLength: 10, brickHeight: 10, brickWidth: 10, mortar: 20 }), { bricks: 800, mortar: 0.2 });
});
test('legacy brick helper rejects an impossible mortar percentage', () => {
  assert.throws(() => calculateBricks({ wallLength: 1, wallHeight: 1, wallThickness: 1, brickLength: 10, brickHeight: 10, brickWidth: 10, mortar: 100 }), RangeError);
});
test('brick takeoff uses nominal brick-and-joint dimensions and applies waste once', () => {
  const result = calculateBrickQuantity({ wallLength: 5, wallThickness: 0.12, wallHeight: 3, unit: 'm', brickLengthM: 0.23, brickWidthM: 0.11, brickHeightM: 0.07, mortarJointMm: 10, wastePercent: 5 });
  close(result.wallVolumeM3, 1.8); assert.ok(result.totalBricks > result.baseBricks); assert.equal(result.totalBricks, Math.ceil(result.wallVolumeM3 / result.nominalBrickVolumeM3 * 1.05));
});
test('brick takeoff converts all three entered feet dimensions', () => {
  close(calculateBrickQuantity({ wallLength: 1, wallThickness: 1, wallHeight: 1, unit: 'ft', brickLengthM: 0.2, brickWidthM: 0.1, brickHeightM: 0.05, mortarJointMm: 0, wastePercent: 0 }).wallVolumeM3, 0.028316846592, 1e-12);
});
test('brick takeoff rejects zero wall dimensions', () => {
  assert.throws(() => calculateBrickQuantity({ wallLength: 0, wallThickness: 1, wallHeight: 1, unit: 'm', brickLengthM: 0.2, brickWidthM: 0.1, brickHeightM: 0.05, mortarJointMm: 10, wastePercent: 0 }), RangeError);
});
test('rebar grid rounds bar spaces upward in both directions', () => {
  const result = calculateRebarGrid({ slabLengthM: 10, slabWidthM: 10, barDiameterMm: 12, maximumSpacingMm: 150, clearCoverMm: 25, direction: 'both' });
  assert.equal(result.barsLengthwise, 68); assert.equal(result.barsWidthwise, 68); assert.equal(result.totalBars, 136); close(result.totalLengthM, 1353.2);
});
test('rebar grid supports a single reinforcement direction', () => {
  const result = calculateRebarGrid({ slabLengthM: 4, slabWidthM: 3, barDiameterMm: 10, maximumSpacingMm: 200, clearCoverMm: 50, direction: 'lengthwise' });
  assert.equal(result.barsLengthwise, 16); assert.equal(result.barsWidthwise, 0); close(result.totalLengthM, 62.4);
});
test('rebar grid rejects cover that consumes the slab', () => {
  assert.throws(() => calculateRebarGrid({ slabLengthM: 1, slabWidthM: 1, barDiameterMm: 12, maximumSpacingMm: 150, clearCoverMm: 500, direction: 'both' }), RangeError);
});
test('bulk material estimate keeps measured and allowance volumes distinct', () => {
  const result = calculateBulkMaterial({ length: 10, width: 5, depth: 0.2, unit: 'm', densityKgM3: 1600, wastePercent: 10, truckPayloadKg: 10000 });
  assert.equal(result.measuredVolumeM3, 10); close(result.orderVolumeM3, 11); close(result.weightKg, 17600); assert.equal(result.truckLoads, 2);
});
test('bulk material estimate converts a cubic foot exactly', () => {
  close(calculateBulkMaterial({ length: 1, width: 1, depth: 1, unit: 'ft', densityKgM3: 1000, wastePercent: 0, truckPayloadKg: 1000 }).measuredVolumeM3, 0.028316846592, 1e-12);
});
test('bulk material estimate rejects negative allowance', () => {
  assert.throws(() => calculateBulkMaterial({ length: 1, width: 1, depth: 1, unit: 'm', densityKgM3: 1, wastePercent: -1, truckPayloadKg: 1 }), RangeError);
});
test('excavation separates bank volume from swelled loose volume', () => {
  const result = calculateExcavation({ length: 10, width: 4, depth: 2, unit: 'm', swellPercent: 25, looseDensityKgM3: 1600, truckPayloadKg: 20000 });
  assert.equal(result.bankVolumeM3, 80); assert.equal(result.looseVolumeM3, 100); assert.equal(result.looseWeightKg, 160000); assert.equal(result.truckLoads, 8);
});
test('excavation converts feet before applying swell', () => {
  const result = calculateExcavation({ length: 1, width: 1, depth: 1, unit: 'ft', swellPercent: 100, looseDensityKgM3: 1, truckPayloadKg: 1 });
  close(result.looseVolumeM3, 0.056633693184, 1e-12);
});
test('excavation rejects a zero truck payload', () => {
  assert.throws(() => calculateExcavation({ length: 1, width: 1, depth: 1, unit: 'm', swellPercent: 0, looseDensityKgM3: 1, truckPayloadKg: 0 }), RangeError);
});
test('egress checker accepts the 2021 IRC non-grade dimensional boundaries', () => {
  const result = calculateEgressWindow({ clearWidthInches: 34.2, clearHeightInches: 24, sillHeightInches: 44, gradeFloorOpening: false });
  close(result.clearAreaSqFt, 5.7); assert.equal(result.passed, true);
});
test('egress checker applies the grade-floor area exception only when selected', () => {
  const input = { clearWidthInches: 30, clearHeightInches: 24, sillHeightInches: 44 };
  assert.equal(calculateEgressWindow({ ...input, gradeFloorOpening: true }).passed, true);
  assert.equal(calculateEgressWindow({ ...input, gradeFloorOpening: false }).passed, false);
});
test('egress checker keeps area width height and sill as independent criteria', () => {
  const result = calculateEgressWindow({ clearWidthInches: 40, clearHeightInches: 21, sillHeightInches: 45, gradeFloorOpening: true });
  assert.deepEqual(result.criteria.filter(({ passed }) => !passed).map(({ id }) => id), ['height', 'sill']);
});
test('egress checker rejects empty-equivalent and non-finite dimensions', () => {
  assert.throws(() => calculateEgressWindow({ clearWidthInches: 0, clearHeightInches: 24, sillHeightInches: 44, gradeFloorOpening: false }), RangeError);
  assert.throws(() => calculateEgressWindow({ clearWidthInches: Infinity, clearHeightInches: 24, sillHeightInches: 44, gradeFloorOpening: false }), RangeError);
});
test('OSHA sanitation calculation preserves the 20 and 21 worker boundary', () => {
  assert.equal(calculateOshaPortableToilets(20).toiletFacilities, 1); assert.equal(calculateOshaPortableToilets(21).toiletFacilities, 1); assert.equal(calculateOshaPortableToilets(21).urinals, 1);
});
test('OSHA sanitation calculation preserves the 199 and 200 worker boundary', () => {
  assert.equal(calculateOshaPortableToilets(199).toiletFacilities, 5); assert.equal(calculateOshaPortableToilets(200).toiletFacilities, 4);
});
test('OSHA sanitation calculation rounds fractional entered workforce upward', () => {
  assert.equal(calculateOshaPortableToilets(40.1).workers, 41); assert.equal(calculateOshaPortableToilets(40.1).toiletFacilities, 2);
});
test('OSHA sanitation calculation rejects zero and non-finite workforce', () => {
  assert.throws(() => calculateOshaPortableToilets(0), RangeError); assert.throws(() => calculateOshaPortableToilets(Number.NaN), RangeError);
});
test('ladder setup uses one-quarter of OSHA working length as base distance', () => {
  const result = calculateLadderSafeReach({ ladderLengthFeet: 20, userHeightFeet: 6, ladderType: 'extension' });
  assert.equal(result.baseDistanceFeet, 5); close(result.verticalHeightFeet, Math.sqrt(375)); close(result.ladderAngleDegrees, 75.52248781407008);
});
test('ladder setup exposes the three-foot upper-landing extension reference', () => {
  assert.equal(calculateLadderSafeReach({ ladderLengthFeet: 16, userHeightFeet: 6, ladderType: 'extension' }).recommendedRoofExtensionFeet, 3);
});
test('ladder setup rejects zero length instead of returning plausible zeros', () => {
  assert.throws(() => calculateLadderSafeReach({ ladderLengthFeet: 0, userHeightFeet: 6, ladderType: 'extension' }), RangeError);
});
test('stair geometry rounds riser count upward and recomputes equal height', () => {
  const result = stairs(100, 7.75, 10); assert.equal(result.risers, 13); close(result.actualRiser, 100 / 13); assert.equal(result.treads, 12); assert.equal(result.totalRun, 120);
});
test('stair geometry rejects a zero tread depth', () => {
  assert.throws(() => stairs(100, 7.75, 0), Error);
});
test('roof pitch derives angle and multiplier from rise over run', () => {
  const result = roofPitch(6, 12, 20); assert.equal(result.pitch12, 6); close(result.angle, 26.56505117707799); close(result.multiplier, Math.sqrt(1.25)); close(result.rafterLength, 20 * Math.sqrt(1.25));
});
test('estimate sequencing applies overhead contingency markup discount then tax', () => {
  const result = calculateEstimate([{ id: '1', category: 'Materials', description: '', quantity: 1, unit: 'item', unitCost: 100 }], { overheadPercent: 10, contingencyPercent: 5, markupPercent: 10, discount: 7.05, taxPercent: 10 });
  assert.equal(result.directCost, 100); close(result.overhead, 10); close(result.contingency, 5.5); close(result.markup, 11.55); close(result.taxableAmount, 120); close(result.tax, 12); close(result.grandTotal, 132);
});
test('estimate reports markup as a distinct implied margin', () => {
  const result = calculateEstimate([{ id: '1', category: 'Labor', description: '', quantity: 1, unit: 'hr', unitCost: 100 }], { overheadPercent: 0, contingencyPercent: 0, markupPercent: 25, discount: 0, taxPercent: 0 });
  assert.equal(result.markup, 25); assert.equal(result.impliedMarginPercent, 20);
});
test('estimate rejects non-finite adjustment percentages', () => {
  assert.throws(() => calculateEstimate([], { overheadPercent: Number.NaN, contingencyPercent: 0, markupPercent: 0, discount: 0, taxPercent: 0 }), RangeError);
});
test('post-hole concrete subtracts round post displacement before bag rounding', () => {
  const result = postHoleConcrete(12, 36, 1, 'round', 4, 0, 0.5); assert.ok(result.displacement > 0); close(result.perHole, result.hole - result.displacement); assert.equal(result.bags, Math.ceil(result.ft3 / 0.5));
});
test('dumpster estimate applies condition only to moisture-sensitive materials', () => {
  const result = calculateDumpsterWeight([{ materialId: 'drywall', quantity: 100, unit: 'squareFeet' }, { materialId: 'concrete', quantity: 1, unit: 'cubicYards' }], 2, 100, 'wet');
  assert.equal(result.totalPounds, 4303); close(result.overageTons, 0.1515); close(result.overageFee, 15.15);
});
test('air compressor calculation applies duty cycle before capacity comparison', () => {
  const result = calculateAirCompressor({ compressorScfm: 5, compressorRatedPsi: 120, tankGallons: 20, toolCfm: 8, toolPsi: 90, usagePercent: 50 });
  assert.equal(result.averageToolCfm, 4); assert.equal(result.canKeepUp, true); assert.equal(result.status, 'comfortable');
});
test('saw kerf exact-edge case avoids charging a nonexistent final cut', () => {
  const result = calculateSawKerf({ stockWidth: 20.25, pieceWidth: 10, kerfWidth: 0.25 });
  assert.equal(result.pieces, 2); assert.equal(result.cuts, 1); assert.equal(result.offcut, 0);
});
