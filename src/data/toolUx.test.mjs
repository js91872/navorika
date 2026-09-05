import test from 'node:test';
import assert from 'node:assert/strict';
import { getPrivacyBadgeLabels, getToolCapabilities, toolUx } from './toolUx.ts';

test('capabilities default conservatively', () => {
  assert.deepEqual(getToolCapabilities('unknown-tool'), { processedLocally: false, noUpload: false, noAccount: false, worksOffline: false });
});

test('offline is never claimed without explicit verification', () => {
  const labels = getPrivacyBadgeLabels('json-formatter');
  assert.ok(labels.includes('Processed locally'));
  assert.ok(!labels.includes('Works offline'));
});

test('Phase 2A capabilities and result actions remain a controlled opt-in set', () => {
  assert.equal(Object.keys(toolUx).length, 53);
  assert.deepEqual(toolUx['cap-rate-calculator'].resultActions, ['copy-summary']);
  assert.deepEqual(toolUx['rental-property-cash-flow-calculator'].resultActions, ['copy-summary', 'download-csv', 'print']);
  assert.ok(Object.values(toolUx).every((config) => config.offlineVerified !== true));
});
