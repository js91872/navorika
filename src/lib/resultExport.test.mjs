import test from 'node:test';
import assert from 'node:assert/strict';
import { rowsToCsv, valueToJson } from './resultExport.ts';

test('CSV export quotes commas, quotes, and line breaks', () => {
  assert.equal(rowsToCsv([['a,b', 'say "hi"'], ['line\nbreak', 2]]), '"a,b","say ""hi"""\r\n"line\nbreak",2');
});

test('CSV export preserves Unicode and empty values', () => {
  assert.equal(rowsToCsv([['नाम', null, undefined, '']]), 'नाम,,,');
});

test('JSON export is readable', () => {
  assert.equal(valueToJson({ ok: true }), '{\n  "ok": true\n}');
});
