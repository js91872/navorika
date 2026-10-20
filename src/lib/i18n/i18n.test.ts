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
    { soffitArea: 240, soffitAreaWithWaste: 264, soffitPieces: 22, fasciaLengthWithWaste: 132, fasciaBoards: 11 },
    { grossProjectCost: 2700, netProjectCost: 2700, annualSavings: 216, monthlySavings: 18, paybackYears: 12.5 },
    { lineLoad: 53.3333, momentOfInertia: 98.9316, deflection: 0.1572, l360Limit: 0.4, ratio: 'L / 916' },
    { ductArea: 0.3491, cfm: 244.35 },
    { baseVolumeFt3: 2.5, adjustedVolumeFt3: 2.75, cubicYards: 0.102, cubicMeters: 0.078, premixBags: 5, cementBags94lb: 1, sandTons: 0.12 },
    { netWallAreaFt2: 220, exactBlocks: 247.5, purchaseBlocks: 273, mortarBags80lb: 56, coreFillGroutYards: 1.67 },
    { annualYieldGallons: 39377, annualYieldLiters: 149058, monthlyAverageGallons: 3281, recommendedTankGallons: 2266, recommendedTankLiters: 8578 },
    { humanEquivalent: 39, lifeStage: 'Mature Adult' },
    { estimatedAdultWeight: 30, lowEstimate: 27, highEstimate: 33, growthProgress: 50 },
    { rer: 216.3, dailyCalories: 260 },
    { remainingMg: 87.1, remainingPercent: 43.5, eliminatedMg: 112.9 },
    { absoluteDifference: -7, percentDeviation: -12.7, ratio: 0.87, direction: 'Below baseline' },
    { dotsScore: 387.96, wilksScore: 383.04, totalBodyweightRatio: 6.67 },
    { proteinGrams: 165, proteinCalories: 660, carbGrams: 220, carbCalories: 880, fatGrams: 73, fatCalories: 660, proteinPerKgBodyweight: 2.2 },
    { pacePerKm: '4:59 /km', pacePerMile: '8:01 /mi', speedKmh: 12.06, speedMph: 7.49, equivalent5kTime: '22:50', equivalent10kTime: '47:35', equivalentMarathonTime: '3:38:55' },
    { totalWaterLiters: 2.98, totalFluidOunces: 100.8, standardCups8oz: 12.6, baselineLiters: 2.45, exerciseAdditionLiters: 0.53 },
    { estimated1rm: 115, epleyEstimate: 117, brzyckiEstimate: 113, landerEstimate: 114, rep95Percent: 109, rep90Percent: 104, rep85Percent: 98, rep80Percent: 92, rep70Percent: 81 },
    { grossIncome: 2600, vacancyLoss: 130, effectiveIncome: 2470, operatingExpenses: 850, noi: 1620, debtService: 1200, monthlyCashFlow: 420, annualCashFlow: 5040 },
    { annualRent: 30000, netIncome: 22000, grossYield: 7.5, netYield: 5.5 },
    { effectiveIncome: 30000, noi: 20000, capRate: 5 },
    { cashInvested: 100000, annualCashFlow: 12000, returnPercent: 12 },
    { totalProjectCash: 260000, refinanceLoan: 262500, cashRecovered: 257500, cashLeftInDeal: 2500, noi: 1860, monthlyCashFlow: 360, annualCashFlow: 4320, cashOnCashPercent: 172.8 },
    { costBasis: 295000, netSaleProceeds: 350000, profit: 55000, roiPercent: 18.64406779661017, profitMarginPercent: 14.666666666666666, breakEvenSalePrice: 320000 },
    { occupiedNights: 19.5, grossRevenue: 3510, platformFees: 105.3, totalCosts: 2987.8, monthlyProfit: 522.1999999999998, breakEvenOccupancy: 52.53104106972303 },
    { grossHousingCost: 3350, effectiveRentIncome: 1710, effectiveHousingCost: 1640, annualEffectiveCost: 19680, costOffsetPercent: 51.04477611940299 },
    { tokensPerRequest: 1500, cachedTokensMonth: 0, dailyInputTokens: 100000, dailyOutputTokens: 50000, dailyTotalTokens: 150000, inputTokensMonth: 3000000, outputTokensMonth: 1500000, totalTokensMonth: 4500000, annualTokens: 54000000 },
    { tokensPerRequest: 1500, cachedTokensMonth: 0, dailyInputTokens: 100000, dailyOutputTokens: 50000, dailyTotalTokens: 150000, inputTokensMonth: 3000000, outputTokensMonth: 1500000, totalTokensMonth: 4500000, annualTokens: 54000000, inputCost: 6, outputCost: 12, monthlyCost: 18, annualCost: 216, costPerRequest: 0.006 },
    { fleetHourlyCost: 3, costPerRun: 30, scheduledGpuHours: 20, utilizedGpuHours: 20, dailyCost: 30, monthlyCost: 900, annualCost: 10800 },
    { computeCost: 146, computePercent: 77.6595744680851, storageCost: 2, storagePercent: 1.0638297872340425, bandwidthCost: 40, bandwidthPercent: 21.27659574468085, additionalCost: 0, additionalPercent: 0, monthlyCost: 188, annualCost: 2256 },
    { bandwidthCost: 50, requestCost: 7.5, originTrafficGb: 150.00000000000003, originCost: 12.000000000000002, monthlyCost: 69.5, annualCost: 834 },
    { netBurn: 20000, simpleRunwayMonths: 6, projectedRunwayMonths: 6, profitable: false, endingCash: 0 },
    { grossBurn: 83333.33333333333, netBurn: 33333.333333333336, cashBurn: 33333.333333333336, runwayMonths: 12 },
    { grossProfitPerMonth: 80, ltv: 2666.666666666667, ratio: 2.2222222222222223, paybackMonths: 15 },
    { monthlyGrossProfit: 160, paybackMonths: 7.5 },
    { customersLost: 342.05254633485396, cumulativeRevenueLost: 34205.2546334854, remainingCustomers: 897.9474536651459, endingMrr: 89794.74536651459, netCustomerChange: -102.05254633485413 },
    { score: 42, difference: 2 },
    { retainedRevenue: 97000, expansion: 10000, losses: 13000, netChange: -3000, nrrPercent: 97 },
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
      for (const invalid of ['', NaN, Infinity, -1, 1e20]) {
        if (slug === 'rule-of-40-calculator' && invalid === -1) continue;
        assert.equal(calculateLocalizedValues(slug, { ...defaults, [native.fields[0].key]: invalid }), null);
      }
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
    assert.equal(formatCalculatorNumber(6, 'months', locale, ''), new Intl.NumberFormat(locale, { style: 'unit', unit: 'month', unitDisplay: 'long', maximumFractionDigits: 2 }).format(6));
    assert.ok(calculateLocalizedValues('construction-material-waste-calculator', { netQuantity: 2.5, wastePercent: 12.5, unitCost: 4 }));
    assert.equal(calculateLocalizedValues('roofing-shingle-calculator', { roofArea: 20, wastePercent: 101, bundlesPerSquare: 3 }), null);
    const joistRatio = (span: number, uniformLoad: number, width: number, depth: number) =>
      calculatorTextFormatters('joist-deflection-calculator', { span, uniformLoad, spacing: 16, elasticModulus: 1600000, width, depth }, d, locale).ratio('IGNORED');
    assert.equal(joistRatio(12, 40, 1.5, 9.25), 'L / 916');
    assert.equal(joistRatio(12, 0, 1.5, 9.25), d.calculatorUi.notApplicable);

    const dogLifeStage = (dogAge: number, breedSize: string) =>
      calculatorTextFormatters('dog-age-breed-specific-calculator', { dogAge, breedSize }, d, locale).lifeStage('IGNORED');
    assert.equal(dogLifeStage(0.5, 'medium'), d.calculatorStates.puppy);
    assert.equal(dogLifeStage(2, 'medium'), d.calculatorStates.youngAdult);
    assert.equal(dogLifeStage(5, 'medium'), d.calculatorStates.matureAdult);
    assert.equal(dogLifeStage(8, 'medium'), d.calculatorStates.senior);
    assert.equal(dogLifeStage(11, 'medium'), d.calculatorStates.geriatric);
    assert.equal(dogLifeStage(-1, 'medium'), d.calculatorUi.notApplicable);

    const hrvDirection = (baselineHrv: number, currentHrv: number) =>
      calculatorTextFormatters('hrv-baseline-deviation-calculator', { baselineHrv, currentHrv }, d, locale).direction('IGNORED');
    assert.equal(hrvDirection(55, 60), d.calculatorStates.aboveBaseline);
    assert.equal(hrvDirection(55, 50), d.calculatorStates.belowBaseline);
    assert.equal(hrvDirection(55, 55), d.calculatorStates.equalToBaseline);

    const paceKm = calculatorTextFormatters('running-pace-calculator', {}, d, locale).pacePerKm('4:59 /km');
    assert.equal(paceKm, `4:59 ${d.calculatorStates.perKm}`);

    assert.ok(calculateLocalizedValues('rental-property-cash-flow-calculator', { rent: 2500, income: 100, vacancy: 5, tax: 300, insurance: 150, maintenance: 200, management: 200, hoa: 0, utilities: 0, other: 0, debt: 1200 }));
    assert.equal(calculateLocalizedValues('rental-yield-calculator', { value: 0, monthlyRent: 2500, annualRent: 0, expenses: 8000 }), null);
    assert.equal(calculateLocalizedValues('short-term-rental-break-even-calculator', { nightlyRate: 180, availableNights: 0, occupancy: 65, variableCost: 35, fixedCosts: 2200, platformFee: 3 }), null);
    assert.ok(calculateLocalizedValues('fix-and-flip-profit-calculator', { purchase: 200000, acquisition: 10000, rehab: 60000, financing: 15000, holding: 10000, sale: 375000, sellingCosts: 25000, other: 0 }));
  }
});
