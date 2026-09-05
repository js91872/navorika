import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateJoistDeflection } from './joistDeflection.ts';

test('joistDeflection: known structural benchmark with standard 2x10 floor joist', () => {
  // 12 ft span, 40 psf, 16 in spacing, E = 1,600,000 psi, 2x10 (1.5" x 9.25")
  const result = calculateJoistDeflection({
    span: 12,
    uniformLoad: 40,
    spacing: 16,
    elasticModulus: 1600000,
    width: 1.5,
    depth: 9.25,
  });

  // Tributary line load = 40 * (16 / 12) = 53.3333 plf
  assert.equal(result.lineLoad, 53.3333);

  // I = 1.5 * (9.25)^3 / 12 = 98.9316 in^4
  assert.equal(result.momentOfInertia, 98.9316);

  // Expected deflection approx 0.1572 in
  assert.equal(result.deflection, 0.1572);

  // L/360 limit = (12 * 12) / 360 = 144 / 360 = 0.400 in
  assert.equal(result.l360Limit, 0.4);

  // Ratio = 144 / 0.1572 = ~916 => "L / 916"
  assert.equal(result.ratio, 'L / 916');
});

test('joistDeflection: 2x8 joist on 14 ft span demonstrates lower stiffness and ratio', () => {
  // 14 ft span, 50 psf total load, 16 in spacing, E = 1,400,000 psi, 2x8 (1.5" x 7.25")
  const result = calculateJoistDeflection({
    span: 14,
    uniformLoad: 50,
    spacing: 16,
    elasticModulus: 1400000,
    width: 1.5,
    depth: 7.25,
  });

  // Line load = 50 * (16/12) = 66.6667 plf
  assert.equal(result.lineLoad, 66.6667);

  // I = 1.5 * 7.25^3 / 12 = 47.6348 in^4
  assert.equal(result.momentOfInertia, 47.6348);

  // L/360 = (14 * 12) / 360 = 168 / 360 = 0.4667 in
  assert.equal(result.l360Limit, 0.4667);

  assert.ok(result.deflection > 0);
  assert.ok(result.ratio.startsWith('L / '));
});

test('joistDeflection: zero E handles safely without division by zero', () => {
  const result = calculateJoistDeflection({
    span: 12,
    uniformLoad: 40,
    spacing: 16,
    elasticModulus: 0,
    width: 1.5,
    depth: 9.25,
  });

  assert.equal(result.deflection, 0);
  assert.equal(result.ratio, 'Not applicable');
  assert.equal(result.l360Limit, 0.4);
});

test('joistDeflection: zero I (zero width or depth) handles safely', () => {
  const result = calculateJoistDeflection({
    span: 12,
    uniformLoad: 40,
    spacing: 16,
    elasticModulus: 1600000,
    width: 0,
    depth: 9.25,
  });

  assert.equal(result.momentOfInertia, 0);
  assert.equal(result.deflection, 0);
  assert.equal(result.ratio, 'Not applicable');
});

test('joistDeflection: zero span or zero load handles safely', () => {
  const zeroSpan = calculateJoistDeflection({
    span: 0,
    uniformLoad: 40,
    spacing: 16,
    elasticModulus: 1600000,
    width: 1.5,
    depth: 9.25,
  });
  assert.equal(zeroSpan.deflection, 0);
  assert.equal(zeroSpan.l360Limit, 0);
  assert.equal(zeroSpan.ratio, 'Not applicable');

  const zeroLoad = calculateJoistDeflection({
    span: 12,
    uniformLoad: 0,
    spacing: 16,
    elasticModulus: 1600000,
    width: 1.5,
    depth: 9.25,
  });
  assert.equal(zeroLoad.lineLoad, 0);
  assert.equal(zeroLoad.deflection, 0);
  assert.equal(zeroLoad.ratio, 'Not applicable');
});

test('joistDeflection: negative and non-finite inputs safely clamped without NaN or Infinity', () => {
  const result = calculateJoistDeflection({
    span: -12,
    uniformLoad: NaN,
    spacing: -16,
    elasticModulus: Infinity,
    width: -1.5,
    depth: -9.25,
  });

  assert.equal(result.deflection, 0);
  assert.equal(result.momentOfInertia, 0);
  assert.equal(result.lineLoad, 0);
  assert.equal(result.l360Limit, 0);
  assert.equal(result.ratio, 'Not applicable');
});
