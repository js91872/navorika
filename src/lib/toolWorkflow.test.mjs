import test from 'node:test';
import assert from 'node:assert/strict';
import { buildWorkflowItems } from './toolWorkflow.ts';

const tools = [{ slug: 'source', title: 'Source' }, { slug: 'roof', title: 'Roof Area Calculator' }, { slug: 'rebar', title: 'Rebar Calculator' }];

test('workflow items remove self-links, duplicates, and unknown tools', () => {
  assert.deepEqual(buildWorkflowItems('source', ['source', 'roof', 'roof', 'missing', 'rebar'], tools).map(({ slug }) => slug), ['roof', 'rebar']);
});

test('workflow labels are contextual with title fallback and a stable limit', () => {
  const items = buildWorkflowItems('source', ['roof', 'rebar'], tools, { roof: 'Calculate roofing area', rebar: '   ' }, 1);
  assert.deepEqual(items, [{ slug: 'roof', title: 'Roof Area Calculator', label: 'Calculate roofing area' }]);
});
