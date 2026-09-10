import test from 'node:test';
import assert from 'node:assert/strict';
import {
  decodeBase64Image,
  encodeBytesToBase64,
  inferImageMimeType,
  inspectSvgSecurity,
  sniffImageFormat,
  uint8ArrayToBase64,
  wrapBase64,
} from './index';

test('Base64 Encoder: encodes binary buffers accurately', () => {
  const bytes = new Uint8Array([72, 101, 108, 108, 111]); // "Hello"
  const b64 = uint8ArrayToBase64(bytes);
  assert.equal(b64, 'SGVsbG8=');

  const encoded = encodeBytesToBase64(bytes, 'image/png');
  assert.equal(encoded.base64, 'SGVsbG8=');
  assert.equal(encoded.dataUrl, 'data:image/png;base64,SGVsbG8=');
});

test('Base64 Encoder: line wrapping splits text at fixed intervals', () => {
  const text = '123456789012345678901234567890'; // 30 chars
  const wrapped = wrapBase64(text, 10);
  assert.equal(wrapped, '1234567890\n1234567890\n1234567890');
});

test('Base64 Encoder: infers MIME types from extensions safely', () => {
  assert.equal(inferImageMimeType('photo.jpg'), 'image/jpeg');
  assert.equal(inferImageMimeType('graphic.PNG'), 'image/png');
  assert.equal(inferImageMimeType('diagram.svg'), 'image/svg+xml');
  assert.equal(inferImageMimeType('asset.webp'), 'image/webp');
  assert.equal(inferImageMimeType('animation.gif'), 'image/gif');
});

test('Base64 Decoder: sniffs PNG magic bytes accurately', () => {
  // 1x1 transparent PNG Base64
  const png1x1 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
  const result = decodeBase64Image(png1x1);
  assert.equal(result.success, true);
  assert.equal(result.mimeType, 'image/png');
  assert.equal(result.byteSize! > 0, true);
  assert.equal(result.isSvg, false);
});

test('Base64 Decoder: sniffs JPEG magic bytes accurately', () => {
  // Minimal valid JPEG header (FF D8 FF E0)
  const jpegHeader = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46]);
  const b64 = uint8ArrayToBase64(jpegHeader);
  const result = decodeBase64Image(b64);
  assert.equal(result.success, true);
  assert.equal(result.mimeType, 'image/jpeg');
});

test('Base64 Decoder: handles Data URL prefixes and extracts payload', () => {
  const dataUrl = 'data:image/webp;base64,UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==';
  const result = decodeBase64Image(dataUrl);
  assert.equal(result.success, true);
  assert.equal(result.mimeType, 'image/webp');
  assert.equal(result.rawBase64, 'UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==');
});

test('Base64 Decoder: strips whitespace and newlines cleanly', () => {
  const pngWithSpaces = '  iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII= \n\n  ';
  const result = decodeBase64Image(pngWithSpaces);
  assert.equal(result.success, true);
  assert.equal(result.mimeType, 'image/png');
});

test('Base64 Decoder: rejects invalid characters and empty inputs', () => {
  const emptyRes = decodeBase64Image('');
  assert.equal(emptyRes.success, false);

  const invalidRes = decodeBase64Image('Invalid Characters $$$$!@#');
  assert.equal(invalidRes.success, false);
  assert.match(invalidRes.error!, /Invalid Base64 characters/i);
});

test('SVG Security: permits safe vector graphics', () => {
  const safeSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><circle cx="50" cy="50" r="40" fill="red" /></svg>';
  const check = inspectSvgSecurity(safeSvg);
  assert.equal(check.isSafe, true);
  assert.equal(check.reasons.length, 0);

  const encoded = Buffer.from(safeSvg).toString('base64');
  const decoded = decodeBase64Image(encoded);
  assert.equal(decoded.success, true);
  assert.equal(decoded.isSvg, true);
  assert.equal(decoded.svgIsSafe, true);
});

test('SVG Security: detects dangerous scripts, event handlers, and entity expansion', () => {
  const scriptSvg = '<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>';
  const check1 = inspectSvgSecurity(scriptSvg);
  assert.equal(check1.isSafe, false);
  assert.match(check1.reasons[0], /active executable tags/i);

  const eventSvg = '<svg xmlns="http://www.w3.org/2000/svg" onload="alert(1)"><rect /></svg>';
  const check2 = inspectSvgSecurity(eventSvg);
  assert.equal(check2.isSafe, false);
  assert.match(check2.reasons[0], /inline JavaScript event handlers/i);

  const xxeSvg = '<!DOCTYPE svg [<!ENTITY xxe SYSTEM "file:///etc/passwd">]><svg>&xxe;</svg>';
  const check3 = inspectSvgSecurity(xxeSvg);
  assert.equal(check3.isSafe, false);
  assert.match(check3.reasons[0], /XML entity expansion/i);

  // When passed through decoder
  const decodedMalicious = decodeBase64Image(Buffer.from(scriptSvg).toString('base64'));
  assert.equal(decodedMalicious.success, true);
  assert.equal(decodedMalicious.isSvg, true);
  assert.equal(decodedMalicious.svgIsSafe, false);
  assert.ok(decodedMalicious.securityNotice?.includes('Security Warning'));
});
