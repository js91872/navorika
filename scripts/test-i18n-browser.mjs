import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { readFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { chromium } from 'playwright';
import { PDFDocument } from 'pdf-lib';

const base = process.env.I18N_BASE_URL || 'http://127.0.0.1:3117';
const locales = ['fr', 'it', 'pt', 'es', 'ar', 'ru', 'de'];
const slugs = [
  'aspect-ratio-padding-calculator', 'css-flexbox-generator', 'rgb-cmyk-image-checker',
  'image-megapixel-calculator', 'pdf-bleed-trim-checker', 'image-print-size-calculator',
  'css-gradient-generator', 'css-clamp-font-generator', 'image-scaling-calculator',
  'image-file-size-estimator', 'photo-storage-calculator', 'image-bandwidth-calculator',
  'square-footage-calculator', 'cubic-yard-calculator', 'roofing-shingle-calculator',
  'rafter-length-calculator', 'stud-calculator', 'drywall-mud-calculator',
  'roof-ridge-height-calculator', 'fascia-replacement-cost-calculator', 'ppi-calculator',
  'shed-ramp-angle-calculator', 'construction-material-waste-calculator', 'print-bleed-calculator',
  'soffit-fascia-calculator', 'attic-insulation-payback-calculator', 'joist-deflection-calculator',
  'hvac-duct-cfm-calculator', 'mortar-calculator', 'concrete-block-calculator',
  'rainwater-harvesting-calculator', 'dog-age-breed-specific-calculator', 'puppy-growth-predictor',
  'cat-calorie-calculator', 'caffeine-half-life-calculator', 'hrv-baseline-deviation-calculator',
  'wilks-dots-powerlifting-calculator', 'macronutrient-calculator', 'running-pace-calculator',
  'hydration-calculator', 'one-rep-max-calculator',
  'rental-property-cash-flow-calculator', 'rental-yield-calculator',
  'cap-rate-calculator', 'cash-on-cash-return-calculator', 'brrrr-calculator',
  'fix-and-flip-profit-calculator', 'short-term-rental-break-even-calculator',
  'house-hacking-effective-rent-calculator',
  'ai-token-calculator', 'llm-api-cost-calculator', 'gpu-compute-cost-calculator',
  'cloud-hosting-cost-calculator', 'cdn-cost-calculator', 'startup-runway-calculator',
  'saas-burn-rate-calculator', 'ltv-cac-ratio-calculator', 'cac-payback-calculator',
  'churn-impact-calculator', 'rule-of-40-calculator', 'net-revenue-retention-calculator',
  'drawdown-recovery-calculator', 'meeting-roi-calculator', 'ev-vs-gas-break-even-calculator',
  'heat-pump-vs-furnace-cost-calculator', 'job-offer-total-comp-calculator', 'lumpsum-investment-calculator',
  'savings-goal-calculator', 'mortgage-affordability-calculator', 'break-even-calculator',
  'profit-margin-markup-calculator',
  'ipv6-subnet-calculator', 'tcp-udp-port-range-calculator', 'cidr-summarization-calculator',
  'ip-address-classifier', 'common-port-service-lookup', 'url-parser',
  'cdr-print-readiness-checker', 'responsive-srcset-generator', 'yaml-json-converter',
  'uuid-generator-validator',
];
const dictionaries = Object.fromEntries(locales.map((locale) => [locale, JSON.parse(readFileSync(`src/lib/i18n/dictionaries/${locale}.json`, 'utf8'))]));
let server, browser;
let serverOutput = '';
let pagesChecked = 0, workflowsChecked = 0;
const errors = [];
try {
  if (!process.env.I18N_BASE_URL) {
    server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--hostname', '127.0.0.1', '--port', '3117'], { stdio: ['ignore', 'pipe', 'pipe'] });
    server.stdout.on('data', (chunk) => { serverOutput += chunk; });
    server.stderr.on('data', (chunk) => { serverOutput += chunk; });
  }
  let ready = false;
  for (let attempt = 0; attempt < 100; attempt++) {
    try { if ((await fetch(base)).ok) { ready = true; break; } } catch { /* Wait for the child server. */ }
    if (server?.exitCode != null) throw new Error(serverOutput);
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  assert.ok(ready, `Production server did not start: ${serverOutput}`);
  browser = await chromium.launch({
    headless: true,
    ...(process.env.CHROMIUM_EXECUTABLE ? { executablePath: process.env.CHROMIUM_EXECUTABLE } : {}),
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--no-zygote', '--single-process', '--disable-gpu'],
  });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  await context.route('**/*', (route) => route.request().url().startsWith(base) ? route.continue() : route.abort());
  const page = await context.newPage();
  page.on('pageerror', (error) => {
    console.error(`PAGE ERROR at ${page.url()}:`, error.message);
    errors.push(error.message);
  });
  const visit = async (path) => {
    const response = await page.goto(`${base}${path}`, { waitUntil: 'networkidle' });
    assert.equal(response.status(), 200, path);
  };
  const noOverflow = async (path) => {
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), `Horizontal overflow: ${path}`);
  };
  for (const locale of locales) {
    const d = dictionaries[locale];
    for (const slug of [null, ...slugs]) {
      const path = `/${locale}${slug ? `/tools/${slug}` : ''}`;
      await visit(path);
      assert.equal(await page.locator('html').getAttribute('lang'), locale);
      assert.equal(await page.locator('html').getAttribute('dir'), locale === 'ar' ? 'rtl' : 'ltr');
      assert.equal(await page.locator('main').count(), 1, path);
      assert.equal(await page.locator('h1').textContent(), slug ? d.tools[slug].title : d.ui.title);
      assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), `https://navorika.com${path}`);
      assert.equal(await page.locator('link[rel="alternate"][hreflang]').count(), 9, path);
      const english = `https://navorika.com${slug ? `/tools/${slug}` : '/'}`;
      assert.equal(new URL(await page.locator('link[hreflang="en"]').getAttribute('href')).href, new URL(english).href);
      assert.equal(new URL(await page.locator('link[hreflang="x-default"]').getAttribute('href')).href, new URL(english).href);
      for (const alternate of locales) {
        assert.equal(await page.locator(`link[hreflang="${alternate}"]`).getAttribute('href'), `https://navorika.com/${alternate}${slug ? `/tools/${slug}` : ''}`);
      }
      assert.equal(await page.locator('meta[name="robots"]').getAttribute('content'), 'index, follow');
      const pageCopy = await page.locator('body').evaluate((body) => {
        const copy = body.cloneNode(true);
        // Generated code and the multilingual language picker intentionally contain other languages.
        copy.querySelectorAll('pre, code, script, style, details').forEach((element) => element.remove());
        return copy.textContent;
      });
      assert.doesNotMatch(pageCopy, /\b(?:row-reverse|column-reverse|flex-start|flex-end|space-between|space-around|space-evenly|nowrap|wrap-reverse|English|inch|padding|layout|justify-content|align-items)\b/i, `Untranslated interface text: ${path}`);
      assert.ok((await page.locator('footer a[href="/privacy"]').textContent()).includes(d.ui.englishName));
      if (slug) {
        const schema = JSON.parse(await page.locator('script[type="application/ld+json"]').textContent());
        assert.equal(schema.inLanguage, locale);
        assert.equal(schema.url, `https://navorika.com${path}`);
        await page.locator('header details').click();
        assert.equal(await page.locator('header details a[hreflang="en"]').getAttribute('href'), `/tools/${slug}`);
        await page.locator('header details').click();
      }
      await noOverflow(path);
      await page.setViewportSize({ width: 390, height: 844 });
      await noOverflow(`${path} (mobile)`);
      await page.setViewportSize({ width: 320, height: 844 });
      await noOverflow(`${path} (320px)`);
      await page.setViewportSize({ width: 1440, height: 1000 });
      pagesChecked++;
    }

    await visit(`/${locale}`);
    await page.locator('input[type="search"]').fill(d.tools['rgb-cmyk-image-checker'].title);
    assert.equal(await page.locator('main h2').count(), 1);
    await page.locator('input[type="search"]').fill('zzzz-not-a-tool');
    assert.equal(await page.getByRole('status').textContent(), d.ui.noResults);

    for (const [slug, initial, expected, changed] of [
      ['image-file-size-estimator', 1920, 49766400],
      ['photo-storage-calculator', 64, 57.6],
      ['image-bandwidth-calculator', 250, 1250],
      ['square-footage-calculator', 20, 300],
      ['cubic-yard-calculator', 12, 40],
      ['roofing-shingle-calculator', 2000, 2200],
      ['rafter-length-calculator', 12, 6],
      ['stud-calculator', 20, 16, 31],
      ['drywall-mud-calculator', 1000, 1100],
      ['roof-ridge-height-calculator', 24, 12],
      ['fascia-replacement-cost-calculator', 120, 132],
      ['ppi-calculator', 3000, 300],
      ['shed-ramp-angle-calculator', 12, 14.04, 26.57],
      ['construction-material-waste-calculator', 1000, 100],
      ['soffit-fascia-calculator', 120, 240, 480],
      ['attic-insulation-payback-calculator', 1500, 2700, 5400],
      ['joist-deflection-calculator', 12, 53.333, 53.333],
      ['hvac-duct-cfm-calculator', 8, 0.349, 1.396],
      ['mortar-calculator', 500, 2.5, 5],
      ['concrete-block-calculator', 30, 220, 460],
      ['rainwater-harvesting-calculator', 2000, 39377, 78754],
      ['dog-age-breed-specific-calculator', 5, 39, 64],
      ['puppy-growth-predictor', 16, 30, 17.6],
      ['cat-calorie-calculator', 4.5, 216.3, 363.7],
      ['caffeine-half-life-calculator', 200, 87.1, 174.1],
      ['hrv-baseline-deviation-calculator', 55, -7, -62],
      ['wilks-dots-powerlifting-calculator', 90, 387.96, 307.72],
      ['macronutrient-calculator', 2200, 165, 330],
      ['running-pace-calculator', 1, 0, 0],
      ['hydration-calculator', 70, 2.98, 5.43],
      ['one-rep-max-calculator', 100, 115, 229],
      ['rental-property-cash-flow-calculator', 2500, 2470, 4845],
      ['rental-yield-calculator', 400000, 30000, 30000],
      ['cap-rate-calculator', 400000, 30000, 30000],
      ['cash-on-cash-return-calculator', 80000, 100000, 180000],
      ['brrrr-calculator', 200000, 260000, 460000],
      ['fix-and-flip-profit-calculator', 200000, 295000, 495000],
      ['short-term-rental-break-even-calculator', 180, 19.5, 19.5],
      ['house-hacking-effective-rent-calculator', 2200, 3350, 5550],
      ['ai-token-calculator', 1000, 1500, 2500],
      ['llm-api-cost-calculator', 1000, 6, 12],
      ['gpu-compute-cost-calculator', 2, 3, 6],
      ['cloud-hosting-cost-calculator', 2, 146, 292],
      ['cdn-cost-calculator', 1000, 50, 100],
      ['startup-runway-calculator', 120000, 20000, 20000],
      ['saas-burn-rate-calculator', 500000, 83333.33333333333, 83333.33333333333],
      ['ltv-cac-ratio-calculator', 100, 80, 160],
      ['cac-payback-calculator', 1200, 160, 160],
      ['churn-impact-calculator', 1000, 342.05254633485396, 648.210185339416],
      ['rule-of-40-calculator', 30, 0.42, 0.72],
      ['net-revenue-retention-calculator', 100000, 0.97, 0.985],
      ['drawdown-recovery-calculator', 30, 0.3, 0.6],
      ['meeting-roi-calculator', 8, 48.07692307692308, 48.07692307692308],
      ['ev-vs-gas-break-even-calculator', 45000, 10000, 55000],
      ['heat-pump-vs-furnace-cost-calculator', 15000, 800, 1600],
      ['job-offer-total-comp-calculator', 100000, 10000, 10000],
      ['lumpsum-investment-calculator', 100000, 100000, 200000],
      ['savings-goal-calculator', 100000, 1240, 2673],
      ['mortgage-affordability-calculator', 120000, 409712, 792190],
      ['break-even-calculator', 30000, 40, 40],
      ['profit-margin-markup-calculator', 60, 40, -20],
      ['ipv6-subnet-calculator', 48, 16, 32],
      ['tcp-udp-port-range-calculator', 1024, 48128, 47104],
      ['cidr-summarization-calculator', 0, 2, 1],
      ['ip-address-classifier', 0, 0, 0],
      ['common-port-service-lookup', 443, 443, 886],
      ['url-parser', 0, 0, 0],
      ['cdr-print-readiness-checker', 0, 0, 0],
      ['responsive-srcset-generator', 1920, 0, 0],
      ['yaml-json-converter', 0, 0, 0],
      ['uuid-generator-validator', 10, 0, 0],
    ]) {
      await visit(`/${locale}/tools/${slug}`);
      const ui = d.calculatorUi;
      const currencySlugs = new Set([
        'attic-insulation-payback-calculator',
        'rental-property-cash-flow-calculator',
        'rental-yield-calculator',
        'cap-rate-calculator',
        'cash-on-cash-return-calculator',
        'brrrr-calculator',
        'fix-and-flip-profit-calculator',
        'house-hacking-effective-rent-calculator',
        'llm-api-cost-calculator',
        'gpu-compute-cost-calculator',
        'cloud-hosting-cost-calculator',
        'cdn-cost-calculator',
        'startup-runway-calculator',
        'saas-burn-rate-calculator',
        'ltv-cac-ratio-calculator',
        'cac-payback-calculator',
        'meeting-roi-calculator',
        'ev-vs-gas-break-even-calculator',
        'heat-pump-vs-furnace-cost-calculator',
        'job-offer-total-comp-calculator',
        'lumpsum-investment-calculator',
        'savings-goal-calculator',
        'mortgage-affordability-calculator',
        'break-even-calculator',
        'profit-margin-markup-calculator',
      ]);
      const percentSlugs = new Set([
        'rule-of-40-calculator',
        'net-revenue-retention-calculator',
        'drawdown-recovery-calculator',
      ]);
      const isCurrency = currencySlugs.has(slug);
      const isPercent = percentSlugs.has(slug);
      const number = isCurrency
        ? new Intl.NumberFormat(locale, { style: 'currency', currency: 'USD', currencyDisplay: 'code', maximumFractionDigits: 2 })
        : isPercent
        ? new Intl.NumberFormat(locale, { style: 'percent', maximumFractionDigits: 3 })
        : new Intl.NumberFormat(locale, { maximumFractionDigits: 3 });
      if (slug === 'running-pace-calculator') {
        assert.ok((await page.locator('main dd').first().textContent()).includes('4:59'));
        await page.locator('main input[type="number"]').nth(1).fill(String(initial * 2));
        assert.ok((await page.locator('main dd').first().textContent()).includes('7:49'));
      } else if (slug === 'ipv6-subnet-calculator') {
        assert.equal(await page.locator('main dd').first().textContent(), number.format(expected));
        await page.locator('main input[type="number"]').first().fill('32');
        assert.equal(await page.locator('main dd').first().textContent(), number.format(changed));
      } else if (slug === 'cidr-summarization-calculator') {
        assert.equal(await page.locator('main dd').first().textContent(), number.format(expected));
        await page.locator('main textarea').first().fill('192.168.0.0/24');
        assert.equal(await page.locator('main dd').first().textContent(), number.format(changed));
      } else if (slug === 'ip-address-classifier') {
        assert.equal(await page.locator('main dd').first().textContent(), 'IPv4');
        await page.locator('main input[type="text"]').first().fill('2001:db8::1');
        assert.equal(await page.locator('main dd').first().textContent(), 'IPv6');
      } else if (slug === 'url-parser') {
        assert.equal(await page.locator('main dd').first().textContent(), 'https:');
        await page.locator('main input[type="text"]').first().fill('http://test.org');
        assert.equal(await page.locator('main dd').first().textContent(), 'http:');
      } else if (slug === 'cdr-print-readiness-checker') {
        assert.equal(await page.locator('main dd').first().textContent(), 'READY FOR PRINT');
        await page.locator('main select').first().selectOption('missing');
        assert.equal(await page.locator('main dd').first().textContent(), 'ACTION REQUIRED');
      } else if (slug === 'responsive-srcset-generator') {
        assert.ok((await page.locator('main dd').first().textContent()).includes('16 / 9'));
        await page.locator('main input[type="number"]').first().fill('3840');
        assert.ok((await page.locator('main dd').first().textContent()).includes('3840px'));
      } else if (slug === 'yaml-json-converter') {
        assert.ok((await page.locator('main dd').first().textContent()).includes('Valid'));
        await page.locator('main textarea').first().fill('foo: bar');
        assert.ok((await page.locator('main dd').first().textContent()).includes('Valid'));
      } else if (slug === 'uuid-generator-validator') {
        assert.ok((await page.locator('main dd').first().textContent()).includes('Valid'));
        await page.locator('main input[type="text"]').first().fill('invalid-uuid');
        assert.ok((await page.locator('main dd').first().textContent()).includes('Invalid'));
      } else {
        assert.equal(await page.locator('main dd').first().textContent(), number.format(expected));
        await page.locator('main input[type="number"]').first().fill(String(initial * 2));
        assert.equal(await page.locator('main dd').first().textContent(), number.format(changed ?? expected * 2));
      }
      await page.evaluate(() => Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async (text) => { window.__copiedResult = text; } } }));
      await page.getByRole('button', { name: ui.copy, exact: true }).click();
      const copied = await page.evaluate(() => window.__copiedResult);
      assert.ok(copied.includes(d.tools[slug].title));
      assert.doesNotMatch(copied, /Matched|Mismatch|Not applicable|Flat \(/);
      for (const label of Object.values(d.calculators[slug].results)) assert.ok(copied.includes(label));
      const expectedInCopied = slug === 'running-pace-calculator' ? '7:49'
        : slug === 'ip-address-classifier' ? 'IPv6'
        : slug === 'url-parser' ? 'http:'
        : slug === 'cdr-print-readiness-checker' ? 'ACTION REQUIRED'
        : slug === 'responsive-srcset-generator' ? '3840px'
        : slug === 'yaml-json-converter' ? 'Valid'
        : slug === 'uuid-generator-validator' ? 'Invalid'
        : number.format(changed ?? expected * 2);
      assert.ok(copied.includes(expectedInCopied), `${slug} in copied text`);
      const downloadEvent = page.waitForEvent('download');
      await page.getByRole('button', { name: ui.csv, exact: true }).click();
      const download = await downloadEvent;
      assert.equal(download.suggestedFilename(), `${slug}-${locale}.csv`);
      const csv = readFileSync(await download.path(), 'utf8');
      assert.ok(csv.startsWith('\uFEFF'));
      assert.ok(csv.includes(ui.result) && csv.includes(ui.value));
      for (const label of Object.values(d.calculators[slug].results)) assert.ok(csv.includes(label));
      if (slug === 'fascia-replacement-cost-calculator' || slug === 'construction-material-waste-calculator' || slug === 'attic-insulation-payback-calculator') {
        assert.ok(csv.includes('USD'));
        assert.ok(copied.includes('USD'));
      }
      if (slug === 'ppi-calculator') {
        assert.ok(csv.includes(d.calculatorStates.mismatch));
        assert.ok(copied.includes(d.calculatorStates.mismatch));
      }
      if (slug === 'joist-deflection-calculator') {
        assert.ok(csv.includes('L / 115'));
        assert.ok(copied.includes('L / 115'));
      }
      if (slug === 'dog-age-breed-specific-calculator') {
        assert.ok(copied.includes(d.calculatorStates.geriatric));
        assert.ok(csv.includes(d.calculatorStates.geriatric));
      }
      if (slug === 'hrv-baseline-deviation-calculator') {
        assert.ok(copied.includes(d.calculatorStates.belowBaseline));
        assert.ok(csv.includes(d.calculatorStates.belowBaseline));
      }
      if (slug === 'running-pace-calculator') {
        assert.ok(copied.includes(d.calculatorStates.perKm));
        assert.ok(csv.includes(d.calculatorStates.perKm));
      }
      await page.evaluate(() => { window.print = () => { window.__printOpened = true; }; });
      await page.locator('main button').last().click();
      assert.equal(await page.evaluate(() => window.__printOpened), true);
      if (slug === 'cdr-print-readiness-checker') {
        // All options are valid preflight checklist states
      } else {
        if (slug === 'cidr-summarization-calculator') {
          await page.locator('main textarea').first().fill('');
        } else if (slug === 'ip-address-classifier' || slug === 'url-parser') {
          await page.locator('main input[type="text"]').first().fill('');
        } else {
          await page.locator('main input[type="number"]').first().fill('');
        }
        assert.equal(await page.locator('main').getByRole('alert').textContent(), ui.invalid);
        assert.equal(await page.getByRole('button', { name: ui.copy, exact: true }).count(), 0);
        await page.getByRole('button', { name: ui.reset, exact: true }).click();
        if (slug === 'running-pace-calculator') {
          assert.ok((await page.locator('main dd').first().textContent()).includes('4:59'));
        } else if (slug === 'ip-address-classifier') {
          assert.equal(await page.locator('main dd').first().textContent(), 'IPv4');
        } else if (slug === 'url-parser') {
          assert.equal(await page.locator('main dd').first().textContent(), 'https:');
        } else if (slug === 'responsive-srcset-generator') {
          assert.ok((await page.locator('main dd').first().textContent()).includes('16 / 9'));
        } else if (slug === 'yaml-json-converter') {
          assert.ok((await page.locator('main dd').first().textContent()).includes('Valid'));
        } else if (slug === 'uuid-generator-validator') {
          assert.ok((await page.locator('main dd').first().textContent()).includes('Valid'));
        } else {
          assert.equal(await page.locator('main dd').first().textContent(), number.format(expected));
        }
      }
      await page.evaluate(() => Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async () => { throw new Error('RAW_BROWSER_ERROR'); } } }));
      await page.getByRole('button', { name: ui.copy, exact: true }).click();
      assert.doesNotMatch(await page.locator('main').innerText(), /RAW_BROWSER_ERROR/);
      assert.ok((await page.locator('main [role="status"]').textContent()).trim());
      if (slug === 'ppi-calculator') {
        assert.equal(await page.locator('main dd').last().textContent(), d.calculatorStates.matched);
        await page.locator('main input[type="number"]').nth(2).fill('20');
        assert.equal(await page.locator('main dd').last().textContent(), `${d.calculatorStates.mismatch} (~${new Intl.NumberFormat(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(50)}%)`);
      }
      if (slug === 'shed-ramp-angle-calculator') {
        await page.locator('main input[type="number"]').nth(0).fill('0');
        assert.equal(await page.locator('main dd').last().textContent(), `${d.calculatorStates.flat} (0 : 1)`);
        await page.locator('main input[type="number"]').nth(1).fill('0');
        assert.equal(await page.locator('main dd').last().textContent(), `${d.calculatorStates.flat} (0 : 1)`);
        await page.locator('main input[type="number"]').nth(0).fill('12');
        assert.equal(await page.locator('main dd').last().textContent(), `${d.calculatorStates.vertical} (1 : 0)`);
        assert.equal(await page.locator('main dd').nth(1).textContent(), ui.notApplicable);
        // The vertical/null state must also survive copying and export without raw English.
        await page.evaluate(() => Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async (text) => { window.__copiedResult = text; } } }));
        await page.getByRole('button', { name: ui.copy, exact: true }).click();
        const verticalCopy = await page.evaluate(() => window.__copiedResult);
        assert.ok(verticalCopy.includes(ui.notApplicable) && verticalCopy.includes(d.calculatorStates.vertical));
        const verticalDownload = page.waitForEvent('download');
        await page.getByRole('button', { name: ui.csv, exact: true }).click();
        const verticalCsv = readFileSync(await (await verticalDownload).path(), 'utf8');
        assert.ok(verticalCsv.includes(ui.notApplicable) && verticalCsv.includes(d.calculatorStates.vertical));
      }
      await page.setViewportSize({ width: 320, height: 844 });
      await noOverflow(`${locale}/${slug} at 320px`);
      await page.setViewportSize({ width: 1440, height: 1000 });
      workflowsChecked++;
    }

    await visit(`/${locale}/tools/aspect-ratio-padding-calculator`);
    assert.match(await page.locator('pre').textContent(), /padding-top: 56.25%/);
    assert.ok((await page.locator('bdi[dir="ltr"]').allTextContents()).some((value) => /^1920\s*×\s*1080/.test(value)), 'Numeric examples must retain width × height order');
    await page.locator('input[type="number"]').nth(0).fill('100');
    await page.locator('input[type="number"]').nth(1).fill('100');
    assert.match(await page.locator('pre').textContent(), /padding-top: 100%/);
    await page.locator('input[type="number"]').nth(0).fill('');
    assert.equal(await page.locator('main').getByRole('alert').textContent(), d.ui.invalid);
    assert.ok(await page.getByRole('button', { name: d.ui.copy, exact: true }).isDisabled());
    await page.getByRole('button', { name: d.ui.reset, exact: true }).click();
    // Successful copy and its fallback are both exercised without accessing the OS clipboard.
    await page.evaluate(() => Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async () => {} } }));
    await page.getByRole('button', { name: d.ui.copy, exact: true }).click();
    await page.getByText(d.ui.copied, { exact: true }).waitFor();
    await page.evaluate(() => Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async () => { throw new Error('denied'); } } }));
    await page.getByRole('button', { name: d.ui.copy, exact: true }).click();
    await page.getByText(d.ui.copyError, { exact: true }).waitFor();
    workflowsChecked++;

    await visit(`/${locale}/tools/image-megapixel-calculator`);
    assert.ok((await page.locator('[aria-live="polite"]').textContent()).includes(`24 ${d.ui.mpUnit}`));
    await page.locator('input[type="number"]').nth(0).fill('1.5');
    assert.equal(await page.locator('main').getByRole('alert').textContent(), d.ui.invalid);
    workflowsChecked++;

    await visit(`/${locale}/tools/print-bleed-calculator`);
    const numbers = page.locator('input[type="number"]');
    assert.ok((await page.locator('[aria-live="polite"]').textContent()).includes(new Intl.NumberFormat(locale).format(216)));
    await page.locator('select').selectOption('inch');
    assert.ok(Math.abs(Number(await numbers.nth(0).inputValue()) - 210 / 25.4) < 1e-7);
    assert.ok((await page.locator('[aria-live="polite"]').textContent()).includes(d.ui.inch));
    await page.locator('select').selectOption('mm');
    assert.ok(Math.abs(Number(await numbers.nth(0).inputValue()) - 210) < 1e-6);
    await numbers.nth(2).fill('-1');
    assert.equal(await page.locator('main').getByRole('alert').textContent(), d.ui.invalid);
    workflowsChecked++;

    await visit(`/${locale}/tools/css-flexbox-generator`);
    await page.locator('select').nth(0).selectOption('column-reverse');
    await page.locator('select').nth(1).selectOption('space-between');
    assert.equal(await page.locator('select').nth(0).locator('option:checked').textContent(), d.flexOptions['column-reverse']);
    assert.equal(await page.locator('select').nth(1).locator('option:checked').textContent(), d.flexOptions['space-between']);
    assert.match(await page.locator('pre').textContent(), /flex-direction: column-reverse/);
    assert.match(await page.locator('pre').textContent(), /justify-content: space-between/);
    workflowsChecked++;

    await visit(`/${locale}/tools/rgb-cmyk-image-checker`);
    assert.match(await page.locator('input[type="file"]').getAttribute('class'), /sr-only/);
    const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScLbtAAAAABJRU5ErkJggg==', 'base64');
    await page.locator('input[type="file"]').setInputFiles({ name: 'test.png', mimeType: 'image/png', buffer: png });
    await page.locator('dl').waitFor();
    assert.ok((await page.locator('dl').textContent()).includes(d.ui.rgbLabel));
    await page.getByText('test.png', { exact: true }).waitFor();
    const gif = Buffer.from('R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==', 'base64');
    await page.locator('input[type="file"]').setInputFiles({ name: 'test.gif', mimeType: 'image/gif', buffer: gif });
    await page.getByText(d.ui.palette, { exact: true }).waitFor();
    await page.locator('input[type="file"]').setInputFiles({ name: 'broken.png', mimeType: 'image/png', buffer: Buffer.from('invalid image') });
    await page.locator('main').getByRole('alert').waitFor();
    assert.equal(await page.locator('main').getByRole('alert').textContent(), d.ui.fileError);
    assert.equal(await page.locator('dl').count(), 0, 'Previous image result must be cleared');
    workflowsChecked++;
    await visit(`/${locale}/tools/image-print-size-calculator`);
    const printFields = page.locator('input[type="number"]');
    const formatPrint = (value) => new Intl.NumberFormat(locale, { maximumFractionDigits: 3 }).format(value);
    assert.deepEqual(await page.locator('dl dd').allTextContents(), [10, 8, 25.4, 20.32].map(formatPrint));
    await printFields.nth(2).fill('150');
    assert.deepEqual(await page.locator('dl dd').allTextContents(), [20, 16, 50.8, 40.64].map(formatPrint));
    for (const value of ['', '0', '-1', '1.5', '1000000001']) {
      await printFields.first().fill(value);
      assert.equal(await page.locator('dl').count(), 0);
      assert.equal(await page.locator('main').getByRole('alert').textContent(), d.printSize.invalid);
    }
    await page.getByRole('button', { name: d.ui.reset, exact: true }).click();
    for (const value of ['0', '0.0000001', '1000001']) {
      await printFields.nth(2).fill(value);
      await page.locator('main').getByRole('alert').waitFor();
      assert.equal(await page.locator('dl').count(), 0);
    }
    await page.getByRole('button', { name: d.ui.reset, exact: true }).click();
    await page.evaluate(() => Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async (text) => { window.__copied = text; } } }));
    await page.getByRole('button', { name: d.ui.copy, exact: true }).click();
    assert.ok((await page.evaluate(() => window.__copied)).includes(d.printSize.widthCm));
    workflowsChecked++;

    await visit(`/${locale}/tools/pdf-bleed-trim-checker`);
    const pdf = await PDFDocument.create();
    const pt = (mm) => mm / 25.4 * 72;
    for (let i = 0; i < 5; i++) {
      const fixture = pdf.addPage([pt(216), pt(303)]);
      if ([1, 3, 4].includes(i)) fixture.setTrimBox(pt(3), pt(3), pt(210), pt(297));
      if ([2, 3].includes(i)) fixture.setBleedBox(0, 0, pt(216), pt(303));
      if (i === 4) fixture.setBleedBox(pt(3), pt(3), pt(210), pt(297));
    }
    const pdfInput = page.locator('input[type="file"]');
    const pdfBuffer = Buffer.from(await pdf.save());
    await pdfInput.setInputFiles({ name: 'fixture.pdf', mimeType: 'application/pdf', buffer: pdfBuffer });
    await page.locator('[data-pdf-interpretation]').waitFor();
    const interpretations = ['none', 'trimOnly', 'bleedOnly', 'extended', 'zero'];
    for (let index = 0; index < 5; index++) {
      await page.locator('main select').selectOption(String(index));
      assert.equal(await page.locator('[data-pdf-interpretation]').textContent(), d.pdf[interpretations[index]]);
    }
    await page.locator('main select').selectOption('3');
    const pdfNumbers = await page.locator('dl').first().locator('dd').allTextContents();
    assert.ok(pdfNumbers.includes(`${formatPrint(210)} × ${formatPrint(297)}`));
    assert.deepEqual(await page.locator('dl').nth(1).locator('dd').allTextContents(), Array(4).fill(formatPrint(3)));
    await page.evaluate(() => Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async (text) => { window.__copied = text; } } }));
    await page.getByRole('button', { name: d.ui.copy, exact: true }).click();
    const copiedPdf = await page.evaluate(() => window.__copied);
    for (const key of interpretations) assert.ok(copiedPdf.includes(d.pdf[key]));
    assert.ok(copiedPdf.includes(d.pdf.pages));
    assert.doesNotMatch(copiedPdf, /Explicit|Default configuration|Invalid input|Top Bleed/);
    const [download] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: d.pdf.download, exact: true }).click()]);
    const csv = readFileSync(await download.path(), 'utf8');
    assert.ok(csv.includes(d.pdf.media));
    for (const key of interpretations) assert.ok(csv.includes(d.pdf[key]));
    await page.setViewportSize({ width: 390, height: 844 });
    await noOverflow(`${locale} PDF results`);
    await page.setViewportSize({ width: 1440, height: 1000 });
    await pdfInput.setInputFiles({ name: 'broken.pdf', mimeType: 'application/pdf', buffer: Buffer.from('not a pdf') });
    await page.locator('main').getByRole('alert').waitFor();
    assert.equal(await page.locator('main').getByRole('alert').textContent(), d.pdf.error);
    assert.equal(await page.locator('dl').count(), 0, 'Old PDF results must clear after invalid upload');
    if (locale === 'fr') {
      await pdfInput.setInputFiles({ name: 'large.pdf', mimeType: 'application/pdf', buffer: Buffer.alloc(20 * 1024 * 1024 + 1) });
      assert.equal(await page.locator('main').getByRole('alert').textContent(), d.pdf.tooLarge);
    }
    workflowsChecked++;
    await visit(`/${locale}/tools/css-gradient-generator`);
    const chooseColor = async (index, value) => page.locator('input[type="color"]').nth(index).evaluate((element, next) => {
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(element, next);
      element.dispatchEvent(new Event('input', { bubbles: true }));
      element.dispatchEvent(new Event('change', { bubbles: true }));
    }, value);
    await chooseColor(0, '#000000');
    await chooseColor(1, '#ffffff');
    await page.locator('input[type="number"]').fill('0');
    assert.equal(await page.locator('pre').textContent(), 'background: linear-gradient(0deg, #000000, #ffffff);');
    const background = await page.locator('[data-gradient-preview]').evaluate((element) => getComputedStyle(element).backgroundImage);
    assert.ok(background.includes('0deg') && background.includes('rgb(0, 0, 0)') && background.includes('rgb(255, 255, 255)'));
    await page.evaluate(() => Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async (text) => { window.__copied = text; } } }));
    await page.getByRole('button', { name: d.ui.copy, exact: true }).click();
    assert.equal(await page.evaluate(() => window.__copied), 'background: linear-gradient(0deg, #000000, #ffffff);');
    for (const angle of ['', '-1', '361']) {
      await page.locator('input[type="number"]').fill(angle);
      assert.equal(await page.locator('main').getByRole('alert').textContent(), d.design.gradientInvalid);
      assert.equal(await page.locator('pre').count(), 0);
    }
    await page.getByRole('button', { name: d.ui.reset, exact: true }).click();
    workflowsChecked++;

    await visit(`/${locale}/tools/css-clamp-font-generator`);
    await page.evaluate(() => Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async (text) => { window.__copied = text; } } }));
    assert.equal(await page.locator('[data-font-preview]').textContent(), d.design.sample);
    const fontFields = page.locator('input[type="number"]');
    for (const [width, expected] of [[320, 16], [760, 32], [1200, 48]]) {
      await page.setViewportSize({ width, height: 900 });
      const fontSize = await page.locator('[data-font-preview]').evaluate((element) => parseFloat(getComputedStyle(element).fontSize));
      assert.ok(Math.abs(fontSize - expected) < 0.02, `Font preview ${locale}/${width}: ${fontSize}`);
      await noOverflow(`${locale} font preview at ${width}`);
    }
    await page.setViewportSize({ width: 1440, height: 1000 });
    await fontFields.nth(1).fill('64');
    assert.match(await page.locator('pre').textContent(), /-0\.090909rem \+/);
    await page.locator('main input[type="text"]').fill('Aa مرحبا');
    assert.equal(await page.locator('[data-font-preview]').textContent(), 'Aa مرحبا');
    await page.getByRole('button', { name: d.ui.copy, exact: true }).click();
    assert.equal(await page.evaluate(() => window.__copied), await page.locator('pre').textContent());
    for (const [index, value] of [[1, '16'], [1, '513'], [3, '320'], [2, '320.5'], [0, '']]) {
      await page.getByRole('button', { name: d.ui.reset, exact: true }).click();
      await fontFields.nth(index).fill(value);
      assert.equal(await page.locator('main').getByRole('alert').textContent(), d.design.clampInvalid);
      assert.equal(await page.locator('pre').count(), 0);
    }
    await page.getByRole('button', { name: d.ui.reset, exact: true }).click();
    workflowsChecked++;

    await visit(`/${locale}/tools/image-scaling-calculator`);
    await page.evaluate(() => Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async (text) => { window.__copied = text; } } }));
    const scaleFields = page.locator('input[type="number"]');
    const formatScale = (value) => new Intl.NumberFormat(locale, { maximumFractionDigits: 6 }).format(value);
    assert.deepEqual(await page.locator('dl dd').allTextContents(), [960, 540, 0.5, 25].map(formatScale));
    await scaleFields.nth(2).fill('200');
    assert.deepEqual(await page.locator('dl dd').allTextContents(), [3840, 2160, 2, 400].map(formatScale));
    await page.getByRole('button', { name: d.ui.copy, exact: true }).click();
    assert.ok((await page.evaluate(() => window.__copied)).includes(d.design.scaledWidth));
    for (const value of ['0', '0.001', '10001', '']) {
      await scaleFields.nth(2).fill(value);
      assert.equal(await page.locator('main').getByRole('alert').textContent(), d.design.scaleInvalid);
      assert.equal(await page.locator('dl').count(), 0);
      assert.equal(await page.getByRole('button', { name: d.ui.copy, exact: true }).isDisabled(), true);
    }
    await scaleFields.nth(0).fill('1');
    await scaleFields.nth(1).fill('1');
    await scaleFields.nth(2).fill('0.01');
    assert.equal(await page.locator('dl').count(), 0, 'Zero-pixel output is not shown');
    await scaleFields.nth(0).fill('1000000');
    await scaleFields.nth(1).fill('1000000');
    assert.deepEqual(await page.locator('dl dd').allTextContents(), [100, 100, 0.0001, 0.000001].map(formatScale));
    await page.getByRole('button', { name: d.ui.reset, exact: true }).click();
    await page.setViewportSize({ width: 390, height: 844 });
    await noOverflow(`${locale} scaling results`);
    await page.setViewportSize({ width: 1440, height: 1000 });
    workflowsChecked++;
    console.log(`Verified ${locale}: ${slugs.length + 1} translated pages and ${slugs.length} working tools.`);
  }
  for (const slug of [null, ...slugs]) {
    await visit(slug ? `/tools/${slug}` : '/');
    assert.equal(await page.locator('html').getAttribute('lang'), 'en');
    await noOverflow(`English ${slug || 'home'} desktop`);
    await page.setViewportSize({ width: 390, height: 844 });
    await noOverflow(`English ${slug || 'home'} mobile`);
    await page.setViewportSize({ width: 1440, height: 1000 });
    assert.equal(await page.locator('link[hreflang="fr"]').getAttribute('href'), `https://navorika.com/fr${slug ? `/tools/${slug}` : ''}`);
  }
  // Language selection stays available without opening the mobile menu.
  for (const width of [320, 360, 390, 640]) {
    await page.setViewportSize({ width, height: 844 });
    await page.mouse.move(0, 0);
    const language = page.locator('summary[aria-label="Language: English"]');
    await language.waitFor({ state: 'visible' });
    const controls = [language, page.getByRole('button', { name: 'Search tools' }), page.getByRole('button', { name: 'Toggle theme' }), page.getByRole('button', { name: 'Toggle menu' })];
    const boxes = await Promise.all(controls.map((control) => control.boundingBox()));
    for (let i = 0; i < boxes.length; i++) {
      const box = boxes[i];
      assert.ok(box && box.width >= 44 && box.height >= 44 && box.x >= 0 && box.x + box.width <= width, `Mobile control outside viewport at ${width}`);
      if (i) assert.ok(box.x >= boxes[i - 1].x + boxes[i - 1].width - 1, `Overlapping controls at ${width}`);
    }
    await language.click();
    await page.locator('details a[hreflang="fr"]').waitFor({ state: 'visible' });
    await noOverflow(`Open language menu at ${width}`);
    await page.mouse.click(8, 700);
    assert.equal(await page.locator('details').first().getAttribute('open'), null, 'Outside tap dismisses language menu');
    await language.click();
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('details').first().getAttribute('open'), null, 'Escape dismisses language menu');
    await language.focus();
    await page.keyboard.press('Enter');
    await page.locator('details a[hreflang="fr"]').waitFor({ state: 'visible' });
    await page.keyboard.press('Escape');
    assert.equal(await language.evaluate((element) => element === document.activeElement), true, 'Escape restores trigger focus');
    await page.getByRole('button', { name: 'Toggle menu' }).click();
    assert.equal(await page.locator('summary[aria-label="Language: English"]').count(), 1);
    await page.getByRole('button', { name: 'Toggle menu' }).click();
    await noOverflow(`Mobile navigation at ${width}`);
  }
  await visit('/tools/print-bleed-calculator');
  await page.locator('details').first().click();
  await page.locator('details a[hreflang="ar"]').click();
  await page.waitForURL(`${base}/ar/tools/print-bleed-calculator`);
  assert.equal(await page.locator('html').getAttribute('dir'), 'rtl');
  await page.locator('details').first().click();
  await page.locator('details a[hreflang="en"]').click();
  await page.waitForURL(`${base}/tools/print-bleed-calculator`);
  assert.equal(await page.locator('html').getAttribute('lang'), 'en');
  assert.notEqual(await page.locator('html').getAttribute('dir'), 'rtl');
  for (const path of ['/xx', '/fr/tools/not-a-tool', '/fr/privacy', '/ar/tools/image-dpi-converter', '/en']) {
    assert.equal((await context.request.get(`${base}${path}`)).status(), 404, path);
  }
  const sitemap = await (await context.request.get(`${base}/sitemap.xml`)).text();
  for (const locale of locales) for (const slug of slugs) assert.ok(sitemap.includes(`https://navorika.com/${locale}/tools/${slug}`));
  if (process.env.I18N_SCREENSHOT_DIR) {
    mkdirSync(process.env.I18N_SCREENSHOT_DIR, { recursive: true });
    for (const locale of ['fr', 'ar']) {
      await page.setViewportSize({ width: 1280, height: 900 });
      await visit(`/${locale}/tools/aspect-ratio-padding-calculator`);
      await page.screenshot({ path: join(process.env.I18N_SCREENSHOT_DIR, `${locale}-desktop.png`), fullPage: true });
      await page.setViewportSize({ width: 390, height: 844 });
      await page.screenshot({ path: join(process.env.I18N_SCREENSHOT_DIR, `${locale}-mobile.png`), fullPage: true });
    }
  }
  assert.deepEqual(errors, [], 'Uncaught browser errors');
  console.log(JSON.stringify({ localizedPages: pagesChecked, toolWorkflows: workflowsChecked, englishAlternates: slugs.length + 1, invalidRoutes: 5, desktopAndMobile: true, uncaughtBrowserErrors: errors.length }, null, 2));
} finally {
  await browser?.close();
  server?.kill('SIGTERM');
}
