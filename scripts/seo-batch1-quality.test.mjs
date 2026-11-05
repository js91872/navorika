import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = (path) => readFileSync(new URL('../' + path, import.meta.url), 'utf8');

test('sitewide SEO descriptions do not claim stale counts or universal browser-only processing', () => {
  for (const path of ['src/lib/seo/schema.ts', 'src/components/seo/SEO.tsx']) {
    const source = read(path);
    assert.doesNotMatch(source, /100\+ free online/i, path);
    assert.doesNotMatch(source, /100% client-side, no uploads/i, path);
  }
});

test('shared editorial templates avoid repeating full tool names in section headings', () => {
  for (const path of ['src/components/seo/ToolPageContent.tsx', 'src/components/ToolContent.tsx']) {
    const source = read(path);
    assert.doesNotMatch(source, /(?:What is|How to use|How) \{displayName\}/, path);
    assert.doesNotMatch(source, /\{displayName\} (?:result means|limitations)/, path);
    assert.match(source, /Frequently asked questions|Frequently Asked Questions/, path);
  }
});

test('home and category counts are computed from active registry tools', () => {
  const home = read('src/app/(english)/page.tsx');
  const categories = read('src/app/(english)/categories/page.tsx');
  assert.match(home, /tools\.filter\(\(tool\) => !toolsUnderReview\.has\(tool\.slug\)\)/);
  assert.match(categories, /tools\.filter\(\(tool\) => !toolsUnderReview\.has\(tool\.slug\)\)/);
  assert.match(home, /activeTools\.length/);
  assert.match(categories, /activeTools\.length/);
});
