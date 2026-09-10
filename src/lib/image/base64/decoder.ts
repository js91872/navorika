import { inspectSvgSecurity, isSvgContent } from './security';
import type { Base64DecodeOptions, Base64DecodeResult, SupportedImageMime } from './types';

const DATA_URL_REGEX = /^data:([a-zA-Z0-9\/\-+.]+)?(?:;charset=[a-zA-Z0-9\-]+)?;base64,([\s\S]*)$/;
const BASE64_VALID_CHARS = /^[A-Za-z0-9+/]+={0,2}$/;

/**
 * Sniffs common image format magic bytes from a decoded Uint8Array.
 */
export function sniffImageFormat(bytes: Uint8Array): SupportedImageMime | null {
  if (bytes.length < 4) return null;

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) {
    return 'image/png';
  }

  // JPEG: FF D8 FF
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return 'image/jpeg';
  }

  // GIF: GIF87a or GIF89a (47 49 46 38)
  if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x38) {
    return 'image/gif';
  }

  // WebP: RIFF (52 49 46 46) ... WEBP (57 45 42 50)
  if (
    bytes.length >= 12 &&
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    return 'image/webp';
  }

  // Check for SVG markup
  if (isSvgContent(bytes)) {
    return 'image/svg+xml';
  }

  return null;
}

/**
 * Decodes a clean Base64 string into a Uint8Array.
 */
export function base64ToUint8Array(base64: string): Uint8Array {
  if (typeof Buffer !== 'undefined') {
    return new Uint8Array(Buffer.from(base64, 'base64'));
  }

  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Parses and decodes a Data URL or raw Base64 string.
 */
export function decodeBase64Image(input: string, options: Base64DecodeOptions = {}): Base64DecodeResult {
  const trimmed = input.trim();
  if (!trimmed) {
    return {
      success: false,
      error: 'Please enter or paste a Base64 string or Data URL.',
    };
  }

  let declaredMime: string | undefined;
  let rawPayload: string;

  const dataUrlMatch = trimmed.match(DATA_URL_REGEX);
  if (dataUrlMatch) {
    declaredMime = dataUrlMatch[1]?.toLowerCase() || undefined;
    rawPayload = dataUrlMatch[2];
  } else {
    rawPayload = trimmed;
  }

  // Clean whitespace, carriage returns, newlines
  const cleanBase64 = rawPayload.replace(/\s+/g, '');

  if (!cleanBase64) {
    return {
      success: false,
      error: 'The input Base64 data payload is empty.',
    };
  }

  // Check character validity
  if (!BASE64_VALID_CHARS.test(cleanBase64)) {
    return {
      success: false,
      error: 'Invalid Base64 characters detected. A valid Base64 string must only contain letters, numbers, "+", "/", and "=" padding.',
    };
  }

  let decodedBytes: Uint8Array;
  try {
    decodedBytes = base64ToUint8Array(cleanBase64);
  } catch (err) {
    return {
      success: false,
      error: `Base64 decoding failed: ${err instanceof Error ? err.message : 'Invalid encoding format'}.`,
    };
  }

  if (decodedBytes.length === 0) {
    return {
      success: false,
      error: 'The decoded byte sequence is empty (0 bytes).',
    };
  }

  // Sniff format from magic bytes
  const sniffedMime = sniffImageFormat(decodedBytes);
  const finalMime = sniffedMime || declaredMime || options.fallbackMime || 'image/png';

  const isSvg = finalMime === 'image/svg+xml' || isSvgContent(decodedBytes);

  let svgIsSafe = true;
  let securityNotice: string | undefined;

  if (isSvg) {
    const text = new TextDecoder('utf-8', { fatal: false }).decode(decodedBytes);
    const security = inspectSvgSecurity(text);
    if (!security.isSafe) {
      svgIsSafe = false;
      securityNotice = `Security Warning: This SVG contains active or potentially malicious constructs (${security.reasons.join('; ')}). Direct interactive preview is disabled for safety.`;
    }
  }

  const dataUrl = `data:${finalMime};base64,${cleanBase64}`;

  return {
    success: true,
    dataUrl,
    rawBase64: cleanBase64,
    mimeType: finalMime,
    byteSize: decodedBytes.length,
    isSvg,
    svgIsSafe,
    securityNotice,
  };
}
