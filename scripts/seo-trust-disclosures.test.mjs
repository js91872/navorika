import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const hub = readFileSync('src/components/tools/developer/DeveloperUtilsHub.tsx', 'utf8');

test('developer hub does not promise that every linked tool is browser-only', () => {
  assert.doesNotMatch(hub, /All developer utilities run entirely client-side/i);
  assert.doesNotMatch(hub, /100% In-Browser Privacy & Local Processing/i);
  assert.match(hub, /STEP-to-3D-PDF conversion uses temporary server processing/i);
});

test('server-based STEP conversion is disclosed next to its linked tool', () => {
  assert.match(hub, /slug === 'step-to-3d-pdf-converter'/);
  assert.match(hub, /Requires a file upload for temporary server conversion/);
});
