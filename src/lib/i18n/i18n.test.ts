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
  assert.equal(isTranslatedTool('pdf-bleed-trim-checker'), true);
});

test('every dictionary is complete, nonempty and contains translated tool content', async () => {
  for (const locale of locales) {
    const d = await getDictionary(locale);
    assert.deepEqual(Object.keys(d).sort(), Object.keys(english).sort(), locale);
    for (const section of ['ui', 'pdf', 'printSize', 'design'] as const) assert.deepEqual(Object.keys(d[section]).sort(), Object.keys(english[section]).sort(), `${locale}/${section}`);
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
    const text = [...Object.values(d.ui), ...Object.values(d.tools).flatMap((tool) => Object.values(tool)), ...Object.values(d.flexOptions), ...Object.values(d.pdf), ...Object.values(d.printSize), ...Object.values(d.design)];
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
  const allRoutes = walk(join(process.cwd(), 'src/app/(english)')).map((route) =>
    route.slice(join(process.cwd(), 'src/app/(english)').length + 1));
  const newRoutes = allRoutes.filter((route) => !paths.includes(route)).sort();
  // Explicitly approved public pages added after the original route contract.
  assert.deepEqual(newRoutes, [
    'guides/how-to-clean-phone-speaker/page.tsx',
    'guides/shopify-profit-margin-calculator/page.tsx',
    'tools/shopify-margin-calculator/page.tsx',
    'tools/speaker-dust-cleaning-sound/page.tsx',
  ]);
  assert.equal(new Set(allRoutes).size, allRoutes.length);
});

test('PDF reports translate every geometry interpretation and all report columns', async () => {
  const { analyzePageBoxes } = await import('../calculations/pdfBleedTrim');
  const { pdfReportRows, pdfInterpretation } = await import('./printReports');
  const mediaBox = { x: 0, y: 0, width: 612, height: 792 };
  const trimBox = { x: 9, y: 9, width: 594, height: 774 };
  const fixtures = [
    analyzePageBoxes({ mediaBox }, 1),
    analyzePageBoxes({ mediaBox, trimBox, isTrimBoxExplicit: true }, 2),
    analyzePageBoxes({ mediaBox, bleedBox: mediaBox, isBleedBoxExplicit: true }, 3),
    analyzePageBoxes({ mediaBox, trimBox, bleedBox: mediaBox, isTrimBoxExplicit: true, isBleedBoxExplicit: true }, 4),
    analyzePageBoxes({ mediaBox, trimBox, bleedBox: trimBox, isTrimBoxExplicit: true, isBleedBoxExplicit: true }, 5),
  ];
  for (const locale of locales) {
    const d = await getDictionary(locale);
    assert.deepEqual(fixtures.map((page) => pdfInterpretation(page, d)), [d.pdf.none, d.pdf.trimOnly, d.pdf.bleedOnly, d.pdf.extended, d.pdf.zero]);
    const rows = pdfReportRows(fixtures, d, locale);
    assert.equal(rows.length, 6);
    for (const row of rows) assert.equal(row.length, 13);
    assert.equal(rows[0][0], d.pdf.page);
    assert.equal(rows[1][9], d.ui.no);
    assert.equal(rows[4][9], d.ui.yes);
    assert.equal(rows[4][10], d.ui.yes);
    assert.equal(rows[4][5], new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(3.17));
    assert.doesNotMatch(JSON.stringify(rows), /Default configuration|Explicit bleed boxes|Invalid input/);
  }
});

test('CSS gradients validate code values and preserve standard coordinates', async () => {
  const { gradientCss } = await import('./designCalculations');
  assert.equal(gradientCss('#000000', '#ffffff', 90)?.css, 'background: linear-gradient(90deg, #000000, #ffffff);');
  assert.equal(gradientCss('#000000', '#ffffff', 0)?.background, 'linear-gradient(0deg, #000000, #ffffff)');
  for (const color of ['red', '#fff', '#000000;display:none', 'url(example)']) assert.equal(gradientCss(color, '#ffffff', 90), null);
  for (const angle of [NaN, Infinity, -1, 361]) assert.equal(gradientCss('#000000', '#ffffff', angle), null);
});

test('fluid font CSS reaches independent endpoints and interpolates between them', async () => {
  const { clampFontCss } = await import('./designCalculations');
  const result = clampFontCss(16, 48, 320, 1200)!;
  const values = result.clamp.match(/-?\d+(?:\.\d+)?/g)!.map(Number);
  const [minRem, interceptRem, vw, maxRem] = values;
  const atWidth = (width: number) => Math.min(maxRem * 16, Math.max(minRem * 16, interceptRem * 16 + vw * width / 100));
  for (const [width, expected] of [[200, 16], [320, 16], [760, 32], [1200, 48], [1600, 48]]) assert.ok(Math.abs(atWidth(width) - expected) < 0.001);
  assert.match(clampFontCss(16, 64, 320, 1200)!.clamp, /, -0\.090909rem \+/);
  for (const inputs of [[0, 48, 320, 1200], [16, 16, 320, 1200], [16, 48, 320, 320], [16, 513, 320, 1200], [16, 48, 1.5, 1200], [16, 48, 320, Infinity]]) {
    assert.equal(clampFontCss(...inputs as [number, number, number, number]), null);
  }
});

test('image scaling preserves the existing engine and rejects misleading zero-pixel output', async () => {
  const { scaledImage } = await import('./designCalculations');
  assert.deepEqual(scaledImage(1920, 1080, 50), { scaledWidth: 960, scaledHeight: 540, scaleFactor: 0.5, pixelAreaPercent: 25 });
  assert.deepEqual(scaledImage(1000, 500, 200), { scaledWidth: 2000, scaledHeight: 1000, scaleFactor: 2, pixelAreaPercent: 400 });
  assert.deepEqual(scaledImage(1000000, 1000000, 0.01), { scaledWidth: 100, scaledHeight: 100, scaleFactor: 0.0001, pixelAreaPercent: 0.000001 });
  for (const inputs of [[1, 1, 0.01], [1920, 1080, 0], [1920, 1080, 0.001], [1920, 1080, 10001], [1.5, 1080, 50], [1000001, 1080, 50], [NaN, 1080, 50]]) assert.equal(scaledImage(...inputs as [number, number, number]), null);
});
