import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateHvacDuctCfm } from './hvacDuctCfm.ts';

test('hvacDuctCfm: round duct with default 8 inch diameter at 700 FPM', () => {
  const result = calculateHvacDuctCfm({
    ductShape: 'round',
    diameter: 8,
    velocity: 700,
  });

  // Area = pi * 4^2 / 144 = 50.26548 / 144 = 0.3491 sq ft
  assert.equal(result.ductArea, 0.3491);
  // CFM = 0.34906585 * 700 = 244.35 CFM
  assert.equal(result.cfm, 244.35);
});

test('hvacDuctCfm: rectangular duct 12x8 inches at 700 FPM', () => {
  const result = calculateHvacDuctCfm({
    ductShape: 'rectangular',
    width: 12,
    height: 8,
    velocity: 700,
  });

  // Area = 12 * 8 / 144 = 96 / 144 = 0.6667 sq ft
  assert.equal(result.ductArea, 0.6667);
  // CFM = (96 / 144) * 700 = 466.67 CFM
  assert.equal(result.cfm, 466.67);
});

test('hvacDuctCfm: known residential branch duct benchmark (6-inch round at 500 FPM)', () => {
  const result = calculateHvacDuctCfm({
    ductShape: 'round',
    diameter: 6,
    velocity: 500,
  });

  // Area = pi * 3^2 / 144 = 28.2743 / 144 = 0.1963 sq ft
  assert.equal(result.ductArea, 0.1963);
  // CFM = 0.1963495 * 500 = 98.17 CFM
  assert.equal(result.cfm, 98.17);
});

test('hvacDuctCfm: handles zero dimensions safely', () => {
  const zeroRound = calculateHvacDuctCfm({
    ductShape: 'round',
    diameter: 0,
    velocity: 700,
  });
  assert.equal(zeroRound.ductArea, 0);
  assert.equal(zeroRound.cfm, 0);

  const zeroRectWidth = calculateHvacDuctCfm({
    ductShape: 'rectangular',
    width: 0,
    height: 10,
    velocity: 700,
  });
  assert.equal(zeroRectWidth.ductArea, 0);
  assert.equal(zeroRectWidth.cfm, 0);

  const zeroVelocity = calculateHvacDuctCfm({
    ductShape: 'rectangular',
    width: 12,
    height: 12,
    velocity: 0,
  });
  assert.equal(zeroVelocity.ductArea, 1);
  assert.equal(zeroVelocity.cfm, 0);
});

test('hvacDuctCfm: handles negative and non-finite inputs safely without NaN or Infinity', () => {
  const result = calculateHvacDuctCfm({
    ductShape: 'rectangular',
    width: -12,
    height: NaN,
    velocity: Infinity,
  });

  assert.equal(result.ductArea, 0);
  assert.equal(result.cfm, 0);
});
