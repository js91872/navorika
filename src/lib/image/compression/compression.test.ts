import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateScaledDimensions,
  COMPRESSION_PRESETS,
  estimateScaleForTarget,
  formatBytes,
  isCompressionSuccessful,
  nextBinaryQuality,
  parseTargetBytes,
  resolveOutputFormat,
} from './index';

test('Compression Presets: matches expected byte targets and descriptions', () => {
  assert.equal(COMPRESSION_PRESETS['20kb'].targetBytes, 20 * 1024);
  assert.equal(COMPRESSION_PRESETS['50kb'].targetBytes, 50 * 1024);
  assert.equal(COMPRESSION_PRESETS['100kb'].targetBytes, 100 * 1024);
  assert.equal(COMPRESSION_PRESETS['200kb'].targetBytes, 200 * 1024);

  assert.equal(parseTargetBytes('20kb'), 20480);
  assert.equal(parseTargetBytes('50kb'), 51200);
  assert.equal(parseTargetBytes('100kb'), 102400);
  assert.equal(parseTargetBytes('200kb'), 204800);
  assert.equal(parseTargetBytes(75 * 1024), 76800);
});

test('Format Bytes: formats sizes cleanly', () => {
  assert.equal(formatBytes(0), '0 B');
  assert.equal(formatBytes(1024), '1 KB');
  assert.equal(formatBytes(51200), '50 KB');
  assert.equal(formatBytes(1024 * 1024 * 2.5), '2.5 MB');
});

test('Aspect Ratio Preservation: scales dimensions accurately without distortion', () => {
  const originalWidth = 1920;
  const originalHeight = 1080;
  const originalRatio = originalWidth / originalHeight;

  // Scale 50%
  const scaled50 = calculateScaledDimensions(originalWidth, originalHeight, 0.5);
  assert.equal(scaled50.width, 960);
  assert.equal(scaled50.height, 540);
  const scaledRatio = scaled50.width / scaled50.height;
  assert.ok(Math.abs(originalRatio - scaledRatio) < 0.01);

  // Clamping scale > 1.0
  const scaledOver = calculateScaledDimensions(originalWidth, originalHeight, 1.5);
  assert.equal(scaledOver.width, 1920);
  assert.equal(scaledOver.height, 1080);

  // Enforcing minimum dimension
  const tiny = calculateScaledDimensions(100, 50, 0.1, 150);
  assert.ok(tiny.width >= 150 || tiny.height >= 50);
});

test('Dimensional Scale Estimation: computes proportional reduction factor', () => {
  // If current size is 400KB and target is 100KB (ratio 1/4)
  // sqrt(1/4) = 0.5. With 0.88 safety margin, scale should be ~0.44
  const scale = estimateScaleForTarget(400 * 1024, 100 * 1024);
  assert.ok(scale >= 0.40 && scale <= 0.48);

  // If current size is already under target, returns 1.0 (no scaling needed)
  assert.equal(estimateScaleForTarget(80 * 1024, 100 * 1024), 1.0);
});

test('Format Resolution: respects user choices and warns on PNG transparency loss', () => {
  // Explicit JPEG requested for PNG input
  const pngToJpg = resolveOutputFormat('image/png', 'image/jpeg');
  assert.equal(pngToJpg.outputFormat, 'image/jpeg');
  assert.equal(pngToJpg.formatChanged, true);
  assert.ok(pngToJpg.notice?.includes('removes transparent channels'));

  // Default PNG input without format shift preserves PNG
  const pngDefault = resolveOutputFormat('image/png');
  assert.equal(pngDefault.outputFormat, 'image/png');
  assert.equal(pngDefault.formatChanged, false);

  // PNG input with format shift enabled shifts to WebP
  const pngShiftedWebp = resolveOutputFormat('image/png', undefined, true, 'image/webp');
  assert.equal(pngShiftedWebp.outputFormat, 'image/webp');
  assert.equal(pngShiftedWebp.formatChanged, true);
  assert.ok(pngShiftedWebp.notice?.includes('maintain transparency'));

  // JPEG input stays JPEG
  const jpgDefault = resolveOutputFormat('image/jpeg');
  assert.equal(jpgDefault.outputFormat, 'image/jpeg');
  assert.equal(jpgDefault.formatChanged, false);
});

test('Binary Search Quality: converges toward target bound', () => {
  let low = 0.10;
  let high = 0.90;
  const mid1 = nextBinaryQuality(low, high);
  assert.equal(mid1, 0.5);

  // Suppose 0.5 is still over target, high becomes 0.5
  high = mid1;
  const mid2 = nextBinaryQuality(low, high);
  assert.equal(mid2, 0.3);

  // Suppose 0.3 is under target, low becomes 0.3
  low = mid2;
  const mid3 = nextBinaryQuality(low, high);
  assert.equal(mid3, 0.4);
});

test('Target Success Checking: evaluates strictly under or equal to target bytes', () => {
  const target = 100 * 1024; // 102,400 bytes
  assert.equal(isCompressionSuccessful(102400, target), true);
  assert.equal(isCompressionSuccessful(95000, target), true);
  assert.equal(isCompressionSuccessful(102401, target), false);
  assert.equal(isCompressionSuccessful(0, target), false);
});
