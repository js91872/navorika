import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { readFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { chromium } from 'playwright';
import { PDFDocument } from 'pdf-lib';

const base = process.env.I18N_BASE_URL || 'http://127.0.0.1:3117';
const locales = ['fr', 'it', 'pt', 'es', 'ar', 'ru', 'de'];
const slugs = ['aspect-ratio-padding-calculator', 'css-flexbox-generator', 'rgb-cmyk-image-checker', 'image-megapixel-calculator', 'pdf-bleed-trim-checker', 'image-print-size-calculator', 'css-gradient-generator', 'css-clamp-font-generator', 'image-scaling-calculator', 'print-bleed-calculator'];
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
  page.on('pageerror', (error) => errors.push(error.message));
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
      await page.setViewportSize({ width: 1440, height: 1000 });
      pagesChecked++;
    }

    await visit(`/${locale}`);
    await page.locator('input[type="search"]').fill(d.tools['rgb-cmyk-image-checker'].title);
    assert.equal(await page.locator('main h2').count(), 1);
    await page.locator('input[type="search"]').fill('zzzz-not-a-tool');
    assert.equal(await page.getByRole('status').textContent(), d.ui.noResults);

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
    console.log(`Verified ${locale}: eleven translated pages and ten working tools.`);
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
  console.log(JSON.stringify({ localizedPages: pagesChecked, toolWorkflows: workflowsChecked, englishAlternates: 11, invalidRoutes: 5, desktopAndMobile: true, uncaughtBrowserErrors: errors.length }, null, 2));
} finally {
  await browser?.close();
  server?.kill('SIGTERM');
}
