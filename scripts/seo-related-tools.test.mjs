import test from 'node:test';
import assert from 'node:assert/strict';
import { getRelatedTools } from '../src/data/taxonomy.ts';

test('curated JSON/YAML recommendations exclude unrelated developer tools', () => {
  const recommended = getRelatedTools('json-to-yaml-converter', 10, [
    'yaml-to-json-converter',
    'json-to-toml-converter',
    'yaml-validator',
    'json-formatter',
  ]).map((tool) => tool.slug);
  assert.ok(recommended.includes('yaml-to-json-converter'));
  assert.ok(recommended.includes('json-to-toml-converter'));
  assert.ok(recommended.includes('yaml-validator'));
  assert.ok(!recommended.includes('ai-video-prompt-generator'));
  assert.equal(new Set(recommended).size, recommended.length);
});

test('related tools still have a fallback when no curated recommendations exist', () => {
  const recommended = getRelatedTools('uuid-generator', 4);
  assert.ok(recommended.length > 0);
  assert.ok(recommended.length <= 4);
  assert.ok(recommended.every((tool) => tool.slug !== 'uuid-generator'));
});
