import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import sitemap from '../src/app/sitemap.ts';
import { tools } from '../src/data/registry.ts';
import { guidesMetadata } from '../src/lib/guidesMetadata.ts';

const snapshot = JSON.parse(readFileSync('docs/seo-tool-route-baseline.json', 'utf8'));
const urls = sitemap().map((entry) => entry.url);
const BASE = 'https://navorika.com';

test('every pre-existing English tool slug still has its original page route', () => {
  assert.equal(snapshot.toolSlugs.length, 329, 'original route baseline should stay intact');
  for (const slug of snapshot.toolSlugs) {
    assert.ok(existsSync(`src/app/(english)/tools/${slug}/page.tsx`), `missing preserved route: /tools/${slug}`);
    assert.ok(tools.some((tool) => tool.slug === slug), `missing registry slug: ${slug}`);
  }
});

test('sitemap emits unique existing URLs, preserving self-canonical JSON/YAML pages', () => {
  assert.equal(new Set(urls).size, urls.length, 'duplicate URLs in sitemap');
  assert.ok(urls.includes(`${BASE}/tools/json-to-yaml-converter`));
  assert.ok(urls.includes(`${BASE}/tools/yaml-to-json-converter`));
  assert.ok(urls.includes(`${BASE}/tools/yaml-json-converter`));
  for (const guide of guidesMetadata) assert.ok(urls.includes(`${BASE}/guides/${guide.slug}`), guide.slug);
});

test('previous canonical decisions remain unchanged unless specifically reviewed', () => {
  const read = (slug) => readFileSync(`src/app/(english)/tools/${slug}/layout.tsx`, 'utf8');
  assert.match(read('epoch-time-converter'), /https:\/\/navorika.com\/tools\/unix-timestamp-converter/);
  assert.match(read('compress-image-to-20kb'), /https:\/\/navorika.com\/tools\/compress-image/);
  assert.match(read('compress-jpg-to-100kb'), /https:\/\/navorika.com\/tools\/compress-jpg/);
  assert.match(read('json-to-yaml-converter'), /createToolMetadata\(tool\)/);
  assert.match(read('yaml-to-json-converter'), /createToolMetadata\(tool\)/);
});
