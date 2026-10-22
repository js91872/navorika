import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import { encodeGif } from './gifEncoder';
import { encodePngToIco } from './icoEncoder';

describe('ICO and GIF Encoders', () => {
  it('encodes genuine GIF89a files that decode in sharp', async () => {
    const width = 48;
    const height = 48;
    const rgba = new Uint8Array(width * height * 4);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const offset = (y * width + x) * 4;
        rgba[offset] = (x * 5) % 256;
        rgba[offset + 1] = (y * 5) % 256;
        rgba[offset + 2] = ((x + y) * 3) % 256;
        rgba[offset + 3] = 255;
      }
    }

    const gifBytes = encodeGif(width, height, rgba);

    // Verify binary signature
    assert.equal(String.fromCharCode(...gifBytes.subarray(0, 6)), 'GIF89a');

    // Verify logical screen descriptor
    const view = new DataView(gifBytes.buffer, gifBytes.byteOffset, gifBytes.byteLength);
    assert.equal(view.getUint16(6, true), width);
    assert.equal(view.getUint16(8, true), height);

    // Independent decoding with sharp
    const metadata = await sharp(gifBytes).metadata();
    assert.equal(metadata.format, 'gif');
    assert.equal(metadata.width, width);
    assert.equal(metadata.height, height);
  });

  it('encodes valid Windows ICO files with correct header, directory entry, and PNG payload', async () => {
    const width = 64;
    const height = 64;
    const pngBuffer = await sharp({
      create: {
        width,
        height,
        channels: 4,
        background: { r: 120, g: 80, b: 220, alpha: 1 },
      },
    })
      .png()
      .toBuffer();

    const icoBytes = encodePngToIco(pngBuffer, { width, height });

    // Verify binary layout
    const view = new DataView(icoBytes.buffer, icoBytes.byteOffset, icoBytes.byteLength);
    assert.equal(view.getUint16(0, true), 0, 'Reserved must be 0');
    assert.equal(view.getUint16(2, true), 1, 'Type must be 1 (ICO)');
    assert.equal(view.getUint16(4, true), 1, 'Image count must be 1');
    assert.equal(view.getUint8(6), width, 'Entry width must be 64');
    assert.equal(view.getUint8(7), height, 'Entry height must be 64');
    assert.equal(view.getUint8(8), 0, 'Color palette count');
    assert.equal(view.getUint8(9), 0, 'Reserved must be 0');
    assert.equal(view.getUint16(10, true), 1, 'Color planes must be 1');
    assert.equal(view.getUint16(12, true), 32, 'Bits per pixel must be 32');
    assert.equal(view.getUint32(14, true), pngBuffer.length, 'Payload length matches');
    assert.equal(view.getUint32(18, true), 22, 'Payload offset is 22');

    // Verify embedded PNG bytes
    const embeddedPng = icoBytes.subarray(22);
    assert.deepEqual(
      Array.from(embeddedPng.subarray(0, 8)),
      [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a],
      'Payload starts with PNG magic bytes'
    );

    // Independent decoding of inner PNG with sharp
    const meta = await sharp(embeddedPng).metadata();
    assert.equal(meta.format, 'png');
    assert.equal(meta.width, width);
    assert.equal(meta.height, height);
  });
});
