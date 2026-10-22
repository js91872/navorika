/**
 * Lightweight, zero-dependency pure TypeScript GIF89a encoder.
 * Encodes RGBA pixel buffers into valid GIF89a binary files with
 * 256-color palette quantization, transparency support, and LZW compression.
 */

export interface GifOptions {
  transparent?: boolean;
}

/** Quantize RGBA pixels into 256-color RGB palette with optional transparent index. */
function quantizeRgba(
  rgba: Uint8Array | Uint8ClampedArray,
  width: number,
  height: number,
  transparent: boolean
): { palette: Uint8Array; indexedPixels: Uint8Array; transparentIndex: number } {
  const pixelCount = width * height;
  const indexedPixels = new Uint8Array(pixelCount);
  const palette = new Uint8Array(256 * 3); // 256 RGB triples

  // Map of 24-bit RGB -> palette index
  const colorMap = new Map<number, number>();
  let colorCount = 0;
  let transparentIndex = -1;

  if (transparent) {
    // Reserve index 0 for transparency
    transparentIndex = 0;
    palette[0] = 0;
    palette[1] = 0;
    palette[2] = 0;
    colorCount = 1;
  }

  // First pass: collect unique colors (or sample if too many)
  for (let i = 0; i < pixelCount; i++) {
    const offset = i * 4;
    const a = rgba[offset + 3];

    if (transparent && a < 128) {
      indexedPixels[i] = transparentIndex;
      continue;
    }

    const r = rgba[offset];
    const g = rgba[offset + 1];
    const b = rgba[offset + 2];
    const rgbKey = (r << 16) | (g << 8) | b;

    let index = colorMap.get(rgbKey);
    if (index === undefined) {
      if (colorCount < 256) {
        index = colorCount++;
        colorMap.set(rgbKey, index);
        palette[index * 3] = r;
        palette[index * 3 + 1] = g;
        palette[index * 3 + 2] = b;
      } else {
        // Fallback: approximate to nearest existing palette entry (quantize to 5-bit RGB)
        const qR = (r >> 3) << 3;
        const qG = (g >> 3) << 3;
        const qB = (b >> 3) << 3;
        const qKey = (qR << 16) | (qG << 8) | qB;
        index = colorMap.get(qKey);
        if (index === undefined) {
          // Find closest in palette
          let minDist = Infinity;
          let bestIdx = transparent ? 1 : 0;
          for (let p = bestIdx; p < colorCount; p++) {
            const pr = palette[p * 3];
            const pg = palette[p * 3 + 1];
            const pb = palette[p * 3 + 2];
            const dist = (r - pr) ** 2 + (g - pg) ** 2 + (b - pb) ** 2;
            if (dist < minDist) {
              minDist = dist;
              bestIdx = p;
            }
          }
          index = bestIdx;
        }
      }
    }
    indexedPixels[i] = index;
  }

  return { palette, indexedPixels, transparentIndex };
}

/** Bit-level stream writer for GIF LZW codes. */
class LzwWriter {
  private buffer: number[] = [];
  private subBlock: number[] = [];
  private curBit = 0;
  private curByte = 0;

  writeBits(val: number, bits: number) {
    for (let i = 0; i < bits; i++) {
      if ((val & (1 << i)) !== 0) {
        this.curByte |= 1 << this.curBit;
      }
      this.curBit++;
      if (this.curBit === 8) {
        this.pushSubByte(this.curByte);
        this.curByte = 0;
        this.curBit = 0;
      }
    }
  }

  private pushSubByte(b: number) {
    this.subBlock.push(b);
    if (this.subBlock.length === 254) {
      this.flushSubBlock();
    }
  }

  private flushSubBlock() {
    if (this.subBlock.length === 0) return;
    this.buffer.push(this.subBlock.length);
    for (const b of this.subBlock) {
      this.buffer.push(b);
    }
    this.subBlock = [];
  }

  end() {
    if (this.curBit > 0) {
      this.pushSubByte(this.curByte);
      this.curByte = 0;
      this.curBit = 0;
    }
    this.flushSubBlock();
    // Block terminator
    this.buffer.push(0x00);
    return new Uint8Array(this.buffer);
  }
}

/** Standard GIF LZW compression on indexed pixels. */
function lzwCompress(minCodeSize: number, pixels: Uint8Array): Uint8Array {
  const clearCode = 1 << minCodeSize; // 256 for 8-bit
  const eoiCode = clearCode + 1; // 257
  let codeSize = minCodeSize + 1; // starts at 9
  let nextCode = eoiCode + 1; // 258

  const writer = new LzwWriter();
  // Output clear code
  writer.writeBits(clearCode, codeSize);

  // Map string of indices to code
  const codeTable = new Map<number, number>();

  let prefix = pixels[0];

  for (let i = 1; i < pixels.length; i++) {
    const k = pixels[i];
    // Key packing: 12-bit prefix | 8-bit k
    const key = (prefix << 8) | k;
    const existingCode = codeTable.get(key);

    if (existingCode !== undefined) {
      prefix = existingCode;
    } else {
      writer.writeBits(prefix, codeSize);

      if (nextCode < 4096) {
        codeTable.set(key, nextCode++);
        if (nextCode > (1 << codeSize) && codeSize < 12) {
          codeSize++;
        }
      } else {
        // Reset code table
        writer.writeBits(clearCode, codeSize);
        codeTable.clear();
        codeSize = minCodeSize + 1;
        nextCode = eoiCode + 1;
      }
      prefix = k;
    }
  }

  writer.writeBits(prefix, codeSize);
  writer.writeBits(eoiCode, codeSize);
  return writer.end();
}

/**
 * Encodes RGBA pixel buffer into a valid GIF89a binary stream.
 */
export function encodeGif(
  width: number,
  height: number,
  rgba: Uint8Array | Uint8ClampedArray,
  options: GifOptions = {}
): Uint8Array {
  if (width <= 0 || height <= 0 || width > 65535 || height > 65535) {
    throw new Error('Invalid image dimensions for GIF encoding');
  }

  const { palette, indexedPixels, transparentIndex } = quantizeRgba(
    rgba,
    width,
    height,
    options.transparent ?? false
  );

  const minCodeSize = 8;
  const lzwData = lzwCompress(minCodeSize, indexedPixels);

  // Calculate total byte size:
  // Header (6) + LSD (7) + GCT (768) + GCE (8 if transparent) + ID (10) + 1 (minCodeSize) + lzwData + Trailer (1)
  const hasGce = transparentIndex >= 0;
  const gceSize = hasGce ? 8 : 0;
  const totalLength = 6 + 7 + 768 + gceSize + 10 + 1 + lzwData.length + 1;

  const output = new Uint8Array(totalLength);
  const view = new DataView(output.buffer);
  let pos = 0;

  // 1. Signature 'GIF89a'
  output[pos++] = 0x47; // G
  output[pos++] = 0x49; // I
  output[pos++] = 0x46; // F
  output[pos++] = 0x38; // 8
  output[pos++] = 0x39; // 9
  output[pos++] = 0x61; // a

  // 2. Logical Screen Descriptor
  view.setUint16(pos, width, true);
  pos += 2;
  view.setUint16(pos, height, true);
  pos += 2;
  output[pos++] = 0xf7; // GCT flag = 1, 8 bits/pixel, 256 colors
  output[pos++] = transparentIndex >= 0 ? transparentIndex : 0; // Background color index
  output[pos++] = 0; // Pixel aspect ratio

  // 3. Global Color Table (256 * 3 bytes)
  output.set(palette, pos);
  pos += 768;

  // 4. Graphic Control Extension (if transparent)
  if (hasGce) {
    output[pos++] = 0x21; // Extension introducer
    output[pos++] = 0xf9; // Graphic control label
    output[pos++] = 0x04; // Block size
    output[pos++] = 0x01; // Transparent color flag set
    output[pos++] = 0x00; // Delay time (low byte)
    output[pos++] = 0x00; // Delay time (high byte)
    output[pos++] = transparentIndex; // Transparent color index
    output[pos++] = 0x00; // Block terminator
  }

  // 5. Image Descriptor
  output[pos++] = 0x2c; // Image separator
  view.setUint16(pos, 0, true); // Left pos
  pos += 2;
  view.setUint16(pos, 0, true); // Top pos
  pos += 2;
  view.setUint16(pos, width, true); // Width
  pos += 2;
  view.setUint16(pos, height, true); // Height
  pos += 2;
  output[pos++] = 0x00; // No local color table, not interlaced

  // 6. LZW raster data
  output[pos++] = minCodeSize;
  output.set(lzwData, pos);
  pos += lzwData.length;

  // 7. Trailer
  output[pos++] = 0x3b; // Trailer ';'

  return output.subarray(0, pos);
}

/**
 * Encodes an HTMLCanvasElement into a genuine GIF Blob.
 */
export function encodeCanvasToGif(canvas: HTMLCanvasElement): Blob {
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context unavailable');
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const gifBytes = encodeGif(canvas.width, canvas.height, imgData.data, { transparent: true });
  return new Blob([gifBytes.buffer as ArrayBuffer], { type: 'image/gif' });
}
