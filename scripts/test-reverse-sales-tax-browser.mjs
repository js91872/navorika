import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { readFile } from 'node:fs/promises';
import JSZip from 'jszip';
import { PDFDocument } from 'pdf-lib';
const base = process.env.TAX_TEST_BASE_URL || 'http://127.0.0.1:3123';
const browser = await chromium.launch({ headless: true, ...(process.env.CHROMIUM_EXECUTABLE ? { executablePath: process.env.CHROMIUM_EXECUTABLE } : {}), args: ['--no-sandbox', '--disable-dev-shm-usage'] });
try {
  const context = await browser.newContext({ permissions: ['clipboard-read', 'clipboard-write'] });
  await context.route('**/*', route => route.request().url().startsWith(base) ? route.continue() : route.abort());
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  assert.equal((await page.goto(`${base}/tools/reverse-sales-tax-calculator`)).status(), 200);
  await page.getByRole('heading', { name: 'Reverse Sales Tax Calculator', exact: true }).waitFor();
  const results = page.getByRole('region', { name: 'Your receipt breakdown' });
  assert.match(await results.innerText(), /\$100\.00/);
  await page.getByLabel('Total including tax', { exact: true }).fill('216.50');
  await page.locator('#tax-rate').fill('8.25');
  assert.match(await results.innerText(), /\$200\.00/);
  assert.match(await results.innerText(), /\$16\.50/);
  for (const [label, extension] of [['Export to PDF', 'pdf'], ['Export to Excel', 'xlsx']]) {
    const wait = page.waitForEvent('download');
    await page.getByRole('button', { name: label, exact: true }).click();
    const download = await wait;
    assert.equal(download.suggestedFilename(), `navorika-reverse-sales-tax.${extension}`);
    const bytes = await readFile(await download.path());
    if (extension === 'pdf') assert.equal((await PDFDocument.load(bytes)).getPageCount(), 1);
    else {
      const zip = await JSZip.loadAsync(bytes);
      const sheet = await zip.file('xl/worksheets/sheet1.xml').async('string');
      assert.match(sheet, /<v>200<\/v>/);
      assert.match(sheet, /<v>16.5<\/v>/);
      assert.match(sheet, /<v>216.5<\/v>/);
    }
  }
  await page.getByRole('button', { name: 'Copy result', exact: true }).click();
  await page.getByRole('status').filter({ hasText: 'Result copied.' }).waitFor();
  assert.match(await page.evaluate(() => navigator.clipboard.readText()), /200\.00/);
  await page.getByRole('button', { name: 'Find tax rate', exact: true }).click();
  await page.getByLabel('Price before tax', { exact: true }).fill('200');
  assert.match(await results.innerText(), /8\.25%/);
  const rateDownload = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export to Excel', exact: true }).click();
  const rateZip = await JSZip.loadAsync(await readFile(await (await rateDownload).path()));
  assert.match(await rateZip.file('xl/worksheets/sheet1.xml').async('string'), /Implied tax rate/);
  await page.getByLabel('Price before tax', { exact: true }).fill('300');
  assert.match(await results.innerText(), /no higher than the total/);
  assert.equal(await page.getByRole('button', { name: 'Copy result', exact: true }).isDisabled(), true);
  assert.equal(await page.getByRole('button', { name: 'Export to PDF', exact: true }).isDisabled(), true);
  assert.equal(await page.getByRole('button', { name: 'Export to Excel', exact: true }).isDisabled(), true);
  await page.getByRole('button', { name: 'Find price before tax', exact: true }).click();
  await page.getByRole('button', { name: 'Clear inputs', exact: true }).click();
  assert.match(await results.innerText(), /Enter both values/);
  await page.getByRole('button', { name: '108 at 8%', exact: true }).click();
  await page.locator('#tax-currency').selectOption('GBP');
  assert.match(await results.innerText(), /£100\.00/);
  for (const width of [375, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `Overflow at ${width}`);
  }
  assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), 'https://navorika.com/tools/reverse-sales-tax-calculator');
  const types = await page.locator('script[type="application/ld+json"]').evaluateAll(nodes => nodes.flatMap(n => { const s = JSON.parse(n.textContent); return (s['@graph'] || [s]).map(x => x['@type']); }));
  for (const type of ['WebApplication', 'Article', 'FAQPage', 'BreadcrumbList']) assert.ok(types.includes(type), type);
  assert.match(await (await context.request.get(`${base}/sitemap.xml`)).text(), /tools\/reverse-sales-tax-calculator/);
  assert.match(await (await context.request.get(`${base}/tools.json`)).text(), /reverse-sales-tax-calculator/);
  assert.deepEqual(errors, []);
  console.log('PASS: receipt arithmetic, rate mode, validation, clear, currency, clipboard, PDF/XLSX downloads, 3 viewport widths, canonical, 4 schema types, sitemap/catalog, no browser errors.');
} finally { await browser.close(); }
