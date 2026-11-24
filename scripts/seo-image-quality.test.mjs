import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const src = readFileSync('src/components/tools/image/TargetCompressionTool.tsx', 'utf8');
const imageDocs = readFileSync('src/data/tool-pages/image.ts', 'utf8');

test('changing compression settings cannot leave an old result falsely marked compliant', () => {
  assert.ok(src.includes("setPngMode('preserve-png'); setResult(null);"));
  assert.ok(src.includes("setPngMode('format-shift'); setResult(null);"));
  assert.ok(src.includes("setPngShiftFormat(e.target.value as 'image/webp' | 'image/jpeg'); setResult(null);"));
  assert.ok(src.includes("setOutputFormat(fmt); setResult(null);"));
  assert.ok(src.includes("setPreserveDims(e.target.checked); setResult(null);"));
  assert.match(src, /result\.targetMet/);
});

test('compression guidance avoids universal passport and visual quality guarantees', () => {
  assert.doesNotMatch(imageDocs, /50 KB is the standard upper threshold for passport photos.*worldwide/);
  assert.doesNotMatch(imageDocs, /Most government and visa application systems mandate photos between 20 KB and 50 KB/);
  assert.doesNotMatch(imageDocs, /without perceptible visual degradation/);
});

test('image upload affordance has keyboard access', () => {
  assert.match(src, /onKeyDown=\{\(e\) =>/);
  assert.match(src, /tabIndex=\{0\}/);
});
