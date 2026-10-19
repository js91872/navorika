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
  assert.equal(walk(join(process.cwd(), 'src/app/(english)')).length, paths.length);
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

test('shared calculators have native controls, exact copy coverage and unchanged known results', async () => {
  const { localizedCalculatorSlugs } = await import('./calculatorRegistry');
  const { localizeBusinessCalculator } = await import('./businessLocalization');
  const { calculateLocalizedValues, calculatorTextFormatters, isIntegerCalculatorField } = await import('./sharedCalculators');
  const { businessCalculatorConfigs } = await import('../calculations/businessConfigs');
  const expected = [
    { totalBits: 49766400, totalBytes: 6220800, kib: 6075, mib: 5.933 },
    { usableStorageGb: 57.6, usableStorageMb: 58982.4, estimatedPhotos: 11796 },
    { dataPerViewKb: 1250, totalTransferKb: 12500000, totalTransferMb: 12207.03, totalTransferGb: 11.921 },
    { squareFeetEach: 300, totalSquareFeet: 300, squareYards: 300 / 9, squareMeters: 300 * 0.09290304 },
    { cubicFeet: 40, cubicYards: 40 / 27, orderCubicYards: (40 / 27) * 1.1, cubicMeters: 40 * 0.028316846592 },
    { orderArea: 2200, roofingSquares: 22, bundles: 66 },
    { rise: 6, rafterLengthNoOverhang: Math.sqrt(180), rafterLengthWithOverhang: Math.sqrt(211.25), roofAngle: Math.atan(0.5) * 180 / Math.PI },
    { baseStuds: 16, studsBeforeWaste: 20, totalStuds: 21 },
    { adjustedArea: 1100, containers: 3 },
    { halfSpan: 12, ridgeRise: 6, totalRidgeHeight: 14, rafterLength: Math.sqrt(180), roofAngle: Math.atan(0.5) * 180 / Math.PI },
    { orderLength: 132, materialCost: 594, laborCost: 960, removalDisposal: 150, totalCost: 1704, costPerFoot: 14.2 },
    { horizontalPpi: 300, verticalPpi: 300, effectivePpi: 300, megapixels: 7.2, aspectMatch: 'Matched' },
    { angleDegrees: 14.04, slopePercent: 25, rampLength: 49.48, riseRunRatio: '1 : 4.0' },
    { wasteQuantity: 100, orderQuantity: 1100, netMaterialCost: 2500, wasteCost: 250, totalMaterialCost: 2750 },
  ];
  for (const locale of locales) {
    const d = await getDictionary(locale);
    assert.deepEqual(Object.keys(d.calculatorUi).sort(), Object.keys(english.calculatorUi).sort());
    assert.deepEqual(Object.keys(d.calculators).sort(), [...localizedCalculatorSlugs].sort());
    for (const [key, value] of Object.entries(d.calculatorUi)) assert.notEqual(value, english.calculatorUi[key as keyof typeof english.calculatorUi]);
    for (const [index, slug] of localizedCalculatorSlugs.entries()) {
      const native = localizeBusinessCalculator(slug, d.calculators[slug], calculatorTextFormatters(slug, {}, d, locale));
      const source = businessCalculatorConfigs[slug];
      for (const field of native.fields) assert.notEqual(field.label, source.fields.find((item) => item.key === field.key)!.label);
      for (const row of native.results) assert.notEqual(row.label, source.results.find((item) => item.key === row.key)!.label);
      const defaults = Object.fromEntries(native.fields.map((field) => [field.key, field.defaultValue]));
      assert.deepEqual(calculateLocalizedValues(slug, defaults), expected[index], `${locale}/${slug}`);
      for (const invalid of ['', NaN, Infinity, -1, 1e20]) assert.equal(calculateLocalizedValues(slug, { ...defaults, [native.fields[0].key]: invalid }), null);
      const count = native.fields.find((field) => isIntegerCalculatorField(field.key));
      if (count) assert.equal(calculateLocalizedValues(slug, { ...defaults, [count.key]: 1.5 }), null);
    }
  }
});


test('native PPI and ramp status adapters cover mismatch, flat, vertical and null output', async () => {
  const { calculatorTextFormatters, calculateLocalizedValues, formatCalculatorNumber } = await import('./sharedCalculators');
  const { localizeBusinessCalculator } = await import('./businessLocalization');
  assert.throws(() => localizeBusinessCalculator('ppi-calculator', { ...english.calculators['ppi-calculator'], textResults: { aspectMatch: 'fallback-to-English' } }, { aspectMatch: () => 'unused' }), /Classify text output/);
  for (const locale of locales) {
    const d = await getDictionary(locale);
    assert.deepEqual(Object.keys(d.calculatorStates).sort(), Object.keys(english.calculatorStates).sort());
    const ppi = (printWidth: number) => calculatorTextFormatters('ppi-calculator', { widthPixels: 3000, heightPixels: 2400, printWidth, printHeight: 8 }, d, locale).aspectMatch('IGNORED_ENGLISH_ENGINE_TEXT');
    assert.equal(ppi(10), d.calculatorStates.matched);
    assert.equal(ppi(20), `${d.calculatorStates.mismatch} (~${new Intl.NumberFormat(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(50)}%)`);
    const ratio = (rise: number, run: number) => calculatorTextFormatters('shed-ramp-angle-calculator', { rise, run }, d, locale).riseRunRatio('IGNORED_ENGLISH_ENGINE_TEXT');
    assert.equal(ratio(0, 48), `${d.calculatorStates.flat} (0 : 1)`);
    assert.equal(ratio(0, 0), `${d.calculatorStates.flat} (0 : 1)`);
    assert.equal(ratio(12, 0), `${d.calculatorStates.vertical} (1 : 0)`);
    assert.equal(ratio(12, 48), `1 : ${new Intl.NumberFormat(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(4)}`);
    assert.deepEqual(calculateLocalizedValues('shed-ramp-angle-calculator', { rise: 12, run: 0 }), { angleDegrees: 90, slopePercent: null, rampLength: 12, riseRunRatio: 'Vertical (1 : 0)' });
    assert.equal(formatCalculatorNumber(null, 'percent', locale, d.calculatorUi.notApplicable), d.calculatorUi.notApplicable);
    assert.equal(formatCalculatorNumber(25, 'percent', locale, ''), new Intl.NumberFormat(locale, { style: 'percent', maximumFractionDigits: 3 }).format(0.25));
    assert.equal(formatCalculatorNumber(1704, 'currency', locale, ''), new Intl.NumberFormat(locale, { style: 'currency', currency: 'USD', currencyDisplay: 'code', maximumFractionDigits: 2 }).format(1704));
    assert.ok(calculateLocalizedValues('construction-material-waste-calculator', { netQuantity: 2.5, wastePercent: 12.5, unitCost: 4 }));
    assert.equal(calculateLocalizedValues('roofing-shingle-calculator', { roofArea: 20, wastePercent: 101, bundlesPerSquare: 3 }), null);
  }
});
