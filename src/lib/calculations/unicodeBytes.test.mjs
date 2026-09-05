import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateUnicodeBytes } from './unicodeBytes.ts';

test('unicodeBytes: calculates empty string correctly without NaN or division errors', () => {
  const result = calculateUnicodeBytes('');
  assert.equal(result.characters, 0);
  assert.equal(result.utf16CodeUnits, 0);
  assert.equal(result.utf8Bytes, 0);
  assert.equal(result.utf16Bytes, 0);
  assert.equal(result.difference, 0);
  assert.equal(result.smallerEncoding, 'Equal');
});

test('unicodeBytes: ASCII string uses 1 byte per char in UTF-8 and 2 bytes in UTF-16', () => {
  const result = calculateUnicodeBytes('Hello');
  assert.equal(result.characters, 5);
  assert.equal(result.utf16CodeUnits, 5);
  assert.equal(result.utf8Bytes, 5);
  assert.equal(result.utf16Bytes, 10);
  assert.equal(result.difference, -5);
  assert.equal(result.smallerEncoding, 'UTF-8');
  assert.equal(result.asciiCount, 5);
});

test('unicodeBytes: accented characters expand in UTF-8 (2 bytes per char)', () => {
  // "café": c(1), a(1), f(1), é(2) in UTF-8 = 5 bytes; UTF-16 = 4 * 2 = 8 bytes
  const result = calculateUnicodeBytes('café');
  assert.equal(result.characters, 4);
  assert.equal(result.utf16CodeUnits, 4);
  assert.equal(result.utf8Bytes, 5);
  assert.equal(result.utf16Bytes, 8);
  assert.equal(result.difference, -3);
  assert.equal(result.smallerEncoding, 'UTF-8');
  assert.equal(result.asciiCount, 3);
  assert.equal(result.bmpNonAsciiCount, 1);
});

test('unicodeBytes: non-Latin East Asian text is smaller in UTF-16 than UTF-8', () => {
  // "你好": 2 Chinese characters (U+4F60, U+597D).
  // In UTF-8, each is 3 bytes -> total 6 bytes.
  // In UTF-16, each is 1 code unit = 2 bytes -> total 4 bytes.
  const result = calculateUnicodeBytes('你好');
  assert.equal(result.characters, 2);
  assert.equal(result.utf16CodeUnits, 2);
  assert.equal(result.utf8Bytes, 6);
  assert.equal(result.utf16Bytes, 4);
  assert.equal(result.difference, 2);
  assert.equal(result.smallerEncoding, 'UTF-16');
  assert.equal(result.bmpNonAsciiCount, 2);
});

test('unicodeBytes: emoji and surrogate pairs correctly distinguished', () => {
  // "🌍" (Earth globe, U+1F30F): 1 Unicode code point, 2 UTF-16 code units (surrogate pair), 4 UTF-8 bytes, 4 UTF-16 bytes (2 * 2).
  const result = calculateUnicodeBytes('🌍');
  assert.equal(result.characters, 1);
  assert.equal(result.utf16CodeUnits, 2);
  assert.equal(result.utf8Bytes, 4);
  assert.equal(result.utf16Bytes, 4);
  assert.equal(result.difference, 0);
  assert.equal(result.smallerEncoding, 'Equal');
  assert.equal(result.surrogatePairCount, 1);

  // Mixed string with text and emoji
  const mixedResult = calculateUnicodeBytes('Hello 🌍');
  assert.equal(mixedResult.characters, 7); // 'H','e','l','l','o',' ','🌍'
  assert.equal(mixedResult.utf16CodeUnits, 8); // 'Hello ' (6) + '🌍' (2)
  assert.equal(mixedResult.utf8Bytes, 10); // 6 + 4 = 10
  assert.equal(mixedResult.utf16Bytes, 16); // 8 * 2 = 16
  assert.equal(mixedResult.difference, -6);
  assert.equal(mixedResult.smallerEncoding, 'UTF-8');
});

test('unicodeBytes: optional BOM parameter adds 3 bytes to UTF-8 and 2 bytes to UTF-16', () => {
  const withBom = calculateUnicodeBytes('Hello', true);
  assert.equal(withBom.utf8Bytes, 8); // 5 + 3
  assert.equal(withBom.utf16Bytes, 12); // 10 + 2
  assert.equal(withBom.includeBom, true);
});

test('unicodeBytes: non-string and null inputs handled safely without throwing', () => {
  const nullRes = calculateUnicodeBytes(null);
  assert.equal(nullRes.characters, 0);
  assert.equal(nullRes.utf8Bytes, 0);

  const numRes = calculateUnicodeBytes(12345);
  assert.equal(numRes.characters, 5);
  assert.equal(numRes.utf8Bytes, 5);
});
