import test from 'node:test';
import assert from 'node:assert/strict';
import { addRecentTool, parseRecentTools, serializeRecentTools } from './recentTools.ts';

test('recent tools are deduplicated, bounded, and newest first', () => {
  let items = [];
  for (let index = 0; index < 10; index += 1) items = addRecentTool(items, `tool-${index}`, index);
  items = addRecentTool(items, 'tool-5', 99);
  assert.equal(items.length, 8);
  assert.deepEqual(items[0], { slug: 'tool-5', visitedAt: 99 });
});

test('storage parser rejects malformed or wrong-version data safely', () => {
  const validSlugs = new Set(['json-formatter']);
  assert.deepEqual(parseRecentTools('not json'), []);
  assert.deepEqual(parseRecentTools(JSON.stringify({ version: 999, items: [] })), []);
  const value = addRecentTool([], 'json-formatter', 123);
  assert.deepEqual(parseRecentTools(serializeRecentTools(value), validSlugs), value);
  assert.deepEqual(parseRecentTools(serializeRecentTools(addRecentTool(value, 'removed-tool', 456)), validSlugs), value);
});
