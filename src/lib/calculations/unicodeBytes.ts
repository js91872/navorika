export type SmallerEncoding = 'UTF-8' | 'UTF-16' | 'Equal';

export interface UnicodeBytesResult {
  characters: number;
  utf16CodeUnits: number;
  utf8Bytes: number;
  utf16Bytes: number;
  difference: number;
  smallerEncoding: SmallerEncoding;
  asciiCount: number;
  bmpNonAsciiCount: number;
  surrogatePairCount: number;
  includeBom: boolean;
}

export function calculateUnicodeBytes(textInput?: unknown, includeBom: boolean = false): UnicodeBytesResult {
  const text = typeof textInput === 'string' ? textInput : (textInput !== null && textInput !== undefined ? String(textInput) : '');

  // 1. Unicode code points (spread iterates over code points, correctly handling surrogate pairs)
  const codePoints = [...text];
  const characters = codePoints.length;

  // 2. UTF-16 code units (native JS string length counts UTF-16 code units)
  const utf16CodeUnits = text.length;

  // 3. UTF-8 bytes using standards-compliant TextEncoder
  const encoder = new TextEncoder();
  const baseUtf8Bytes = encoder.encode(text).length;
  // UTF-8 BOM is 3 bytes (0xEF, 0xBB, 0xBF)
  const utf8Bytes = baseUtf8Bytes + (includeBom ? 3 : 0);

  // 4. UTF-16 bytes: 2 bytes per 16-bit code unit
  // UTF-16 BOM is 2 bytes (0xFEFF)
  const baseUtf16Bytes = utf16CodeUnits * 2;
  const utf16Bytes = baseUtf16Bytes + (includeBom ? 2 : 0);

  // 5. Byte difference (UTF-8 bytes - UTF-16 bytes)
  const difference = utf8Bytes - utf16Bytes;

  // 6. Smaller encoding comparison
  let smallerEncoding: SmallerEncoding = 'Equal';
  if (utf8Bytes < utf16Bytes) {
    smallerEncoding = 'UTF-8';
  } else if (utf16Bytes < utf8Bytes) {
    smallerEncoding = 'UTF-16';
  }

  // 7. Breakdown of code point ranges
  let asciiCount = 0;
  let bmpNonAsciiCount = 0;
  let surrogatePairCount = 0;

  for (const char of codePoints) {
    const cp = char.codePointAt(0) ?? 0;
    if (cp <= 0x7f) {
      asciiCount++;
    } else if (cp <= 0xffff) {
      bmpNonAsciiCount++;
    } else {
      surrogatePairCount++;
    }
  }

  return {
    characters,
    utf16CodeUnits,
    utf8Bytes,
    utf16Bytes,
    difference,
    smallerEncoding,
    asciiCount,
    bmpNonAsciiCount,
    surrogatePairCount,
    includeBom,
  };
}
