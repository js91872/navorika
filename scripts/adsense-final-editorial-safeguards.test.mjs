import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import test from 'node:test';

const read = path => readFileSync(new URL('../'+path,import.meta.url),'utf8');

test('translated timestamp tools share the validated seconds/milliseconds parser', () => {
  const localized = read('src/components/i18n/LocalizedDeveloperTools.tsx');
  assert.match(localized, /quickUnixTimestamp\(timestamp\)/);
  assert.doesNotMatch(localized, /length > 10/);
});

test('roof pitch guidance uses rise/run inputs rather than generic material inputs', () => {
  const construction = read('src/data/tool-pages/construction.ts');
  const roof = construction.split("'roof-pitch-calculator':")[1].split("'stair-stringer-calculator':")[0];
  assert.match(roof, /Enter the vertical rise and horizontal run/);
  assert.doesNotMatch(roof, /Adjust material, spacing/);
});

test('fertilizer guide heroes are distinct and their assets are committed', () => {
  const metadata=read('src/lib/guidesMetadata.ts');
  const sections=['how-to-calculate-fertilizer-for-a-lawn','fertilizer-npk-numbers-explained','how-to-calculate-fertilizer-from-a-soil-test'];
  const sources=sections.map(slug=>{
    const section=metadata.split("slug: '"+slug+"'")[1].split('featuredImage:')[1];
    return section.match(/src: '([^']+)'/)[1];
  });
  assert.equal(new Set(sources).size,3);
  for (const file of sources) assert.ok(read('public'+file).includes('<svg'));
});

test('every published guide has a unique local featured image', () => {
  const metadata = read('src/lib/guidesMetadata.ts');
  const positions = [...metadata.matchAll(/\bslug: '([^']+)'/g)];
  assert.ok(positions.length > 0, 'At least one published guide is required');
  const imagePaths = positions.map((entry, index) => {
    const section = metadata.slice(entry.index, positions[index + 1]?.index ?? metadata.length);
    const image = section.match(/featuredImage:\s*\{\s*src:\s*['"]([^'"]+)['"]/);
    assert.ok(image, `Missing feature image for ${entry[1]}`);
    assert.ok(existsSync(new URL('../public' + image[1], import.meta.url)), `Missing image asset: ${image[1]}`);
    return image[1];
  });
  assert.equal(new Set(imagePaths).size, imagePaths.length, 'Guide hero images must not repeat');
});

test('guide publication date does not exceed modified date for website audit', () => {
  const metadata=read('src/lib/guidesMetadata.ts');
  assert.match(metadata, /guide.slug === 'free-website-audit-checklist' \? '2026-10-11' : '2026-10-08'\)\)/);
});

test('preapproval privacy language does not claim an active ad partnership', () => {
  const privacy=read('src/app/(english)/privacy/page.tsx');
  assert.match(privacy,/We may use advertising services such as Google AdSense\./);
  assert.doesNotMatch(privacy,/partners with third-party advertising networks/);
});
