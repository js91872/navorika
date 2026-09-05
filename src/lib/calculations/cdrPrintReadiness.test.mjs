import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateCdrPrintReadiness } from './cdrPrintReadiness.ts';

test('cdrPrintReadiness: all items confirmed yields READY FOR PRINT', () => {
  const res = calculateCdrPrintReadiness({
    documentSize: 'confirmed',
    bleed: 'confirmed',
    colorMode: 'confirmed',
    fonts: 'confirmed',
    imageResolution: 'confirmed',
    transparency: 'confirmed',
    overprint: 'confirmed',
  });

  assert.equal(res.valid, true);
  assert.equal(res.score, 100);
  assert.equal(res.readinessRating, 'READY FOR PRINT');
  assert.equal(res.passedCount, 7);
  assert.equal(res.reviewCount, 0);
  assert.equal(res.failedCount, 0);
  assert.equal(res.criticalIssues.length, 0);
  assert.ok(res.summaryText.includes('All 7 verified preflight criteria satisfied'));
});

test('cdrPrintReadiness: critical items missing triggers ACTION REQUIRED', () => {
  const res = calculateCdrPrintReadiness({
    documentSize: 'confirmed',
    bleed: 'missing', // critical
    colorMode: 'missing', // critical
    fonts: 'confirmed',
    imageResolution: 'confirmed',
    transparency: 'confirmed',
    overprint: 'confirmed',
  });

  assert.equal(res.valid, true);
  assert.equal(res.readinessRating, 'ACTION REQUIRED');
  assert.equal(res.failedCount, 2);
  assert.ok(res.criticalIssues.some((i) => i.includes('Bleed')));
  assert.ok(res.criticalIssues.some((i) => i.includes('Color Space')));
  assert.ok(res.summaryText.includes('Critical issues detected'));
});

test('cdrPrintReadiness: several items requiring review triggers REVIEW RECOMMENDED', () => {
  const res = calculateCdrPrintReadiness({
    documentSize: 'confirmed',
    bleed: 'confirmed',
    colorMode: 'confirmed',
    fonts: 'review',
    imageResolution: 'review',
    transparency: 'confirmed',
    overprint: 'review',
  });

  assert.equal(res.valid, true);
  assert.equal(res.readinessRating, 'REVIEW RECOMMENDED');
  assert.equal(res.passedCount, 4);
  assert.equal(res.reviewCount, 3);
  assert.equal(res.failedCount, 0);
  assert.equal(res.criticalIssues.length, 0);
  assert.ok(res.summaryText.includes('item(s) require review'));
});

test('cdrPrintReadiness: optional exportFormat is integrated into scoring', () => {
  const res = calculateCdrPrintReadiness({
    documentSize: 'confirmed',
    bleed: 'confirmed',
    colorMode: 'confirmed',
    fonts: 'confirmed',
    imageResolution: 'confirmed',
    transparency: 'confirmed',
    overprint: 'confirmed',
    exportFormat: 'confirmed',
  });

  assert.equal(res.checklist.length, 8);
  assert.equal(res.score, 100);
  assert.equal(res.passedCount, 8);
});

test('cdrPrintReadiness: handles invalid and non-string inputs gracefully', () => {
  const res = calculateCdrPrintReadiness({
    documentSize: null,
    bleed: undefined,
    colorMode: 12345,
    fonts: {},
    imageResolution: '',
    transparency: 'invalid-string',
    overprint: false,
  });

  assert.equal(res.valid, true);
  assert.equal(Number.isFinite(res.score), true);
  // Default fallback for unknown is 'review'
  assert.equal(res.reviewCount, 7);
  assert.equal(res.readinessRating, 'REVIEW RECOMMENDED');
});
