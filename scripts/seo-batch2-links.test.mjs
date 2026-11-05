import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = (path) => readFileSync(new URL('../' + path, import.meta.url), 'utf8');

test('tool editorial links exclude under-review and self-referencing recommendations', () => {
  const source = read('src/components/seo/ToolPageContent.tsx');
  assert.match(source, /!toolsUnderReview\.has\(slug\)/);
  assert.match(source, /slug !== tool\.slug/);
  assert.match(source, /new Set\(tool\.relatedGuides\)/);
});

test('legacy tool content removes duplicate and self links and formats full slugs', () => {
  const source = read('src/components/ToolContent.tsx');
  assert.match(source, /new Set\(relatedTools\)/);
  assert.match(source, /toolSlug !== slug/);
  assert.match(source, /replace\(\/\-\/g, ' '\)/);
});
