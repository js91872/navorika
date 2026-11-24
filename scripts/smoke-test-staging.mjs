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
  // 5. Arabic RTL and Responsive Layout at 320px, 390px, and Desktop
  // -------------------------------------------------------------------------
  console.log('5. Checking Arabic RTL layout and responsive viewports (light & dark)...');
  for (const colorScheme of ['light', 'dark']) {
    await page.emulateMedia({ colorScheme });
    for (const width of [320, 390, 1280]) {
      await page.setViewportSize({ width, height: 844 });
      for (const loc of ['ar', 'de', 'it']) {
        const path = `/${loc}`;
        await page.goto(`${base}${path}`, { waitUntil: 'domcontentloaded' });
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
        assert.equal(overflow, false, `No horizontal overflow on ${path} at ${width}px (${colorScheme})`);
        if (loc === 'ar') {
          const dir = await page.locator('html').getAttribute('dir');
          assert.equal(dir, 'rtl', `html dir=rtl on ${path} at ${width}px`);
        }
        checksPassed++;
      }
    }
  }

  // Deep checks for Arabic tool and trust pages
  for (const width of [320, 390]) {
    await page.setViewportSize({ width, height: 844 });
    for (const path of ['/ar/tools/aspect-ratio-padding-calculator', '/ar/privacy', '/ar/about']) {
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

  // -------------------------------------------------------------------------
  // 6. Navigation states, translated logo labels, result announcements & accessibility
  // -------------------------------------------------------------------------
  console.log('6. Checking navigation states, logo labels, result announcements & accessible controls...');
  await page.emulateMedia({ colorScheme: 'light' });

  for (const loc of ['it', 'de', 'ar']) {
    const d = dictionaries[loc];
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(`${base}/${loc}`, { waitUntil: 'domcontentloaded' });

    // Logo label and tagline checks
    const headerLogo = page.locator('header a[aria-label]').first();
    assert.equal(await headerLogo.getAttribute('aria-label'), d.ui.brandHome, `Header logo aria-label on /${loc}`);
    checksPassed++;

    const footerLogo = page.locator('footer a[aria-label]').first();
    assert.equal(await footerLogo.getAttribute('aria-label'), d.ui.brandHome, `Footer logo aria-label on /${loc}`);
    const footerTagline = page.locator('footer span.uppercase').first();
    assert.equal((await footerTagline.textContent())?.trim(), d.ui.brandTagline, `Footer logo tagline on /${loc}`);
    checksPassed += 2;

    // Navigation active states on home page
    const homeNavLink = page.locator(`header nav[aria-label="${d.ui.navigation}"] a[href="/${loc}"]`).first();
    const toolsNavLink = page.locator(`header nav[aria-label="${d.ui.navigation}"] a[href="/${loc}#tools"]`).first();
    const aboutNavLink = page.locator(`header nav[aria-label="${d.ui.navigation}"] a[href="/${loc}/about"]`).first();

    assert.equal(await homeNavLink.getAttribute('aria-current'), 'page', `Home nav aria-current="page" on /${loc}`);
    assert.match(await homeNavLink.getAttribute('class'), /bg-indigo-500\/10/, `Home nav active class on /${loc}`);
    assert.equal(await toolsNavLink.getAttribute('aria-current'), null, `Tools nav not aria-current on /${loc}`);
    assert.doesNotMatch(await toolsNavLink.getAttribute('class'), /bg-indigo-500\/10/, `Tools nav not active on /${loc}`);
    assert.equal(await aboutNavLink.getAttribute('aria-current'), null, `About nav not aria-current on /${loc}`);
    assert.doesNotMatch(await aboutNavLink.getAttribute('class'), /bg-indigo-500\/10/, `About nav not active on /${loc}`);
    checksPassed += 6;

    // About page navigation states
    await page.goto(`${base}/${loc}/about`, { waitUntil: 'domcontentloaded' });
    const aboutOnAbout = page.locator(`header nav[aria-label="${d.ui.navigation}"] a[href="/${loc}/about"]`).first();
    const toolsOnAbout = page.locator(`header nav[aria-label="${d.ui.navigation}"] a[href="/${loc}#tools"]`).first();
    const homeOnAbout = page.locator(`header nav[aria-label="${d.ui.navigation}"] a[href="/${loc}"]`).first();

    assert.equal(await aboutOnAbout.getAttribute('aria-current'), 'page', `About nav aria-current on /${loc}/about`);
    assert.match(await aboutOnAbout.getAttribute('class'), /bg-indigo-500\/10/, `About nav active on /${loc}/about`);
    assert.equal(await toolsOnAbout.getAttribute('aria-current'), null, `Tools nav not aria-current on /${loc}/about`);
    assert.doesNotMatch(await toolsOnAbout.getAttribute('class'), /bg-indigo-500\/10/, `Tools nav not active on /${loc}/about`);
    assert.equal(await homeOnAbout.getAttribute('aria-current'), null, `Home nav not aria-current on /${loc}/about`);
    checksPassed += 5;

    // Tool detail page navigation states
    await page.goto(`${base}/${loc}/tools/aspect-ratio-padding-calculator`, { waitUntil: 'domcontentloaded' });
    const toolsOnTool = page.locator(`header nav[aria-label="${d.ui.navigation}"] a[href="/${loc}#tools"]`).first();
    const aboutOnTool = page.locator(`header nav[aria-label="${d.ui.navigation}"] a[href="/${loc}/about"]`).first();
    const homeOnTool = page.locator(`header nav[aria-label="${d.ui.navigation}"] a[href="/${loc}"]`).first();

    assert.match(await toolsOnTool.getAttribute('class'), /bg-indigo-500\/10/, `Tools nav active on /${loc}/tools/...`);
    assert.doesNotMatch(await aboutOnTool.getAttribute('class'), /bg-indigo-500\/10/, `About nav not active on /${loc}/tools/...`);
    assert.doesNotMatch(await homeOnTool.getAttribute('class'), /bg-indigo-500\/10/, `Home nav not active on /${loc}/tools/...`);
    checksPassed += 3;

    // Return to home page to test search announcements and category accessibility
    await page.goto(`${base}/${loc}`, { waitUntil: 'domcontentloaded' });

    // Category filter button accessibility (aria-pressed)
    const allCatBtn = page.locator('#tools button[aria-pressed]').first();
    assert.equal(await allCatBtn.getAttribute('aria-pressed'), 'true', `All category button aria-pressed="true" on /${loc}`);
    const pdfCatBtn = page.locator('#tools button[aria-pressed]').nth(1);
    assert.equal(await pdfCatBtn.getAttribute('aria-pressed'), 'false', `PDF category button aria-pressed="false" on /${loc}`);
    checksPassed += 2;

    // Click category filter
    await pdfCatBtn.click();
    assert.equal(await pdfCatBtn.getAttribute('aria-pressed'), 'true', `PDF category button pressed after click on /${loc}`);
    assert.equal(await allCatBtn.getAttribute('aria-pressed'), 'false', `All category button unpressed on /${loc}`);
    checksPassed += 2;

    // Tool icons on cards
    const firstCardIcon = page.locator('#tools a[href*="/tools/"] span[aria-hidden="true"]').first();
    assert.ok(((await firstCardIcon.textContent()) || '').trim().length > 0, `Tool icon rendered on card on /${loc}`);
    checksPassed++;

    // Reset filter
    await allCatBtn.click();

    // Search announcements
    const searchInput = page.locator('input[type="search"]#tool-search');
    await searchInput.fill(d.tools['rgb-cmyk-image-checker'].title);
    const expectedAnnounce1 = `${new Intl.NumberFormat(loc).format(1)} ${d.ui.toolsFound}`;
    assert.equal(await page.getByRole('status').textContent(), expectedAnnounce1, `Search announcement on /${loc}`);
    checksPassed++;

    await searchInput.fill('zzzz-not-a-tool');
    assert.equal(await page.getByRole('status').textContent(), d.ui.noResults, `Empty search announcement on /${loc}`);
    checksPassed++;

    // Mobile menu accessibility states at 390px
    await page.setViewportSize({ width: 390, height: 844 });
    const mobileMenuBtn = page.locator('header button[aria-controls="mobile-navigation-menu"]');
    assert.equal(await mobileMenuBtn.getAttribute('aria-expanded'), 'false', `Mobile menu button aria-expanded="false" on /${loc}`);
    assert.equal(await mobileMenuBtn.getAttribute('aria-label'), d.ui.menuToggle, `Mobile menu button aria-label on /${loc}`);

    // Open mobile menu
    await mobileMenuBtn.click();
    assert.equal(await mobileMenuBtn.getAttribute('aria-expanded'), 'true', `Mobile menu button aria-expanded="true" on /${loc}`);
    const menuContainer = page.locator('#mobile-navigation-menu');
    await menuContainer.waitFor({ state: 'visible' });
    checksPassed += 3;

    // Escape dismissal
    await page.keyboard.press('Escape');
    await menuContainer.waitFor({ state: 'hidden' });
    assert.equal(await mobileMenuBtn.getAttribute('aria-expanded'), 'false', `Mobile menu closed on Escape on /${loc}`);
    checksPassed += 2;

    // Reopen and outside click dismissal
    await mobileMenuBtn.click();
    await menuContainer.waitFor({ state: 'visible' });
    await page.mouse.click(10, 700);
    await menuContainer.waitFor({ state: 'hidden' });
    assert.equal(await mobileMenuBtn.getAttribute('aria-expanded'), 'false', `Mobile menu closed on outside click on /${loc}`);
    checksPassed += 2;
  }

  assert.deepEqual(errors, [], 'No uncaught browser exceptions');
  console.log(`\nAll staging smoke tests passed cleanly! (${checksPassed} assertions verified)`);
} finally {
  await cleanup();
}
