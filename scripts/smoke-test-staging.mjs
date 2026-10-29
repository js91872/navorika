import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync, readdirSync, unlinkSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createCanvas } from '@napi-rs/canvas';
import sharp from 'sharp';
import { chromium } from 'playwright';
import { russianMd, arabicMd } from './pdf-sample-fixtures.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const publicDir = path.resolve(projectRoot, 'public/samples');

const base = process.env.I18N_BASE_URL || 'http://127.0.0.1:3119';
const locales = ['fr', 'it', 'pt', 'es', 'de', 'ru', 'ar'];
const dictionaries = Object.fromEntries(
  ['en', ...locales].map((loc) => [loc, JSON.parse(readFileSync(`src/lib/i18n/dictionaries/${loc}.json`, 'utf8'))])
);

let server, browser;
let serverOutput = '';
const errors = [];
let checksPassed = 0;

function cleanOldScreenshots(dir, prefix) {
  if (!dir || !existsSync(dir)) return;
  for (const file of readdirSync(dir)) {
    if (file.startsWith(`${prefix}-page-`) && file.endsWith('.png')) {
      try {
        unlinkSync(path.join(dir, file));
      } catch {
        // ignore removal error
      }
    }
  }
}

let isCleaningUp = false;
async function cleanup() {
  if (isCleaningUp) return;
  isCleaningUp = true;
  try {
    await browser?.close();
  } catch {
    // ignore browser close error
  }
  if (server && !server.killed) {
    try {
      server.kill('SIGTERM');
      setTimeout(() => {
        try {
          if (!server.killed) server.kill('SIGKILL');
        } catch {
          // ignore kill error
        }
      }, 2000).unref();
    } catch {
      // ignore server kill error
    }
  }
}

process.on('SIGINT', async () => {
  await cleanup();
  process.exit(130);
});

process.on('SIGTERM', async () => {
  await cleanup();
  process.exit(143);
});

try {
  if (!process.env.I18N_BASE_URL) {
    server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--hostname', '127.0.0.1', '--port', '3119'], {
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    server.stdout.on('data', (chunk) => { serverOutput += chunk; });
    server.stderr.on('data', (chunk) => { serverOutput += chunk; });
  }

  let ready = false;
  for (let attempt = 0; attempt < 100; attempt++) {
    try {
      if ((await fetch(base)).ok) { ready = true; break; }
    } catch { /* waiting for server */ }
    if (server?.exitCode != null) throw new Error(serverOutput);
    await new Promise((r) => setTimeout(r, 200));
  }
  assert.ok(ready, `Production server did not start on port 3119: ${serverOutput}`);

  browser = await chromium.launch({
    headless: true,
    ...(process.env.CHROMIUM_EXECUTABLE ? { executablePath: process.env.CHROMIUM_EXECUTABLE } : {}),
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--no-zygote', '--disable-gpu'],
  });

  const context = await browser.newContext();
  const page = await context.newPage();
  page.on('pageerror', (err) => {
    console.error('Browser uncaught error:', err.message);
    errors.push(err.message);
  });

  console.log('=== STAGING SMOKE TEST SUITE ===');

  // -------------------------------------------------------------------------
  // 1. Mobile navigation and language-switcher dismissal
  // -------------------------------------------------------------------------
  console.log('1. Checking mobile navigation & language-switcher dismissal...');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/`, { waitUntil: 'domcontentloaded' });

  // Mobile menu toggle open
  const menuButton = page.getByRole('button', { name: 'Toggle menu' });
  await menuButton.waitFor({ state: 'visible' });
  await menuButton.click();
  const mobileAboutLink = page.locator('.xl\\:hidden a[href="/about"]').first();
  await mobileAboutLink.waitFor({ state: 'visible' });
  checksPassed++;

  // Mobile menu toggle close
  await menuButton.click();
  await mobileAboutLink.waitFor({ state: 'hidden' });
  checksPassed++;

  // Mobile menu open and click link to dismiss
  await menuButton.click();
  await mobileAboutLink.waitFor({ state: 'visible' });
  await mobileAboutLink.click();
  await page.waitForURL(`${base}/about`);
  assert.equal(await page.locator('html').getAttribute('lang'), 'en');
  checksPassed++;

  // Language switcher dismissal: outside click
  const langSummary = page.locator('summary[aria-label^="Language"]').first();
  await langSummary.click();
  const details = page.locator('details').first();
  assert.equal(await details.getAttribute('open'), '');
  // Click outside (e.g. at bottom of page)
  await page.mouse.click(10, 700);
  assert.equal(await details.getAttribute('open'), null, 'Outside tap dismisses language menu');
  checksPassed++;

  // Language switcher dismissal: Escape key
  await langSummary.click();
  assert.equal(await details.getAttribute('open'), '');
  await page.keyboard.press('Escape');
  assert.equal(await details.getAttribute('open'), null, 'Escape dismisses language menu');
  checksPassed++;

  // Language switcher link navigation
  await langSummary.click();
  const frLink = page.locator('details a[hreflang="fr"]').first();
  await frLink.click();
  await page.waitForURL(`${base}/fr`);
  assert.equal(await page.locator('html').getAttribute('lang'), 'fr');
  checksPassed++;

  // -------------------------------------------------------------------------
  // 2. Localized calculator results, validation errors and downloads
  // -------------------------------------------------------------------------
  console.log('2. Checking localized calculator results, validation errors & downloads...');
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto(`${base}/fr/tools/aspect-ratio-padding-calculator`, { waitUntil: 'domcontentloaded' });
  await page.locator('[data-hydrated="true"]').waitFor({ state: 'attached', timeout: 20000 });

  // Initial calculation check
  assert.match(await page.locator('pre').textContent(), /padding-top: 56.25%/);
  checksPassed++;

  // Update inputs to 100 x 100
  const widthInput = page.locator('input[type="number"]').nth(0);
  const heightInput = page.locator('input[type="number"]').nth(1);
  await widthInput.fill('100');
  await heightInput.fill('100');
  assert.match(await page.locator('pre').textContent(), /padding-top: 100%/);
  checksPassed++;

  // Validation error on empty / invalid input
  await widthInput.fill('');
  assert.equal(await page.locator('main').getByRole('alert').textContent(), dictionaries.fr.ui.invalid);
  assert.ok(await page.getByRole('button', { name: dictionaries.fr.ui.copy, exact: true }).isDisabled());
  checksPassed++;

  // Reset restores defaults
  await page.getByRole('button', { name: dictionaries.fr.ui.reset, exact: true }).click();
  assert.match(await page.locator('pre').textContent(), /padding-top: 56.25%/);
  checksPassed++;

  // Localized download / copy action check on print-bleed-calculator
  await page.goto(`${base}/fr/tools/print-bleed-calculator`, { waitUntil: 'domcontentloaded' });
  await page.locator('[data-hydrated="true"]').waitFor({ state: 'attached', timeout: 20000 });
  const copyBtn = page.getByRole('button', { name: dictionaries.fr.ui.copy, exact: true });
  if (await copyBtn.count() > 0) {
    await copyBtn.click();
    checksPassed++;
  }

  // -------------------------------------------------------------------------
  // 2b. Browser-generated Markdown-to-PDF downloads (Arabic & Russian)
  // -------------------------------------------------------------------------
  console.log('2b. Checking browser-generated Markdown-to-PDF exports in Arabic and Russian...');
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');

  for (const [targetLocale, sampleMd, prefix] of [
    ['ar', arabicMd, 'browser-arabic'],
    ['ru', russianMd, 'browser-russian'],
  ]) {
    cleanOldScreenshots(publicDir, prefix);
    await page.goto(`${base}/${targetLocale}/tools/markdown-to-pdf`, { waitUntil: 'domcontentloaded' });
    await page.locator('[data-hydrated="true"]').waitFor({ state: 'attached', timeout: 20000 });

    const textarea = page.locator('#markdown-text-area');
    await textarea.waitFor({ state: 'visible', timeout: 15000 });
    await textarea.fill(sampleMd);

    const convertBtn = page.getByRole('button', {
      name: dictionaries[targetLocale].pdfTools.converters.convertAction,
      exact: true,
    });
    await convertBtn.click();

    const downloadLink = page.locator('a[download]');
    await downloadLink.waitFor({ state: 'visible', timeout: 30000 });

    const href = await downloadLink.getAttribute('href');
    assert.ok(href && href.startsWith('blob:'), `Valid blob download URL for ${targetLocale}`);

    const pdfBase64 = await page.evaluate(async (url) => {
      const resp = await fetch(url);
      const buf = await resp.arrayBuffer();
      let binary = '';
      const bytes = new Uint8Array(buf);
      for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      return btoa(binary);
    }, href);

    const pdfBuffer = Buffer.from(pdfBase64, 'base64');
    assert.ok(pdfBuffer.length > 50000, `Downloaded PDF size for ${targetLocale} (${pdfBuffer.length} bytes)`);

    const browserPdfPath = path.join(publicDir, `${prefix}.pdf`);
    writeFileSync(browserPdfPath, pdfBuffer);

    const doc = await pdfjs.getDocument({ data: new Uint8Array(pdfBuffer) }).promise;
    assert.ok(doc.numPages >= 2, `${prefix} has >= 2 pages (got ${doc.numPages})`);

    for (let pNum = 1; pNum <= doc.numPages; pNum++) {
      const pdfPage = await doc.getPage(pNum);
      const viewport = pdfPage.getViewport({ scale: 2.0 });
      const c = createCanvas(viewport.width, viewport.height);
      const cx = c.getContext('2d');
      await pdfPage.render({ canvasContext: cx, viewport }).promise;
      const pngBuf = c.toBuffer('image/png');
      writeFileSync(path.join(publicDir, `${prefix}-page-${pNum}.png`), pngBuf);

      const img = sharp(pngBuf);
      const { data } = await img.raw().toBuffer({ resolveWithObject: true });
      let dark = 0;
      for (let i = 0; i < data.length; i += 4) {
        if (data[i] < 100 && data[i + 1] < 100 && data[i + 2] < 100) dark++;
      }
      assert.ok(dark > 500, `Legible text ink on ${prefix} page ${pNum}`);
    }
    console.log(`[${prefix}] Browser export verified: ${doc.numPages} pages rendered to public/samples/${prefix}-page-*.png`);
    checksPassed += 2;
  }

  // -------------------------------------------------------------------------
  // 3. Corel conversion notices (Mocked backend fixture & localized UI strings)
  // -------------------------------------------------------------------------
  console.log('3. Checking Corel conversion notices (mocked backend fixture) & status strings...');
  await page.route('**/api/coreldraw/convert', (route) => {
    route.fulfill({
      status: 200,
      headers: {
        'Content-Type': 'image/svg+xml',
        'Content-Disposition': 'attachment; filename="sample-coreldraw-ready.svg"',
        'X-Conversion-Notice-Code': 'VECTOR_FIRST_PAGE_ONLY',
        'X-Conversion-Note': 'Vector export contains the first page only.',
      },
      body: '<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"></svg>',
    });
  });

  await page.goto(`${base}/fr/tools/svg-to-cdr-converter`, { waitUntil: 'domcontentloaded' });
  await page.locator('[data-hydrated="true"]').waitFor({ state: 'attached', timeout: 20000 });

  await page.locator('input[type="file"]').setInputFiles({
    name: 'sample.svg',
    mimeType: 'image/svg+xml',
    buffer: Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"></svg>'),
  });

  const frConvertBtn = new RegExp(dictionaries.fr.corelDraw.convertBtn, 'i');
  await page.getByRole('button', { name: frConvertBtn }).click();
  await page.locator('main [aria-live="polite"]').waitFor({ state: 'visible', timeout: 15000 });

  const noticeText = (await page.locator('main [aria-live="polite"] p.text-xs').textContent() || '').trim();
  assert.equal(noticeText, dictionaries.fr.corelDraw.noticeVectorFirstPage);

  const rawEnglishNotice = 'Vector export contains the first page only.';
  const frContent = await page.content();
  assert.ok(!frContent.includes(rawEnglishNotice), 'Raw English server notice NOT displayed in localized UI');
  checksPassed++;

  await page.unroute('**/api/coreldraw/convert');

  // -------------------------------------------------------------------------
  // 4. Trust-page links, contact destinations and privacy disclosures
  // -------------------------------------------------------------------------
  console.log('4. Checking trust-page links, contact destinations & privacy disclosures...');

  // Check English and localized trust links from footer
  for (const loc of ['en', 'fr', 'ar', 'de']) {
    const rootPath = loc === 'en' ? '/' : `/${loc}`;
    await page.goto(`${base}${rootPath}`, { waitUntil: 'domcontentloaded' });
    const footerLinks = await page.locator('footer a').all();
    const hrefs = await Promise.all(footerLinks.map((l) => l.getAttribute('href')));
    for (const trust of ['privacy', 'terms', 'contact', 'about']) {
      const expectedHref = loc === 'en' ? `/${trust}` : `/${loc}/${trust}`;
      assert.ok(hrefs.includes(expectedHref), `Footer link to ${expectedHref} on ${rootPath}`);
      checksPassed++;
    }
  }

  // Regression check: Contact destinations
  for (const loc of ['en', 'fr', 'ar']) {
    const contactPath = loc === 'en' ? '/contact' : `/${loc}/contact`;
    await page.goto(`${base}${contactPath}`, { waitUntil: 'domcontentloaded' });
    const text = await page.textContent('body');
    const content = await page.content();
    assert.ok(text.includes('admin@navorika.com') || content.includes('admin@navorika.com'), `admin@ on ${contactPath}`);
    assert.ok(text.includes('privacy@navorika.com') || content.includes('privacy@navorika.com'), `privacy@ on ${contactPath}`);
    assert.ok(!content.includes('contact@navorika.com'), `No contact@ on ${contactPath}`);
    assert.ok(!content.includes('support@navorika.com'), `No support@ on ${contactPath}`);
    checksPassed++;
  }

  // Regression check: Privacy disclosures
  for (const loc of ['en', 'fr', 'ar']) {
    const privacyPath = loc === 'en' ? '/privacy' : `/${loc}/privacy`;
    await page.goto(`${base}${privacyPath}`, { waitUntil: 'domcontentloaded' });
    const html = await page.content();
    const text = await page.textContent('body');
    assert.ok(html.includes('google.com/settings/ads') || html.includes('aboutads.info'), `Ad opt-out links on ${privacyPath}`);
    assert.ok(text.includes('2026'), `Year 2026 on ${privacyPath}`);
    checksPassed++;
  }

  // -------------------------------------------------------------------------
  // 5. Arabic RTL at 320px and 390px
  // -------------------------------------------------------------------------
  console.log('5. Checking Arabic RTL layout at 320px and 390px...');
  for (const width of [320, 390]) {
    await page.setViewportSize({ width, height: 844 });
    for (const path of ['/ar', '/ar/tools/aspect-ratio-padding-calculator', '/ar/privacy', '/ar/about']) {
      await page.goto(`${base}${path}`, { waitUntil: 'domcontentloaded' });
      const dir = await page.locator('html').getAttribute('dir');
      assert.equal(dir, 'rtl', `html dir=rtl on ${path} at ${width}px`);

      const bodyDir = await page.evaluate(() => window.getComputedStyle(document.body).direction);
      assert.equal(bodyDir, 'rtl', `body computed direction rtl on ${path} at ${width}px`);

      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
      assert.equal(overflow, false, `No horizontal overflow on ${path} at ${width}px`);
      checksPassed++;
    }
  }

  assert.deepEqual(errors, [], 'No uncaught browser exceptions');
  console.log(`\nAll staging smoke tests passed cleanly! (${checksPassed} assertions verified)`);
} finally {
  await cleanup();
}
