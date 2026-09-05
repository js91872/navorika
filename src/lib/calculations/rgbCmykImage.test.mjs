import test from 'node:test';
import assert from 'node:assert/strict';
import { inspectImageColorMode } from './rgbCmykImage.ts';

test('rgbCmykImage: detects standard 3-channel RGB JPEG header', () => {
  // Construct minimal JPEG header with SOF0 (3 components = RGB/YCbCr)
  const jpegHeader = new Uint8Array([
    0xff, 0xd8, 0xff, 0xe0, // SOI, APP0
    0x00, 0x10, // length 16
    0x4a, 0x46, 0x49, 0x46, 0x00, 0x01, 0x01, 0x01, 0x00, 0x48, 0x00, 0x48, 0x00, 0x00,
    0xff, 0xc0, // SOF0
    0x00, 0x11, // length 17
    0x08, // precision 8
    0x01, 0x00, // height 256
    0x01, 0x00, // width 256
    0x03, // components 3 (RGB/YCbCr)
    0x01, 0x11, 0x00, 0x02, 0x11, 0x01, 0x03, 0x11, 0x01,
  ]);

  const res = inspectImageColorMode(jpegHeader);
  assert.equal(res.valid, true);
  assert.equal(res.detectedFormat, 'JPEG');
  assert.equal(res.colorMode, 'RGB');
  assert.equal(res.channels, 3);
  assert.equal(res.width, 256);
  assert.equal(res.height, 256);
  assert.ok(res.sourceEncodingDetails.includes('3 components'));
});

test('rgbCmykImage: detects monochrome 1-channel Grayscale JPEG header', () => {
  const jpegHeader = new Uint8Array([
    0xff, 0xd8, 0xff, 0xc0, // SOI, SOF0
    0x00, 0x0b, // length 11
    0x08, // precision 8
    0x00, 0x80, // height 128
    0x00, 0x80, // width 128
    0x01, // components 1 (Grayscale)
    0x01, 0x11, 0x00,
  ]);

  const res = inspectImageColorMode(jpegHeader);
  assert.equal(res.valid, true);
  assert.equal(res.detectedFormat, 'JPEG');
  assert.equal(res.colorMode, 'Grayscale');
  assert.equal(res.channels, 1);
  assert.equal(res.width, 128);
  assert.equal(res.height, 128);
});

test('rgbCmykImage: detects 4-channel CMYK JPEG header with Adobe APP14 marker', () => {
  const jpegCmyk = new Uint8Array([
    0xff, 0xd8, // SOI
    0xff, 0xee, // APP14 (Adobe)
    0x00, 0x0e, // length 14
    0x41, 0x64, 0x6f, 0x62, 0x65, // "Adobe"
    0x00, 0x64, 0x00, 0x00, 0x00, 0x00,
    0x02, // transform = 2 (YCCK / CMYK)
    0xff, 0xc0, // SOF0
    0x00, 0x14, // length 20
    0x08, // precision 8
    0x02, 0x00, // height 512
    0x02, 0x00, // width 512
    0x04, // components 4 (CMYK)
    0x01, 0x11, 0x00, 0x02, 0x11, 0x01, 0x03, 0x11, 0x01, 0x04, 0x11, 0x00,
  ]);

  const res = inspectImageColorMode(jpegCmyk);
  assert.equal(res.valid, true);
  assert.equal(res.detectedFormat, 'JPEG');
  assert.equal(res.colorMode, 'CMYK');
  assert.equal(res.channels, 4);
  assert.equal(res.width, 512);
  assert.equal(res.height, 512);
  assert.ok(res.sourceEncodingDetails.includes('CMYK'));
});

test('rgbCmykImage: detects standard PNG color types', () => {
  // Construct minimal PNG header with IHDR: 800x600, 8-bit truecolor RGBA (colorType 6)
  const pngHeader = new Uint8Array([
    0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, // PNG signature
    0x00, 0x00, 0x00, 0x0d, // IHDR length 13
    0x49, 0x48, 0x44, 0x52, // "IHDR"
    0x00, 0x00, 0x03, 0x20, // width 800
    0x00, 0x00, 0x02, 0x58, // height 600
    0x08, // bit depth 8
    0x06, // color type 6 (Truecolor RGBA)
    0x00, 0x00, 0x00,
  ]);

  const res = inspectImageColorMode(pngHeader);
  assert.equal(res.valid, true);
  assert.equal(res.detectedFormat, 'PNG');
  assert.equal(res.colorMode, 'RGB');
  assert.equal(res.channels, 4);
  assert.equal(res.hasAlpha, true);
  assert.equal(res.width, 800);
  assert.equal(res.height, 600);
  assert.ok(res.limitations.includes('W3C PNG specification does NOT support CMYK'));
});

test('rgbCmykImage: detects TIFF CMYK separation (PhotometricInterpretation 5)', () => {
  // Minimal little-endian TIFF header
  // 49 49 2A 00 + offset to IFD at 8
  // IFD: 2 entries: Tag 0x0106 (Photometric = 5), Tag 0x0115 (SamplesPerPixel = 4)
  const tiff = new Uint8Array(64);
  tiff[0] = 0x49; tiff[1] = 0x49; tiff[2] = 0x2a; tiff[3] = 0x00; // LE header
  tiff[4] = 0x08; tiff[5] = 0x00; tiff[6] = 0x00; tiff[7] = 0x00; // IFD offset 8

  // IFD at offset 8:
  tiff[8] = 0x02; tiff[9] = 0x00; // 2 entries

  // Entry 1: Tag 0x0106 (PhotometricInterpretation), type SHORT (3), count 1, val 5 (CMYK)
  tiff[10] = 0x06; tiff[11] = 0x01; // tag 0x0106
  tiff[12] = 0x03; tiff[13] = 0x00; // SHORT
  tiff[14] = 0x01; tiff[15] = 0x00; tiff[16] = 0x00; tiff[17] = 0x00; // count 1
  tiff[18] = 0x05; tiff[19] = 0x00; // value = 5 (CMYK)

  // Entry 2: Tag 0x0115 (SamplesPerPixel), type SHORT (3), count 1, val 4
  tiff[22] = 0x15; tiff[23] = 0x01; // tag 0x0115
  tiff[24] = 0x03; tiff[25] = 0x00; // SHORT
  tiff[26] = 0x01; tiff[27] = 0x00; tiff[28] = 0x00; tiff[29] = 0x00; // count 1
  tiff[30] = 0x04; tiff[31] = 0x00; // value = 4

  const res = inspectImageColorMode(tiff);
  assert.equal(res.valid, true);
  assert.equal(res.detectedFormat, 'TIFF');
  assert.equal(res.colorMode, 'CMYK');
  assert.equal(res.channels, 4);
  assert.ok(res.limitations.includes('Native 4-channel CMYK TIFF'));
});

test('rgbCmykImage: rejects unknown formats and malformed byte sequences safely', () => {
  const shortBuf = new Uint8Array([1, 2, 3]);
  const resShort = inspectImageColorMode(shortBuf);
  assert.equal(resShort.valid, false);
  assert.ok(resShort.error);

  const unknown = new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]);
  const resUnknown = inspectImageColorMode(unknown);
  assert.equal(resUnknown.valid, false);
  assert.equal(resUnknown.colorMode, 'Not determinable from header');
  assert.ok(resUnknown.limitations.includes('Canvas pixel inspection cannot reveal original CMYK'));
});
