/**
 * Zero-dependency Windows Icon (.ico) encoder.
 * Packages PNG image data into standard ICO binary format.
 */

export interface IcoEncodeOptions {
  width?: number;
  height?: number;
}

/**
 * Encodes PNG binary bytes into a valid Windows ICO file structure.
 * Complies with Microsoft Windows Icon Format Specification:
 * - 6-byte ICONDIR header (reserved=0, type=1, count=1)
 * - 16-byte ICONDIRENTRY (width, height, planes=1, bpp=32, size, offset=22)
 * - Raw PNG byte stream
 */
export function encodePngToIco(pngBytes: Uint8Array, options: IcoEncodeOptions = {}): Uint8Array {
  // Validate PNG signature: [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]
  if (
    pngBytes.length < 8 ||
    pngBytes[0] !== 0x89 ||
    pngBytes[1] !== 0x50 ||
    pngBytes[2] !== 0x4e ||
    pngBytes[3] !== 0x47 ||
    pngBytes[4] !== 0x0d ||
    pngBytes[5] !== 0x0a ||
    pngBytes[6] !== 0x1a ||
    pngBytes[7] !== 0x0a
  ) {
    throw new Error('Invalid PNG payload for ICO packaging');
  }

  // If width/height not provided, read from PNG IHDR chunk (bytes 16..23)
  let width = options.width;
  let height = options.height;
  if (!width || !height) {
    const pngView = new DataView(pngBytes.buffer, pngBytes.byteOffset, pngBytes.byteLength);
    width = width || pngView.getUint32(16, false); // IHDR width (BE)
    height = height || pngView.getUint32(20, false); // IHDR height (BE)
  }

  const headerSize = 6;
  const entrySize = 16;
  const payloadOffset = headerSize + entrySize; // 22 bytes
  const totalLength = payloadOffset + pngBytes.length;

  const icoBuffer = new Uint8Array(totalLength);
  const view = new DataView(icoBuffer.buffer);

  // 1. ICONDIR (6 bytes)
  view.setUint16(0, 0, true); // idReserved: must be 0
  view.setUint16(2, 1, true); // idType: 1 for icon (.ICO)
  view.setUint16(4, 1, true); // idCount: 1 image in file

  // 2. ICONDIRENTRY (16 bytes)
  view.setUint8(6, width >= 256 ? 0 : width); // bWidth (0 means 256)
  view.setUint8(7, height >= 256 ? 0 : height); // bHeight (0 means 256)
  view.setUint8(8, 0); // bColorCount: 0 if >=8bpp
  view.setUint8(9, 0); // bReserved: must be 0
  view.setUint16(10, 1, true); // wPlanes: 1 color plane
  view.setUint16(12, 32, true); // wBitCount: 32 bits per pixel
  view.setUint32(14, pngBytes.length, true); // dwBytesInRes: size of PNG payload
  view.setUint32(18, payloadOffset, true); // dwImageOffset: 22

  // 3. Payload
  icoBuffer.set(pngBytes, payloadOffset);

  return icoBuffer;
}
