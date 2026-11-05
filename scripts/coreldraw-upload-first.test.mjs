import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = (path) => readFileSync(new URL('../' + path, import.meta.url), 'utf8');

test('CorelDRAW conversion shows upload and actions before longer notices', () => {
  const source = read('src/components/tools/coreldraw/CorelServerTool.tsx');
  const upload = source.indexOf('<CorelFileDropzone ');
  const action = source.indexOf('Create CorelDRAW-ready output');
  const notices = source.indexOf('<ServerPrivacyNotice />');
  const cdrNotice = source.indexOf('<NativeCdrNotice />');
  assert.ok(upload >= 0 && action > upload, 'Upload precedes conversion action');
  assert.ok(notices > action, 'Full privacy notice follows conversion and download actions');
  assert.ok(cdrNotice > action, 'Native format explanation follows conversion and download actions');
});

test('PDF-to-CDR related links follow the conversion form', () => {
  const source = read('src/app/(english)/tools/pdf-to-cdr-converter/page.tsx');
  assert.ok(source.indexOf('<CorelServerTool ') < source.indexOf('Related tools:'));
});
