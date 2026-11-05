import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const src = readFileSync('src/components/tools/image/TargetCompressionTool.tsx', 'utf8');
const imageDocs = readFileSync('src/data/tool-pages/image.ts', 'utf8');

test('changing compression settings cannot leave an old result falsely marked compliant', () => {
  for (const setting of ['setPngMode', 'setPngShiftFormat', 'setOutputFormat', 'setPreserveDims']) {
    const section = src.slice(src.indexOf(setting + '('), src.indexOf(setting + '(') + 180);
    assert.match(section, /setResult\(null\)/, setting);
  }
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
