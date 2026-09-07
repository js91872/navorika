import test from 'node:test';
import assert from 'node:assert/strict';
import {
  extractFileExtension,
  validateMediaFile,
  generateOutputFilename,
  formatFileSize,
  MAX_SAFE_BROWSER_FILE_SIZE_BYTES,
  LARGE_FILE_WARNING_BYTES,
} from './validation.ts';

test('media validation: extractFileExtension extracts lowercase extension accurately', () => {
  assert.equal(extractFileExtension('video.MP4'), 'mp4');
  assert.equal(extractFileExtension('my.archive.song.wav'), 'wav');
  assert.equal(extractFileExtension('noextension'), '');
});

test('media validation: formatFileSize formats bytes into readable units', () => {
  assert.equal(formatFileSize(500), '500 B');
  assert.equal(formatFileSize(2048), '2.0 KB');
  assert.equal(formatFileSize(10 * 1024 * 1024), '10.00 MB');
  assert.equal(formatFileSize(2 * 1024 * 1024 * 1024), '2.00 GB');
  assert.equal(formatFileSize(-1), '0 B');
});

test('media validation: generateOutputFilename sanitizes and preserves base name', () => {
  assert.equal(generateOutputFilename('My Video 2026.mp4', 'mp3'), 'My_Video_2026.mp3');
  assert.equal(generateOutputFilename('track [official audio].wav', 'mp3'), 'track_official_audio_.mp3');
  assert.equal(generateOutputFilename('simple.m4a', 'wav'), 'simple.wav');
});

test('media validation: validateMediaFile rejects empty and oversized files', () => {
  const emptyFile = { name: 'test.mp4', size: 0, type: 'video/mp4' };
  const emptyRes = validateMediaFile(emptyFile, ['mp4']);
  assert.equal(emptyRes.valid, false);
  assert.match(emptyRes.error, /empty/i);

  const giantFile = { name: 'huge.mp4', size: MAX_SAFE_BROWSER_FILE_SIZE_BYTES + 1, type: 'video/mp4' };
  const giantRes = validateMediaFile(giantFile, ['mp4']);
  assert.equal(giantRes.valid, false);
  assert.match(giantRes.error, /exceeds the safe browser/i);
});

test('media validation: validateMediaFile issues warning for files over 200 MB', () => {
  const largeFile = { name: 'clip.mp4', size: LARGE_FILE_WARNING_BYTES + 1024, type: 'video/mp4' };
  const res = validateMediaFile(largeFile, ['mp4']);
  assert.equal(res.valid, true);
  assert.ok(res.warning);
  assert.match(res.warning, /large file/i);
});

test('media validation: validateMediaFile checks allowed formats accurately', () => {
  const mp4File = { name: 'clip.mp4', size: 1024 * 1024, type: 'video/mp4' };
  assert.equal(validateMediaFile(mp4File, ['mp4']).valid, true);
  assert.equal(validateMediaFile(mp4File, ['wav']).valid, false);

  const webmFile = { name: 'clip.webm', size: 1024 * 1024, type: 'video/webm' };
  assert.equal(validateMediaFile(webmFile, ['webm']).valid, true);

  const movFile = { name: 'clip.mov', size: 1024 * 1024, type: 'video/quicktime' };
  assert.equal(validateMediaFile(movFile, ['mov']).valid, true);

  const wildVideo = { name: 'clip.mkv', size: 1024 * 1024, type: 'video/x-matroska' };
  assert.equal(validateMediaFile(wildVideo, ['video/*']).valid, true);
});
