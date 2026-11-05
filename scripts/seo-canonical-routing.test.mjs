import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

// Dedicated directional conversion pages must not accidentally canonicalize to
// the older bidirectional converter without an explicit consolidation decision.
test('JSON-to-YAML has a self-canonical tool metadata declaration', () => {
  const source = readFileSync('src/app/(english)/tools/json-to-yaml-converter/layout.tsx', 'utf8');
  assert.match(source, /createToolMetadata\(tool\)/);
  assert.doesNotMatch(source, /createToolMetadata\(tool,\s*['"`]/);
});

test('YAML-to-JSON has a self-canonical tool metadata declaration', () => {
  const source = readFileSync('src/app/(english)/tools/yaml-to-json-converter/layout.tsx', 'utf8');
  assert.match(source, /createToolMetadata\(tool\)/);
  assert.doesNotMatch(source, /createToolMetadata\(tool,\s*['"`]/);
});
