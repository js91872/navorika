import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { aspectRatio, flexCss, printDimensions } from './calculations';
import { isLocale, isTranslatedTool, languageAlternates, languageDirection, locales, localizedPath, translatedTools } from './config';
import english from './dictionaries/en.json';
import { getDictionary } from './dictionaries';

test('languages are explicitly allowed; prototype keys and unsupported locales are rejected', () => {
  for (const locale of locales) assert.equal(isLocale(locale), true);
  for (const locale of ['en', 'en-US', 'zh', '../fr', 'constructor', 'toString']) assert.equal(isLocale(locale), false);
  assert.equal(languageDirection('ar'), 'rtl');
  assert.equal(languageDirection('fr'), 'ltr');
  assert.equal(isTranslatedTool('pdf-bleed-trim-checker'), false);
});

test('every dictionary is complete, nonempty and contains translated tool content', async () => {
  for (const locale of locales) {
    const d = await getDictionary(locale);
    assert.deepEqual(Object.keys(d.ui).sort(), Object.keys(english.ui).sort(), locale);
    assert.deepEqual(Object.keys(d.tools).sort(), [...translatedTools].sort(), locale);
    for (const value of Object.values(d.ui)) assert.ok(value.trim().length > 0, locale);
    for (const slug of translatedTools) {
      assert.deepEqual(Object.keys(d.tools[slug]).sort(), Object.keys(english.tools[slug]).sort(), `${locale}/${slug}`);
      for (const [key, value] of Object.entries(d.tools[slug])) {
        assert.ok(value.trim().length > 0, `${locale}/${slug}/${key}`);
        assert.notEqual(value, english.tools[slug][key as keyof typeof english.tools[typeof slug]], `${locale}/${slug}/${key} is English`);
      }
    }
  }
});

test('language alternatives are reciprocal, self-referencing and preserve English URLs', () => {
  assert.equal(localizedPath('en'), '/');
  for (const slug of [undefined, ...translatedTools]) {
    const alternates = languageAlternates(slug);
    assert.equal(Object.keys(alternates).length, 9);
    assert.equal(alternates.en, `https://navorika.com${localizedPath('en', slug)}`);
    assert.equal(alternates['x-default'], alternates.en);
    for (const locale of locales) assert.equal(alternates[locale], `https://navorika.com${localizedPath(locale, slug)}`);
    if (slug) assert.equal(localizedPath('en', slug), `/tools/${slug}`);
  }
});

test('localized controls do not expose CSS keywords or previously untranslated English fragments', async () => {
  const fragments = /\b(?:row-reverse|column-reverse|flex-start|flex-end|space-between|space-around|space-evenly|nowrap|wrap-reverse|English|inch|padding|layout|justify-content|align-items)\b/i;
  for (const locale of locales) {
    const d = await getDictionary(locale);
    assert.deepEqual(Object.keys(d.flexOptions).sort(), Object.keys(english.flexOptions).sort(), locale);
    for (const [keyword, label] of Object.entries(d.flexOptions)) {
      assert.ok(label.trim(), `${locale}/${keyword}`);
      assert.notEqual(label, keyword, `${locale} exposes raw ${keyword}`);
      assert.notEqual(label, english.flexOptions[keyword as keyof typeof english.flexOptions], `${locale}/${keyword} uses English label`);
    }
    const text = [...Object.values(d.ui), ...Object.values(d.tools).flatMap((tool) => Object.values(tool)), ...Object.values(d.flexOptions)];
    for (const value of text) assert.equal(fragments.test(value), false, `${locale}: ${value}`);
  }
});

test('aspect ratios, megapixels and print dimensions match independent known examples', () => {
  assert.equal(aspectRatio(1920, 1080)?.padding, 56.25);
  assert.equal(aspectRatio(6000, 4000)?.megapixels, 24);
  assert.equal(aspectRatio(6000, 4000)?.pixels, 24000000);
  assert.equal(aspectRatio(100, 100)?.ratio, 1);
  assert.deepEqual(printDimensions(210, 297, 3), { width: 216, height: 303 });
  assert.deepEqual(printDimensions(8.5, 11, 0.125), { width: 8.75, height: 11.25 });
  assert.deepEqual(printDimensions(210, 297, 0), { width: 210, height: 297 });
});

test('invalid and extreme dimensions never generate plausible results', () => {
  for (const value of [NaN, Infinity, -Infinity, 0, -1, 1e10]) {
    assert.equal(aspectRatio(value, 100), null);
    assert.equal(aspectRatio(100, value), null);
  }
  for (const value of [NaN, Infinity, -1, 1e7]) assert.equal(printDimensions(210, 297, value), null);
});

test('Flexbox emits valid CSS keywords, zero gaps and rejects invalid input', () => {
  assert.equal(flexCss('row', 'center', 'stretch', 'wrap', 16), '.container {\n  display: flex;\n  flex-direction: row;\n  justify-content: center;\n  align-items: stretch;\n  flex-wrap: wrap;\n  gap: 16px;\n}');
  assert.match(flexCss('column-reverse', 'space-between', 'baseline', 'nowrap', 0)!, /gap: 0px/);
  assert.equal(flexCss('row; color:red', 'center', 'stretch', 'wrap', 16), null);
  assert.equal(flexCss('row', 'center', 'stretch', 'wrap', NaN), null);
});

test('moving English routes into a route group preserves every existing public page path', () => {
  // Snapshot taken from git HEAD before the migration, checked in as a route contract.
  const paths: string[] = JSON.parse(readFileSync(join(process.cwd(), 'scripts/english-route-contract.json'), 'utf8'));
  assert.ok(paths.length > 200);
  for (const path of paths) assert.ok(existsSync(join(process.cwd(), 'src/app/(english)', path)), path);
  const walk = (dir: string): string[] => readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory() ? walk(join(dir, entry.name)) : entry.name === 'page.tsx' ? [join(dir, entry.name)] : []);
  assert.equal(walk(join(process.cwd(), 'src/app/(english)')).length, paths.length);
});
