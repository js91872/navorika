import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateSoffitFascia } from './soffitFascia.ts';

test('soffitFascia: standard calculation with defaults', () => {
  const result = calculateSoffitFascia({
    eaveLength: 120,
    soffitDepth: 2,
    fasciaBoardLength: 12,
    soffitPanelCoverage: 12,
    wastePercent: 10,
  });

  assert.equal(result.soffitArea, 240);
  assert.equal(result.soffitAreaWithWaste, 264);
  assert.equal(result.soffitPieces, 22); // ceil(264 / 12) = 22
  assert.equal(result.fasciaLengthWithWaste, 132); // 120 * 1.1 = 132
  assert.equal(result.fasciaBoards, 11); // ceil(132 / 12) = 11
});

test('soffitFascia: handles zero waste allowance', () => {
  const result = calculateSoffitFascia({
    eaveLength: 100,
    soffitDepth: 1.5,
    fasciaBoardLength: 10,
    soffitPanelCoverage: 15,
    wastePercent: 0,
  });

  assert.equal(result.soffitArea, 150);
  assert.equal(result.soffitAreaWithWaste, 150);
  assert.equal(result.soffitPieces, 10);
  assert.equal(result.fasciaLengthWithWaste, 100);
  assert.equal(result.fasciaBoards, 10);
});

test('soffitFascia: board rounding ceil behavior on fractional cuts', () => {
  const result = calculateSoffitFascia({
    eaveLength: 105,
    soffitDepth: 2,
    fasciaBoardLength: 16,
    soffitPanelCoverage: 10,
    wastePercent: 5,
  });

  // eaveLength = 105, waste = 5% => lengthWithWaste = 110.25
  // fasciaBoards = ceil(110.25 / 16) = ceil(6.890625) = 7
  assert.equal(result.fasciaLengthWithWaste, 110.25);
  assert.equal(result.fasciaBoards, 7);

  // soffitArea = 210, with waste = 220.5
  // soffitPieces = ceil(220.5 / 10) = 23
  assert.equal(result.soffitArea, 210);
  assert.equal(result.soffitAreaWithWaste, 220.5);
  assert.equal(result.soffitPieces, 23);
});

test('soffitFascia: handles zero panel coverage and zero board length safely without NaN or Infinity', () => {
  const result = calculateSoffitFascia({
    eaveLength: 100,
    soffitDepth: 2,
    fasciaBoardLength: 0,
    soffitPanelCoverage: 0,
    wastePercent: 10,
  });

  assert.equal(result.soffitPieces, 0);
  assert.equal(result.fasciaBoards, 0);
  assert.ok(Number.isFinite(result.soffitArea));
  assert.ok(Number.isFinite(result.soffitAreaWithWaste));
  assert.ok(Number.isFinite(result.fasciaLengthWithWaste));
});

test('soffitFascia: handles negative, zero, and non-finite inputs safely', () => {
  const result = calculateSoffitFascia({
    eaveLength: -50,
    soffitDepth: NaN,
    fasciaBoardLength: -10,
    soffitPanelCoverage: Infinity,
    wastePercent: -5,
  });

  assert.equal(result.soffitArea, 0);
  assert.equal(result.soffitAreaWithWaste, 0);
  assert.equal(result.soffitPieces, 0);
  assert.equal(result.fasciaLengthWithWaste, 0);
  assert.equal(result.fasciaBoards, 0);
});
