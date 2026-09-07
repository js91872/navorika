import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateBitrateFromSize,
  calculateSizeFromBitrate,
  convertToBytes,
  convertToBps,
  durationToSeconds,
  getAudioBitrateTier,
} from './audioBitrate.ts';

test('audio bitrate: convertToBytes converts decimal and binary units accurately', () => {
  assert.equal(convertToBytes(10, 'B'), 10);
  assert.equal(convertToBytes(10, 'KB'), 10000);
  assert.equal(convertToBytes(10, 'MB'), 10000000);
  assert.equal(convertToBytes(1, 'GB'), 1000000000);
  assert.equal(convertToBytes(1, 'KiB'), 1024);
  assert.equal(convertToBytes(1, 'MiB'), 1048576);
  assert.equal(convertToBytes(1, 'GiB'), 1073741824);
  assert.equal(convertToBytes(-5, 'MB'), 0);
  assert.equal(convertToBytes(NaN, 'MB'), 0);
});

test('audio bitrate: convertToBps converts standard bitrate units accurately', () => {
  assert.equal(convertToBps(192, 'kbps'), 192000);
  assert.equal(convertToBps(1.5, 'Mbps'), 1500000);
  assert.equal(convertToBps(1000, 'bps'), 1000);
  assert.equal(convertToBps(-128, 'kbps'), 0);
});

test('audio bitrate: durationToSeconds computes compound time safely', () => {
  assert.equal(durationToSeconds(1, 30, 15), 5415);
  assert.equal(durationToSeconds(0, 3, 45), 225);
  assert.equal(durationToSeconds(-1, -5, 10), 10);
  assert.equal(durationToSeconds(NaN, 0, 0), 0);
});

test('audio bitrate: Mode A calculates exact bitrate from size and duration', () => {
  // 10 MB in 416.666 seconds -> 192 kbps
  // 10 MB = 10,000,000 bytes = 80,000,000 bits. Over 400 seconds = 200,000 bps = 200 kbps
  const result = calculateBitrateFromSize({
    fileSizeValue: 10,
    fileSizeUnit: 'MB',
    durationSeconds: 400,
    channels: 2,
  });

  assert.ok(result);
  assert.equal(result.totalBytes, 10000000);
  assert.equal(result.totalBits, 80000000);
  assert.equal(result.bitrateBps, 200000);
  assert.equal(result.bitrateKbps, 200);
  assert.equal(result.bitrateMbps, 0.2);
  assert.equal(result.perChannelKbps, 100);
  assert.match(result.tierDescription, /High Quality Streaming/);
});

test('audio bitrate: Mode B calculates exact file size from bitrate and duration', () => {
  // 192 kbps for 300 seconds (5 minutes)
  // Total bits = 192,000 * 300 = 57,600,000 bits
  // Total bytes = 7,200,000 bytes = 7.2 MB (decimal) = ~6.866 MiB (binary)
  const result = calculateSizeFromBitrate({
    bitrateValue: 192,
    bitrateUnit: 'kbps',
    durationSeconds: 300,
  });

  assert.ok(result);
  assert.equal(result.totalBits, 57600000);
  assert.equal(result.totalBytes, 7200000);
  assert.equal(result.bytesDecimal.mb, 7.2);
  assert.equal(result.bytesBinary.mib, 6.866);
  assert.equal(result.sizePerMinuteMb, 1.44);
  assert.equal(result.sizePerHourMb, 86.4);
});

test('audio bitrate: boundary and zero duration returns null rather than NaN or Infinity', () => {
  assert.equal(
    calculateBitrateFromSize({
      fileSizeValue: 10,
      fileSizeUnit: 'MB',
      durationSeconds: 0,
    }),
    null
  );

  assert.equal(
    calculateBitrateFromSize({
      fileSizeValue: 0,
      fileSizeUnit: 'MB',
      durationSeconds: 100,
    }),
    null
  );

  assert.equal(
    calculateSizeFromBitrate({
      bitrateValue: 0,
      bitrateUnit: 'kbps',
      durationSeconds: 100,
    }),
    null
  );

  assert.equal(
    calculateSizeFromBitrate({
      bitrateValue: 192,
      bitrateUnit: 'kbps',
      durationSeconds: -50,
    }),
    null
  );
});

test('audio bitrate: non-finite inputs return null safely', () => {
  assert.equal(
    calculateBitrateFromSize({
      fileSizeValue: NaN,
      fileSizeUnit: 'MB',
      durationSeconds: Infinity,
    }),
    null
  );

  assert.equal(
    calculateSizeFromBitrate({
      bitrateValue: Infinity,
      bitrateUnit: 'kbps',
      durationSeconds: NaN,
    }),
    null
  );
});

test('audio bitrate: getAudioBitrateTier categorizes bitrates correctly', () => {
  assert.match(getAudioBitrateTier(64), /Voice Memo/);
  assert.match(getAudioBitrateTier(96), /Speech & Podcasts/);
  assert.match(getAudioBitrateTier(128), /FM Radio/);
  assert.match(getAudioBitrateTier(192), /High Quality Streaming/);
  assert.match(getAudioBitrateTier(256), /Very High Quality/);
  assert.match(getAudioBitrateTier(320), /Maximum MP3/);
});
