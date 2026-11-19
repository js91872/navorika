import { spawn } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { chromium } from 'playwright';

const port = 3117;
const base = `http://127.0.0.1:${port}`;
const outDir = join(process.cwd(), 'docs/screenshots/id');
if (!existsSync(outDir)) {
  mkdirSync(outDir, { recursive: true });
}

console.log('Starting Next.js production server on port', port);
const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--hostname', '127.0.0.1', '--port', String(port)], {
  stdio: ['ignore', 'pipe', 'pipe'],
});

let serverOutput = '';
server.stdout.on('data', (d) => { serverOutput += d; });
server.stderr.on('data', (d) => { serverOutput += d; });

async function waitForServer() {
  for (let i = 0; i < 60; i++) {
    try {
      const res = await fetch(`${base}/id`);
      if (res.ok) return true;
    } catch (e) {
      // wait
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`Server failed to start:\n${serverOutput}`);
}

async function run() {
  try {
    await waitForServer();
    console.log('Server is ready. Launching Chromium...');

    const browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
    });

    // 1. Indonesian Home (Desktop 1440x900)
    {
      const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
      const page = await context.newPage();
      await page.goto(`${base}/id`, { waitUntil: 'networkidle' });
      const path = join(outDir, '01_indonesian_home.png');
      await page.screenshot({ path, fullPage: false });
      console.log('Saved:', path);
      await context.close();
    }

    // 2. Representative Calculator (Desktop 1440x900)
    {
      const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
      const page = await context.newPage();
      await page.goto(`${base}/id/tools/aspect-ratio-padding-calculator`, { waitUntil: 'networkidle' });
      const path = join(outDir, '02_representative_calculator.png');
      await page.screenshot({ path, fullPage: false });
      console.log('Saved:', path);
      await context.close();
    }

    // 3. PDF Converter (Desktop 1440x900)
    {
      const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
      const page = await context.newPage();
      await page.goto(`${base}/id/tools/merge-pdf`, { waitUntil: 'networkidle' });
      const path = join(outDir, '03_pdf_converter.png');
      await page.screenshot({ path, fullPage: false });
      console.log('Saved:', path);
      await context.close();
    }

    // 4. Mobile Language Selector (Mobile 390x844)
    {
      const context = await browser.newContext({
        viewport: { width: 390, height: 844 },
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1',
      });
      const page = await context.newPage();
      await page.goto(`${base}/id`, { waitUntil: 'networkidle' });
      
      // Look for the language selector trigger (details or button)
      // Header has language switcher details element or button
      const langTrigger = page.locator('header details summary, header button[aria-label*="bahasa"], header [data-language-switcher]').first();
      if (await langTrigger.isVisible()) {
        await langTrigger.click();
        await page.waitForTimeout(300);
      } else {
        // Try mobile menu trigger first if in mobile hamburger
        const menuBtn = page.locator('header button[aria-label*="menu"], header button[aria-expanded]').first();
        if (await menuBtn.isVisible()) {
          await menuBtn.click();
          await page.waitForTimeout(300);
          const mobileLang = page.locator('details summary, [aria-label*="bahasa"]').first();
          if (await mobileLang.isVisible()) {
            await mobileLang.click();
            await page.waitForTimeout(300);
          }
        }
      }
      const path = join(outDir, '04_mobile_language_selector.png');
      await page.screenshot({ path, fullPage: false });
      console.log('Saved:', path);
      await context.close();
    }

    await browser.close();
    console.log('All screenshots captured successfully!');
  } finally {
    server.kill('SIGTERM');
  }
}

run().catch((err) => {
  console.error('Screenshot script error:', err);
  server.kill('SIGTERM');
  process.exit(1);
});
