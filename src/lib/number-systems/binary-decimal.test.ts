import test from 'node:test';
import assert from 'node:assert/strict';
import { convertBinaryToDecimal } from './binary-decimal';

test('Binary to Decimal: converts 0', () => {
  const result = convertBinaryToDecimal('0');
  assert.equal(result.valid, true);
  assert.equal(result.decimalString, '0');
  assert.equal(result.bitCount, 1);
  assert.equal(result.setBitsCount, 0);
});

test('Binary to Decimal: converts 1', () => {
  const result = convertBinaryToDecimal('1');
  assert.equal(result.valid, true);
  assert.equal(result.decimalString, '1');
  assert.equal(result.bitCount, 1);
  assert.equal(result.setBitsCount, 1);
});

test('Binary to Decimal: converts 101101 to 45 with step-by-step expansion', () => {
  const result = convertBinaryToDecimal('101101');
  assert.equal(result.valid, true);
  assert.equal(result.decimalString, '45');
  assert.equal(result.bitCount, 6);
  assert.equal(result.setBitsCount, 4);

  // Check powers of 2 breakdown
  assert.equal(result.bitTable.length, 6);
  // Pos 5: bit 1 -> 32
  assert.equal(result.bitTable[0].powerValue, '32');
  assert.equal(result.bitTable[0].termResult, '32');
  // Pos 4: bit 0 -> 0
  assert.equal(result.bitTable[1].powerValue, '16');
  assert.equal(result.bitTable[1].termResult, '0');
  // Pos 3: bit 1 -> 8
  assert.equal(result.bitTable[2].termResult, '8');
  // Pos 2: bit 1 -> 4
  assert.equal(result.bitTable[3].termResult, '4');
  // Pos 1: bit 0 -> 0
  assert.equal(result.bitTable[4].termResult, '0');
  // Pos 0: bit 1 -> 1
  assert.equal(result.bitTable[5].termResult, '1');

  // Hex and Octal checks
  assert.equal(result.hexadecimal, '0x2D');
  assert.equal(result.octal, '0o55');
});

test('Binary to Decimal: converts large BigInt values beyond 53-bit Number.MAX_SAFE_INTEGER', () => {
  // 64 ones (2^64 - 1 = 18446744073709551615)
  const binary64 = '1'.repeat(64);
  const result = convertBinaryToDecimal(binary64);
  assert.equal(result.valid, true);
  assert.equal(result.decimalString, '18446744073709551615');
  assert.equal(result.bitCount, 64);
  assert.equal(result.setBitsCount, 64);
  assert.equal(result.hexadecimal, '0xFFFFFFFFFFFFFFFF');
});

test('Binary to Decimal: handles negative numbers, spaces, and 0b prefix', () => {
  const withPrefixAndSpaces = convertBinaryToDecimal('0b 1011 0101');
  assert.equal(withPrefixAndSpaces.valid, true);
  assert.equal(withPrefixAndSpaces.decimalString, '181');

  const negative = convertBinaryToDecimal('-101');
  assert.equal(negative.valid, true);
  assert.equal(negative.decimalString, '-5');
  assert.equal(negative.isNegative, true);
});

test('Binary to Decimal: rejects invalid input characters with clear errors', () => {
  const invalid = convertBinaryToDecimal('101201');
  assert.equal(invalid.valid, false);
  assert.ok(invalid.error?.includes('2'));

  const badChar = convertBinaryToDecimal('101a01');
  assert.equal(badChar.valid, false);

  const empty = convertBinaryToDecimal('');
  assert.equal(empty.valid, false);
});
