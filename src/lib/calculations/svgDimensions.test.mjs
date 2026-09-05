import test from 'node:test';
import assert from 'node:assert/strict';
import { parseSvgDimensions } from './svgDimensions.ts';

test('svgDimensions: parses unitless width and height', () => {
  const svg = `<svg width="100" height="50" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="50"/></svg>`;
  const res = parseSvgDimensions(svg);

  assert.equal(res.valid, true);
  assert.equal(res.declaredWidth, 100);
  assert.equal(res.declaredHeight, 50);
  assert.equal(res.widthInPixels, 100);
  assert.equal(res.heightInPixels, 50);
  assert.equal(res.aspectRatio, 2);
  assert.equal(res.aspectRatioString, '2:1 (2)');
});

test('svgDimensions: parses metric millimeter (mm) units', () => {
  const svg = `<svg width="100mm" height="50mm" viewBox="0 0 100 50"></svg>`;
  const res = parseSvgDimensions(svg);

  assert.equal(res.valid, true);
  assert.equal(res.declaredWidth, 100);
  assert.equal(res.declaredWidthUnit, 'mm');
  assert.equal(res.declaredHeight, 50);
  assert.equal(res.declaredHeightUnit, 'mm');
  // 100 mm * 96 / 25.4 = 377.95 px
  assert.equal(res.widthInPixels, 377.95);
  assert.equal(res.heightInPixels, 188.98);
  assert.equal(res.viewBox, '0 0 100 50');
});

test('svgDimensions: parses imperial inch (in) units', () => {
  const svg = `<svg width="4in" height="6in"></svg>`;
  const res = parseSvgDimensions(svg);

  assert.equal(res.valid, true);
  assert.equal(res.declaredWidth, 4);
  assert.equal(res.declaredWidthUnit, 'in');
  assert.equal(res.declaredHeight, 6);
  assert.equal(res.declaredHeightUnit, 'in');
  // 4 in * 96 = 384 px; 6 in * 96 = 576 px
  assert.equal(res.widthInPixels, 384);
  assert.equal(res.heightInPixels, 576);
  assert.equal(res.aspectRatio, 0.6667);
  assert.equal(res.aspectRatioString, '2:3 (0.6667)');
});

test('svgDimensions: viewBox with missing width and height attributes', () => {
  const svg = `<svg viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="40"/></svg>`;
  const res = parseSvgDimensions(svg);

  assert.equal(res.valid, true);
  assert.equal(res.declaredWidth, null);
  assert.equal(res.declaredHeight, null);
  assert.equal(res.viewBox, '0 0 200 100');
  assert.equal(res.viewBoxMinX, 0);
  assert.equal(res.viewBoxMinY, 0);
  assert.equal(res.viewBoxWidth, 200);
  assert.equal(res.viewBoxHeight, 100);
  assert.equal(res.aspectRatio, 2);
  assert.ok(res.description.includes('viewport coordinates defined by viewBox'));
});

test('svgDimensions: preserves aspect ratio attribute', () => {
  const svg = `<svg width="500" height="300" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid meet"></svg>`;
  const res = parseSvgDimensions(svg);

  assert.equal(res.valid, true);
  assert.equal(res.preserveAspectRatio, 'xMidYMid meet');
  assert.equal(res.aspectRatio, 1.6667);
  assert.equal(res.aspectRatioString, '5:3 (1.6667)');
});

test('svgDimensions: script-containing SVG is safely detected and never executed', () => {
  let executed = false;
  // If eval was used, this malicious string might do something:
  const maliciousSvg = `<svg width="100" height="100"><script>window.__evil = true;</script><rect onload="alert(1)"/></svg>`;
  const res = parseSvgDimensions(maliciousSvg);

  assert.equal(res.valid, true);
  assert.equal(res.hasScriptElements, true);
  assert.ok(res.securityNotice.includes('Warning: Executable script or event handler detected'));
  assert.equal(globalThis.__evil, undefined);
});

test('svgDimensions: handles malformed and empty SVG gracefully', () => {
  const emptyRes = parseSvgDimensions('');
  assert.equal(emptyRes.valid, false);
  assert.ok(emptyRes.error);

  const notSvgRes = parseSvgDimensions('<div>Not an svg file</div>');
  assert.equal(notSvgRes.valid, false);
  assert.ok(notSvgRes.error);

  const malformedVb = parseSvgDimensions('<svg viewBox="invalid string" width="abc"></svg>');
  assert.equal(malformedVb.valid, true);
  assert.equal(malformedVb.viewBoxWidth, null);
  assert.equal(malformedVb.declaredWidth, null);
});
