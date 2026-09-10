import type { Base64EncodeOptions, SupportedImageMime } from './types';

/**
 * Converts a Uint8Array into a Base64 string safely without call-stack overflow on large buffers.
 */
export function uint8ArrayToBase64(bytes: Uint8Array): string {
  // If running in Node.js test environment:
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(bytes).toString('base64');
  }

  // Browser chunked conversion to prevent RangeError: Maximum call stack size exceeded
  const chunkSize = 0x8000; // 32KB chunks
  let binary = '';
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    let chunkStr = '';
    for (let j = 0; j < chunk.length; j++) {
      chunkStr += String.fromCharCode(chunk[j]);
    }
    binary += chunkStr;
  }
  return btoa(binary);
}

/**
 * Wraps a base64 string every `wrapLength` characters (e.g. 76 chars for RFC 2045 standard).
 */
export function wrapBase64(str: string, wrapLength = 76): string {
  if (wrapLength <= 0 || str.length <= wrapLength) return str;
  const chunks: string[] = [];
  for (let i = 0; i < str.length; i += wrapLength) {
    chunks.push(str.slice(i, i + wrapLength));
  }
  return chunks.join('\n');
}

/**
 * Derives a MIME type from file extension if MIME type is missing or generic application/octet-stream.
 */
export function inferImageMimeType(filename: string, declaredMime?: string): SupportedImageMime | string {
  if (declaredMime && declaredMime !== 'application/octet-stream' && declaredMime.startsWith('image/')) {
    return declaredMime;
  }

  const ext = filename.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'webp':
      return 'image/webp';
    case 'gif':
      return 'image/gif';
    case 'svg':
      return 'image/svg+xml';
    default:
      return declaredMime || 'image/jpeg';
  }
}

/**
 * Builds a valid RFC 2397 Data URL from MIME type and raw Base64 data.
 */
export function buildDataUrl(mimeType: string, base64: string): string {
  return `data:${mimeType};base64,${base64}`;
}

/**
 * Encodes an ArrayBuffer or Uint8Array with options.
 */
export function encodeBytesToBase64(
  bytes: Uint8Array | ArrayBuffer,
  mimeType: string,
  options: Base64EncodeOptions = {}
): { base64: string; dataUrl: string } {
  const u8 = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let base64 = uint8ArrayToBase64(u8);
  const rawBase64 = base64;

  if (options.lineWrap && options.lineWrap > 0) {
    base64 = wrapBase64(base64, options.lineWrap);
  }

  const dataUrl = buildDataUrl(mimeType, rawBase64);
  return { base64, dataUrl };
}
