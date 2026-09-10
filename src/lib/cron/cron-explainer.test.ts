import test from 'node:test';
import assert from 'node:assert/strict';
import {
  parseAndAnalyzeCron,
  CRON_PRESETS,
} from './cron-explainer';

test('Cron: validates and explains standard expressions', () => {
  const result = parseAndAnalyzeCron('0 9 * * 1-5');
  assert.equal(result.valid, true);
  assert.equal(result.normalized, '0 9 * * 1-5');
  assert.ok(result.humanDescription.toLowerCase().includes('9:00'));
  assert.equal(result.fields.length, 5);
  assert.equal(result.fields.every((f) => f.valid), true);
  assert.equal(result.nextRuns.length, 5);
});

test('Cron: supports all common presets', () => {
  for (const preset of CRON_PRESETS) {
    const analysis = parseAndAnalyzeCron(preset.expression);
    assert.equal(analysis.valid, true, `Preset "${preset.label}" (${preset.expression}) failed validation`);
    assert.ok(analysis.humanDescription.length > 0);
    assert.equal(analysis.nextRuns.length, 5);
  }
});

test('Cron: rejects invalid expressions and reports field-specific errors', () => {
  // Minute out of range (65 > 59)
  const badMinute = parseAndAnalyzeCron('65 * * * *');
  assert.equal(badMinute.valid, false);
  assert.ok(badMinute.error?.includes('Minute'));

  // Hour out of range (25 > 23)
  const badHour = parseAndAnalyzeCron('0 25 * * *');
  assert.equal(badHour.valid, false);
  assert.ok(badHour.error?.includes('Hour'));

  // Day of month out of range (32 > 31)
  const badDom = parseAndAnalyzeCron('0 0 32 * *');
  assert.equal(badDom.valid, false);
  assert.ok(badDom.error?.includes('Day of Month'));

  // 6 fields: explain Linux vs Quartz/AWS
  const sixFields = parseAndAnalyzeCron('0 0 12 * * ?');
  assert.equal(sixFields.valid, false);
  assert.ok(sixFields.error?.includes('6 fields'));
  assert.ok(sixFields.dialectNote?.includes('Quartz'));

  // Empty expression
  const empty = parseAndAnalyzeCron('');
  assert.equal(empty.valid, false);
});

test('Cron: computes upcoming next runs correctly', () => {
  const analysis = parseAndAnalyzeCron('*/15 * * * *');
  assert.equal(analysis.valid, true);
  assert.equal(analysis.nextRuns.length, 5);

  const now = Date.now();
  for (let i = 0; i < analysis.nextRuns.length; i++) {
    const run = analysis.nextRuns[i];
    assert.ok(run.date.getTime() > now);
    if (i > 0) {
      assert.ok(run.date.getTime() > analysis.nextRuns[i - 1].date.getTime());
    }
  }
});
