export type DetectedColorMode =
  | 'CMYK'
  | 'RGB'
  | 'Grayscale'
  | 'Indexed (Palette)'
  | 'Not determinable from header';

export interface RgbCmykImageResult {
  valid: boolean;
  error?: string;
  detectedFormat: string;
  colorMode: DetectedColorMode;
  channels: number | null;
  hasAlpha: boolean;
  hasEmbeddedIcc: boolean;
  iccProfileDescription?: string;
  width?: number;
  height?: number;
  sourceEncodingDetails: string;
  limitations: string;
  [key: string]: any;
}

function readUint16BE(bytes: Uint8Array, offset: number): number {
  return (bytes[offset] << 8) | bytes[offset + 1];
}

function readUint32BE(bytes: Uint8Array, offset: number): number {
  return (
    ((bytes[offset] << 24) >>> 0) |
    (bytes[offset + 1] << 16) |
    (bytes[offset + 2] << 8) |
    bytes[offset + 3]
  ) >>> 0;
}

function readUint16LE(bytes: Uint8Array, offset: number): number {
  return bytes[offset] | (bytes[offset + 1] << 8);
}

function readUint32LE(bytes: Uint8Array, offset: number): number {
  return (
    bytes[offset] |
    (bytes[offset + 1] << 8) |
    (bytes[offset + 2] << 16) |
    ((bytes[offset + 3] << 24) >>> 0)
  ) >>> 0;
}

function matchesBytes(bytes: Uint8Array, offset: number, pattern: number[]): boolean {
  if (offset + pattern.length > bytes.length) return false;
  for (let i = 0; i < pattern.length; i++) {
    if (bytes[offset + i] !== pattern[i]) return false;
  }
  return true;
}

export function inspectImageColorMode(imageBuffer: Uint8Array | ArrayBuffer): RgbCmykImageResult {
  const bytes = imageBuffer instanceof Uint8Array ? imageBuffer : new Uint8Array(imageBuffer);

  if (!bytes || bytes.length < 12) {
    return {
      valid: false,
      error: 'Image file buffer is too small or empty.',
      detectedFormat: 'Unknown',
      colorMode: 'Not determinable from header',
      channels: null,
      hasAlpha: false,
      hasEmbeddedIcc: false,
      sourceEncodingDetails: 'Insufficient bytes to inspect headers.',
      limitations: 'At least 12 bytes required for image container signature detection.',
    };
  }

  // 1. JPEG Check: 0xFF, 0xD8, 0xFF
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    let offset = 2;
    let components: number | null = null;
    let hasEmbeddedIcc = false;
    let hasAdobeApp14 = false;
    let adobeTransform: number | null = null;
    let width = 0;
    let height = 0;

    while (offset < bytes.length - 4) {
      if (bytes[offset] !== 0xff) {
        offset++;
        continue;
      }

      const marker = bytes[offset + 1];
      if (marker === 0xd9) break; // EOI (End of Image)
      if (marker === 0xda) break; // SOS (Start of Scan - header ends here)

      // Skip fill bytes (0xFF 0xFF)
      if (marker === 0xff || marker === 0x00) {
        offset++;
        continue;
      }

      const len = readUint16BE(bytes, offset + 2);
      if (len < 2 || offset + 2 + len > bytes.length) break;

      // APP2 (0xE2) - Check for ICC_PROFILE
      if (marker === 0xe2 && len >= 14) {
        if (
          bytes[offset + 4] === 0x49 && // 'I'
          bytes[offset + 5] === 0x43 && // 'C'
          bytes[offset + 6] === 0x43 && // 'C'
          bytes[offset + 7] === 0x5f && // '_'
          bytes[offset + 8] === 0x50 // 'P'
        ) {
          hasEmbeddedIcc = true;
        }
      }

      // APP14 (0xEE) - Adobe color transform
      if (marker === 0xee && len >= 14) {
        if (
          bytes[offset + 4] === 0x41 && // 'A'
          bytes[offset + 5] === 0x64 && // 'd'
          bytes[offset + 6] === 0x6f && // 'o'
          bytes[offset + 7] === 0x62 && // 'b'
          bytes[offset + 8] === 0x65 // 'e'
        ) {
          hasAdobeApp14 = true;
          // transform is at offset + 15
          if (offset + 15 < bytes.length) {
            adobeTransform = bytes[offset + 15];
          }
        }
      }

      // SOF markers: SOF0 (0xC0), SOF1 (0xC1), SOF2 (0xC2), SOF3 (0xC3), SOF5 (0xC5), SOF6 (0xC6), SOF7 (0xC7), SOF9 (0xC9), SOF10 (0xCA), SOF11 (0xCB), SOF13 (0xCD), SOF14 (0xCE), SOF15 (0xCF)
      const isSof =
        (marker >= 0xc0 && marker <= 0xc3) ||
        (marker >= 0xc5 && marker <= 0xc7) ||
        (marker >= 0xc9 && marker <= 0xcb) ||
        (marker >= 0xcd && marker <= 0xcf);

      if (isSof && len >= 8) {
        height = readUint16BE(bytes, offset + 5);
        width = readUint16BE(bytes, offset + 7);
        components = bytes[offset + 9];
        break; // Once SOF is found, basic color space is determined
      }

      offset += 2 + len;
    }

    if (components === 1) {
      return {
        valid: true,
        detectedFormat: 'JPEG',
        colorMode: 'Grayscale',
        channels: 1,
        hasAlpha: false,
        hasEmbeddedIcc,
        width,
        height,
        sourceEncodingDetails: `JPEG SOF header: 1 component (Grayscale)${
          hasEmbeddedIcc ? ' with embedded ICC profile.' : '.'
        }`,
        limitations:
          'Monochrome JPEG. Standard single-channel luma channel; no color separations or alpha channel.',
      };
    }

    if (components === 4) {
      const isCmyk = hasAdobeApp14 ? adobeTransform === 0 || adobeTransform === 2 : true;
      const transformNote =
        adobeTransform === 2
          ? 'Adobe APP14 YCCK (inverts to 4-channel CMYK for commercial print)'
          : '4-channel CMYK';

      return {
        valid: true,
        detectedFormat: 'JPEG',
        colorMode: 'CMYK',
        channels: 4,
        hasAlpha: false,
        hasEmbeddedIcc,
        width,
        height,
        sourceEncodingDetails: `JPEG SOF header: 4 components (${transformNote})${
          hasEmbeddedIcc ? ' with embedded ICC profile.' : '.'
        }`,
        limitations:
          'Commercial CMYK JPEG. Web browsers typically display CMYK JPEGs with inverted or inaccurate colors because HTML standard requires RGB decoding. This file is intended for professional prepress workflows.',
      };
    }

    if (components === 3) {
      return {
        valid: true,
        detectedFormat: 'JPEG',
        colorMode: 'RGB',
        channels: 3,
        hasAlpha: false,
        hasEmbeddedIcc,
        width,
        height,
        sourceEncodingDetails: `JPEG SOF header: 3 components (standard YCbCr / RGB display)${
          hasEmbeddedIcc ? ' with embedded ICC profile.' : '.'
        }`,
        limitations:
          'Standard 3-channel RGB image. For commercial offset printing, RGB colors must be converted to CMYK separations.',
      };
    }

    return {
      valid: true,
      detectedFormat: 'JPEG',
      colorMode: 'Not determinable from header',
      channels: null,
      hasAlpha: false,
      hasEmbeddedIcc,
      sourceEncodingDetails: 'JPEG signature detected, but SOF frame was truncated or progressive scan reached early.',
      limitations: 'Header did not contain a complete baseline or progressive SOF marker in the scanned segment.',
    };
  }

  // 2. PNG Check: 0x89 0x50 0x4E 0x47 0x0D 0x0A 0x1A 0x0A
  if (
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a
  ) {
    if (bytes.length < 29) {
      return {
        valid: false,
        error: 'PNG file truncated before IHDR chunk.',
        detectedFormat: 'PNG',
        colorMode: 'Not determinable from header',
        channels: null,
        hasAlpha: false,
        hasEmbeddedIcc: false,
        sourceEncodingDetails: 'PNG header truncated.',
        limitations: 'Incomplete IHDR header.',
      };
    }

    const width = readUint32BE(bytes, 16);
    const height = readUint32BE(bytes, 20);
    const bitDepth = bytes[24];
    const colorType = bytes[25];

    // Scan for iCCP chunk (embedded profile)
    let hasEmbeddedIcc = false;
    let offset = 8;
    while (offset < bytes.length - 12) {
      const chunkLen = readUint32BE(bytes, offset);
      if (offset + 8 + chunkLen > bytes.length) break;
      const chunkName = String.fromCharCode(
        bytes[offset + 4],
        bytes[offset + 5],
        bytes[offset + 6],
        bytes[offset + 7]
      );
      if (chunkName === 'iCCP') {
        hasEmbeddedIcc = true;
        break;
      }
      if (chunkName === 'IEND') break;
      offset += 12 + chunkLen;
    }

    let mode: DetectedColorMode = 'RGB';
    let channels: number | null = 3;
    let hasAlpha = false;

    switch (colorType) {
      case 0:
        mode = 'Grayscale';
        channels = 1;
        break;
      case 2:
        mode = 'RGB';
        channels = 3;
        break;
      case 3:
        mode = 'Indexed (Palette)';
        channels = 1;
        break;
      case 4:
        mode = 'Grayscale';
        channels = 2;
        hasAlpha = true;
        break;
      case 6:
        mode = 'RGB';
        channels = 4;
        hasAlpha = true;
        break;
      default:
        mode = 'Not determinable from header';
        channels = null;
    }

    return {
      valid: true,
      detectedFormat: 'PNG',
      colorMode: mode,
      channels,
      hasAlpha,
      hasEmbeddedIcc,
      width,
      height,
      sourceEncodingDetails: `PNG IHDR header: Color type ${colorType} (${mode}${
        hasAlpha ? ' with Alpha' : ''
      }, ${bitDepth}-bit depth)${hasEmbeddedIcc ? ' with iCCP profile chunk.' : '.'}`,
      limitations:
        'The official W3C PNG specification does NOT support CMYK color space. PNG images are fundamentally RGB, Grayscale, or Indexed.',
    };
  }

  // 3. TIFF Check: 'II\x2A\x00' (little-endian) or 'MM\x00\x2A' (big-endian)
  const isLeTiff = bytes[0] === 0x49 && bytes[1] === 0x49 && bytes[2] === 0x2a && bytes[3] === 0x00;
  const isBeTiff = bytes[0] === 0x4d && bytes[1] === 0x4d && bytes[2] === 0x00 && bytes[3] === 0x2a;

  if (isLeTiff || isBeTiff) {
    const isLe = isLeTiff;
    const readU16 = isLe ? readUint16LE : readUint16BE;
    const readU32 = isLe ? readUint32LE : readUint32BE;

    const ifdOffset = readU32(bytes, 4);
    if (ifdOffset >= bytes.length - 2) {
      return {
        valid: true,
        detectedFormat: 'TIFF',
        colorMode: 'Not determinable from header',
        channels: null,
        hasAlpha: false,
        hasEmbeddedIcc: false,
        sourceEncodingDetails: 'TIFF signature valid, but IFD offset extends beyond scanned segment.',
        limitations: 'TIFF header requires larger buffer segment.',
      };
    }

    const numEntries = readU16(bytes, ifdOffset);
    let photometric: number | null = null;
    let samplesPerPixel: number | null = null;
    let hasEmbeddedIcc = false;

    let entryOffset = ifdOffset + 2;
    for (let i = 0; i < numEntries && entryOffset < bytes.length - 12; i++) {
      const tag = readU16(bytes, entryOffset);
      const valOffset = entryOffset + 8;

      if (tag === 0x0106) {
        // PhotometricInterpretation
        photometric = readU16(bytes, valOffset);
      } else if (tag === 0x0115) {
        // SamplesPerPixel
        samplesPerPixel = readU16(bytes, valOffset);
      } else if (tag === 0x8773) {
        // InterColorProfile (ICC)
        hasEmbeddedIcc = true;
      }
      entryOffset += 12;
    }

    let colorMode: DetectedColorMode = 'RGB';
    let sourceDetails = '';

    if (photometric === 5) {
      colorMode = 'CMYK';
      sourceDetails = 'TIFF PhotometricInterpretation tag 5 (Separated / CMYK). Native print separations.';
    } else if (photometric === 0 || photometric === 1) {
      colorMode = 'Grayscale';
      sourceDetails = `TIFF PhotometricInterpretation tag ${photometric} (${
        photometric === 0 ? 'WhiteIsZero' : 'BlackIsZero'
      } Grayscale).`;
    } else if (photometric === 2) {
      colorMode = 'RGB';
      sourceDetails = 'TIFF PhotometricInterpretation tag 2 (RGB Full Color).';
    } else if (photometric === 3) {
      colorMode = 'Indexed (Palette)';
      sourceDetails = 'TIFF PhotometricInterpretation tag 3 (Color map indexed palette).';
    } else {
      colorMode = samplesPerPixel === 4 ? 'CMYK' : 'RGB';
      sourceDetails = `TIFF header: SamplesPerPixel = ${samplesPerPixel ?? 'unknown'}.`;
    }

    return {
      valid: true,
      detectedFormat: 'TIFF',
      colorMode,
      channels: samplesPerPixel ?? (colorMode === 'CMYK' ? 4 : 3),
      hasAlpha: samplesPerPixel === 4 && colorMode === 'RGB',
      hasEmbeddedIcc,
      sourceEncodingDetails: `${sourceDetails}${hasEmbeddedIcc ? ' Embedded ICC profile tag present.' : ''}`,
      limitations:
        colorMode === 'CMYK'
          ? 'Native 4-channel CMYK TIFF. Ideal for commercial prepress and offset printing.'
          : 'TIFF in RGB/Grayscale. Must be separated to CMYK before platemaking.',
    };
  }

  // 4. WebP Check: 'RIFF....WEBP'
  if (
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    let hasAlpha = false;
    let hasEmbeddedIcc = false;

    // Check for VP8X chunk
    if (bytes.length >= 30 && matchesBytes(bytes, 12, [0x56, 0x50, 0x38, 0x58])) {
      const flags = bytes[20];
      hasEmbeddedIcc = Boolean(flags & 0x20); // bit 5
      hasAlpha = Boolean(flags & 0x10); // bit 4
    }

    return {
      valid: true,
      detectedFormat: 'WebP',
      colorMode: 'RGB',
      channels: hasAlpha ? 4 : 3,
      hasAlpha,
      hasEmbeddedIcc,
      sourceEncodingDetails: `WebP container (RGB raster format)${
        hasAlpha ? ' with Alpha channel' : ''
      }${hasEmbeddedIcc ? ' and embedded ICC profile.' : '.'}`,
      limitations:
        'The WebP format is exclusively an RGB/YUV web delivery format. Commercial CMYK print output is not supported by the WebP specification.',
    };
  }

  // 5. GIF Check: GIF87a or GIF89a
  if (
    bytes[0] === 0x47 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x38 &&
    (bytes[4] === 0x37 || bytes[4] === 0x39) &&
    bytes[5] === 0x61
  ) {
    return {
      valid: true,
      detectedFormat: 'GIF',
      colorMode: 'Indexed (Palette)',
      channels: 1,
      hasAlpha: bytes[4] === 0x39, // GIF89a supports transparent index
      hasEmbeddedIcc: false,
      sourceEncodingDetails: `GIF${String.fromCharCode(bytes[4], bytes[5])} standard 8-bit indexed palette.`,
      limitations:
        'GIF uses an 8-bit indexed color palette (up to 256 colors). It does not support 24-bit RGB or commercial CMYK.',
    };
  }

  return {
    valid: false,
    error: 'Unrecognized image container signature.',
    detectedFormat: 'Unknown or unsupported format',
    colorMode: 'Not determinable from header',
    channels: null,
    hasAlpha: false,
    hasEmbeddedIcc: false,
    sourceEncodingDetails: 'Header did not match supported image signatures (JPEG, PNG, TIFF, WebP, GIF).',
    limitations:
      'Only original JPEG, PNG, TIFF, WebP, and GIF file headers can be audited for native color space. Canvas pixel inspection cannot reveal original CMYK encodings.',
  };
}
