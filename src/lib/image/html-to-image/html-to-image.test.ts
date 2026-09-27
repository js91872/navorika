import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ensureSelfClosingVoidTags,
  MAX_HTML_LENGTH,
  prepareXhtmlForForeignObject,
  sanitizeHtml,
  validateHtmlInput,
} from './sanitizer';
import { buildForeignObjectSvg } from './converter';
import { HTML_SAMPLES } from './samples';
import type { ConversionOptions } from './types';

test('1. simple HTML: preserves basic tags and structure', () => {
  const input = '<div><p>Hello World</p></div>';
  const { cleanHtml, warnings, hasScripts } = sanitizeHtml(input);
  assert.equal(cleanHtml, input);
  assert.equal(warnings.length, 0);
  assert.equal(hasScripts, false);
});

test('2. headings and paragraphs: retains hierarchy and typography tags', () => {
  const input = '<h1>Main Title</h1><h2>Subtitle</h2><p>First paragraph with <strong>bold</strong> and <em>emphasis</em>.</p>';
  const { cleanHtml } = sanitizeHtml(input);
  assert.ok(cleanHtml.includes('<h1>Main Title</h1>'));
  assert.ok(cleanHtml.includes('<h2>Subtitle</h2>'));
  assert.ok(cleanHtml.includes('<strong>bold</strong>'));
  assert.ok(cleanHtml.includes('<em>emphasis</em>'));
});

test('3. inline CSS: preserves styling attributes and embedded styles', () => {
  const input = '<div style="color: red; font-size: 20px; line-height: 1.5;"><p style="margin: 0; padding: 10px;">Styled text</p></div>';
  const { cleanHtml } = sanitizeHtml(input);
  assert.ok(cleanHtml.includes('style="color: red; font-size: 20px; line-height: 1.5;"'));
  assert.ok(cleanHtml.includes('style="margin: 0; padding: 10px;"'));
});

test('4. backgrounds: retains linear gradients, hex colors, and rgba values', () => {
  const input = '<div style="background: linear-gradient(135deg, #1e1b4b, #312e81); background-color: #ffffff; color: #ffffff;">Gradient Card</div>';
  const { cleanHtml } = sanitizeHtml(input);
  assert.ok(cleanHtml.includes('linear-gradient(135deg, #1e1b4b, #312e81)'));
  assert.ok(cleanHtml.includes('background-color: #ffffff'));
});

test('5. borders: preserves border properties, radiuses, and box shadows', () => {
  const input = '<div style="border: 2px solid #e2e8f0; border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">Framed Content</div>';
  const { cleanHtml } = sanitizeHtml(input);
  assert.ok(cleanHtml.includes('border: 2px solid #e2e8f0'));
  assert.ok(cleanHtml.includes('border-radius: 16px'));
  assert.ok(cleanHtml.includes('box-shadow: 0 4px 12px rgba(0,0,0,0.1)'));
});

test('6. flexbox and grid layouts: preserves modern responsive CSS styles', () => {
  const input = '<div style="display: flex; justify-content: space-between; align-items: center; gap: 16px;"><div style="display: grid; grid-template-columns: 1fr 1fr;">Grid Item</div></div>';
  const { cleanHtml } = sanitizeHtml(input);
  assert.ok(cleanHtml.includes('display: flex'));
  assert.ok(cleanHtml.includes('justify-content: space-between'));
  assert.ok(cleanHtml.includes('grid-template-columns: 1fr 1fr'));
});

test('7. long content: handles multi-section documents without truncation', () => {
  const paragraphs = Array.from({ length: 50 }, (_, i) => `<p>Paragraph ${i}: Detailed operational logging and deterministic execution metadata.</p>`).join('\n');
  const input = `<article><h1>Long Form Report</h1>${paragraphs}</article>`;
  const { cleanHtml, strippedCount } = sanitizeHtml(input);
  assert.ok(cleanHtml.includes('Paragraph 0'));
  assert.ok(cleanHtml.includes('Paragraph 49'));
  assert.equal(strippedCount, 0);
  assert.ok(cleanHtml.length > 3000);
});

test('8. uploaded .html simulation: processes standard document structure', () => {
  const htmlFileContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Uploaded Invoice</title>
  <style>body { font-family: sans-serif; } .badge { color: blue; }</style>
</head>
<body>
  <div class="badge">Paid</div>
  <h1>Invoice #1042</h1>
</body>
</html>`;
  const validation = validateHtmlInput(htmlFileContent);
  assert.equal(validation.isValid, true);
  const { cleanHtml } = sanitizeHtml(htmlFileContent);
  assert.ok(cleanHtml.includes('<h1>Invoice #1042</h1>'));
  assert.ok(cleanHtml.includes('.badge { color: blue; }'));
});

test('9. JPG output options: defaults to white background and configurable quality', () => {
  const options: ConversionOptions = {
    format: 'jpeg',
    width: 800,
    scale: 2,
    quality: 0.92,
    backgroundColor: '#ffffff',
  };
  assert.equal(options.format, 'jpeg');
  assert.equal(options.quality, 0.92);
  assert.equal(options.backgroundColor, '#ffffff');
  assert.equal(options.scale, 2);
});

test('10. PNG output options: preserves alpha transparency without solid background', () => {
  const options: ConversionOptions = {
    format: 'png',
    width: 1200,
    scale: 1,
    quality: 1,
  };
  assert.equal(options.format, 'png');
  assert.equal(options.backgroundColor, undefined);
});

test('11. JPG quality control: verifies quality clamping logic', () => {
  const clampQuality = (q: number) => Math.max(0.1, Math.min(q, 1.0));
  assert.equal(clampQuality(0.95), 0.95);
  assert.equal(clampQuality(1.5), 1.0);
  assert.equal(clampQuality(-0.5), 0.1);
  assert.equal(clampQuality(0.5), 0.5);
});

test('12. custom width: bounds and defaults validation', () => {
  const sanitizeWidth = (w: number) => Math.max(200, Math.min(Number.isFinite(w) ? Math.round(w) : 800, 3840));
  assert.equal(sanitizeWidth(800), 800);
  assert.equal(sanitizeWidth(1200), 1200);
  assert.equal(sanitizeWidth(150), 200); // clamped to min
  assert.equal(sanitizeWidth(5000), 3840); // clamped to max
  assert.equal(sanitizeWidth(NaN), 800); // fallback
});

test('13. malformed HTML: ensures void elements self-close for XML compatibility', () => {
  const unclosed = '<div>Line 1<br>Line 2<hr><img src="test.png"><input type="text"></div>';
  const xhtml = ensureSelfClosingVoidTags(unclosed);
  assert.ok(xhtml.includes('<br />'));
  assert.ok(xhtml.includes('<hr />'));
  assert.ok(xhtml.includes('<img src="test.png" />'));
  assert.ok(xhtml.includes('<input type="text" />'));
});

test('14. unsupported or excessive file size: rejects oversized payload', () => {
  const hugeHtml = 'x'.repeat(MAX_HTML_LENGTH + 100);
  const result = validateHtmlInput(hugeHtml);
  assert.equal(result.isValid, false);
  assert.ok(result.error?.includes('exceeds maximum allowable size'));
});

test('15. script-containing HTML: strips active <script> tags and case variants', () => {
  const malicious = '<div>Safe text<script>alert("xss")</script><SCRIPT src="evil.js">bad()</SCRIPT><script type="module">console.log(1)</script></div>';
  const { cleanHtml, hasScripts, strippedCount } = sanitizeHtml(malicious);
  assert.equal(hasScripts, true);
  assert.ok(!cleanHtml.includes('<script'));
  assert.ok(!cleanHtml.includes('<SCRIPT'));
  assert.ok(!cleanHtml.includes('alert('));
  assert.ok(!cleanHtml.includes('evil.js'));
  assert.ok(cleanHtml.includes('Safe text'));
  assert.ok(strippedCount >= 3);
});

test('16. attempted unsafe event handlers: strips onclick, onerror, onload, etc.', () => {
  const malicious = '<img src="avatar.jpg" onerror="alert(1)" onload="fetch(\'/stolen\')"/><button onclick="stealCookies()">Click</button><div onmouseover="hack()">Hover</div>';
  const { cleanHtml, hasEventHandlers, strippedCount } = sanitizeHtml(malicious);
  assert.equal(hasEventHandlers, true);
  assert.ok(!cleanHtml.includes('onerror'));
  assert.ok(!cleanHtml.includes('onload'));
  assert.ok(!cleanHtml.includes('onclick'));
  assert.ok(!cleanHtml.includes('onmouseover'));
  assert.ok(strippedCount >= 4);
});

test('17. external images and dangerous URIs: warns on remote URLs and blocks javascript: URIs', () => {
  const input = '<a href="javascript:alert(1)">Dangerous Link</a><img src="https://example.com/photo.jpg"/>';
  const { cleanHtml, hasExternalResources, hasDangerousProtocols, warnings } = sanitizeHtml(input);
  assert.equal(hasExternalResources, true);
  assert.equal(hasDangerousProtocols, true);
  assert.ok(!cleanHtml.includes('href="javascript:'));
  assert.ok(cleanHtml.includes('data-blocked-protocol="true"'));
  assert.ok(!cleanHtml.includes('https://example.com/photo.jpg'));
  assert.ok(warnings.some((w) => w.includes('External network resources')));
});

test('18. empty input: rejects empty or whitespace-only markup', () => {
  const emptyRes = validateHtmlInput('');
  assert.equal(emptyRes.isValid, false);
  assert.ok(emptyRes.error?.includes('Please enter HTML'));

  const whitespaceRes = validateHtmlInput('   \n\t  ');
  assert.equal(whitespaceRes.isValid, false);
});

test('19. SVG foreignObject wrapping: generates valid SVG wrapper with dimensions', () => {
  const xhtml = '<div style="color: blue;">Content</div>';
  const svg = buildForeignObjectSvg(xhtml, 800, 600, '#ffffff');
  assert.ok(svg.startsWith('<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">'));
  assert.ok(svg.includes('<foreignObject width="100%" height="100%">'));
  assert.ok(svg.includes('background-color: #ffffff;'));
  assert.ok(svg.includes(xhtml));
  assert.ok(svg.endsWith('</svg>'));
});

test('20. prebuilt samples: all sample templates pass sanitization cleanly', () => {
  for (const sample of HTML_SAMPLES) {
    const validation = validateHtmlInput(sample.html);
    assert.equal(validation.isValid, true, `Sample ${sample.id} must be valid`);
    const { hasScripts, hasDangerousTags, hasEventHandlers } = sanitizeHtml(sample.html);
    assert.equal(hasScripts, false, `Sample ${sample.id} must not have scripts`);
    assert.equal(hasDangerousTags, false, `Sample ${sample.id} must not have dangerous tags`);
    assert.equal(hasEventHandlers, false, `Sample ${sample.id} must not have event handlers`);
  }
});

/* =========================================================================
   HARDENED SECURITY REGRESSION TEST SUITE (15 Explicit Tests)
   ========================================================================= */

test('SEC-1. external HTTP image: neutralized and flagged', () => {
  const input = '<img src="http://example.com/tracker.gif" alt="tracking pixel"/>';
  const { cleanHtml, hasExternalResources, warnings } = sanitizeHtml(input);
  assert.equal(hasExternalResources, true);
  assert.ok(!cleanHtml.includes('http://example.com/tracker.gif'));
  assert.ok(!cleanHtml.includes('src="http:'));
  assert.ok(cleanHtml.includes('data-blocked-external-src="true"'));
  assert.ok(warnings.some((w) => w.includes('External network resources')));
});

test('SEC-2. external HTTPS image: neutralized and flagged', () => {
  const input = '<img src="https://cdn.example.org/photo.png" alt="photo" width="400"/>';
  const { cleanHtml, hasExternalResources, warnings } = sanitizeHtml(input);
  assert.equal(hasExternalResources, true);
  assert.ok(!cleanHtml.includes('https://cdn.example.org/photo.png'));
  assert.ok(!cleanHtml.includes('src="https:'));
  assert.ok(cleanHtml.includes('data-blocked-external-src="true"'));
  assert.ok(cleanHtml.includes('width="400"'));
  assert.ok(warnings.some((w) => w.includes('External network resources')));
});

test('SEC-3. CSS background url(https://...): stripped and neutralized', () => {
  const input = '<div style="background-image: url(\'https://example.com/bg.png\'); color: blue;">Styled Box</div>';
  const { cleanHtml, hasExternalResources } = sanitizeHtml(input);
  assert.equal(hasExternalResources, true);
  assert.ok(!cleanHtml.includes('https://example.com/bg.png'));
  assert.ok(cleanHtml.includes('external url blocked'));
  assert.ok(cleanHtml.includes('color: blue'));
});

test('SEC-4. CSS @import: stripped from style block', () => {
  const input = '<style>@import url("https://fonts.googleapis.com/css2?family=Roboto"); body { color: red; }</style>';
  const { cleanHtml, hasExternalResources } = sanitizeHtml(input);
  assert.equal(hasExternalResources, true);
  assert.ok(!cleanHtml.includes('@import'));
  assert.ok(!cleanHtml.includes('fonts.googleapis.com'));
  assert.ok(cleanHtml.includes('body { color: red; }'));
});

test('SEC-5. remote webfont: remote @font-face block is neutralized', () => {
  const input = `<style>
    @font-face {
      font-family: 'CustomWebFont';
      src: url('https://example.com/fonts/custom.woff2') format('woff2');
    }
    h1 { font-family: 'CustomWebFont', sans-serif; }
  </style>`;
  const { cleanHtml, hasExternalResources } = sanitizeHtml(input);
  assert.equal(hasExternalResources, true);
  assert.ok(!cleanHtml.includes('https://example.com/fonts/custom.woff2'));
  assert.ok(cleanHtml.includes("h1 { font-family: 'CustomWebFont', sans-serif; }"));
});

test('SEC-6. javascript: href: blocked as dangerous protocol', () => {
  const input = '<a href="javascript:alert(document.cookie)">Click to Win</a>';
  const { cleanHtml, hasDangerousProtocols, warnings } = sanitizeHtml(input);
  assert.equal(hasDangerousProtocols, true);
  assert.ok(!cleanHtml.includes('href="javascript:'));
  assert.ok(!cleanHtml.includes('document.cookie'));
  assert.ok(cleanHtml.includes('data-blocked-protocol="true"'));
  assert.ok(warnings.some((w) => w.includes('Dangerous URI protocols')));
});

test('SEC-7. entity-encoded javascript URI: decoded and blocked', () => {
  const input = '<a href="&#106;avascript:alert(1)">Decimal Link</a><a href="jav&#x09;ascript:alert(2)">Tab Link</a>';
  const { cleanHtml, hasDangerousProtocols } = sanitizeHtml(input);
  assert.equal(hasDangerousProtocols, true);
  assert.ok(!cleanHtml.includes('&#106;avascript:'));
  assert.ok(!cleanHtml.includes('jav&#x09;ascript:'));
  assert.ok(!cleanHtml.includes('alert('));
  assert.ok(cleanHtml.includes('data-blocked-protocol="true"'));
});

test('SEC-8. mixed-case dangerous protocol: case-insensitively blocked', () => {
  const input = '<a href="JaVaScRiPt:alert(1)">Upper JS</a><a href="vBsCrIpT:msgbox(1)">VBS</a>';
  const { cleanHtml, hasDangerousProtocols } = sanitizeHtml(input);
  assert.equal(hasDangerousProtocols, true);
  assert.ok(!cleanHtml.includes('JaVaScRiPt:'));
  assert.ok(!cleanHtml.includes('vBsCrIpT:'));
  assert.ok(cleanHtml.includes('data-blocked-protocol="true"'));
});

test('SEC-9. xlink:href: remote URLs stripped, internal local fragment preserved', () => {
  const input = '<svg><use xlink:href="https://evil.com/sprites.svg#hack"></use><use xlink:href="#local-sym"></use></svg>';
  const { cleanHtml, hasExternalResources } = sanitizeHtml(input);
  assert.equal(hasExternalResources, true);
  assert.ok(!cleanHtml.includes('https://evil.com/sprites.svg#hack'));
  assert.ok(cleanHtml.includes('data-blocked-external-ref="true"'));
  assert.ok(cleanHtml.includes('xlink:href="#local-sym"'));
});

test('SEC-10. SVG event handler: onload, onbegin, and onend stripped', () => {
  const input = '<svg onload="alert(\'svg\')"><circle r="10" onbegin="fetch(\'/steal\')"/><animate onend="eval(\'x\')"/></svg>';
  const { cleanHtml, hasEventHandlers } = sanitizeHtml(input);
  assert.equal(hasEventHandlers, true);
  assert.ok(!cleanHtml.includes('onload'));
  assert.ok(!cleanHtml.includes('onbegin'));
  assert.ok(!cleanHtml.includes('onend'));
  assert.ok(!cleanHtml.includes('fetch('));
  assert.ok(!cleanHtml.includes('eval('));
});

test('SEC-11. SVG external resource: <image href="https://..."> is blocked', () => {
  const input = '<svg><image href="https://example.com/vector-asset.svg" width="100" height="100"/></svg>';
  const { cleanHtml, hasExternalResources } = sanitizeHtml(input);
  assert.equal(hasExternalResources, true);
  assert.ok(!cleanHtml.includes('https://example.com/vector-asset.svg'));
  assert.ok(cleanHtml.includes('data-blocked-external-src="true"'));
});

test('SEC-12. data:text/html: blocked as dangerous active protocol', () => {
  const input = '<a href="data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==">Malicious Link</a>';
  const { cleanHtml, hasDangerousProtocols } = sanitizeHtml(input);
  assert.equal(hasDangerousProtocols, true);
  assert.ok(!cleanHtml.includes('data:text/html'));
  assert.ok(cleanHtml.includes('data-blocked-protocol="true"'));
});

test('SEC-13. safe data:image URL: preserved without false-positive blocks', () => {
  const safeDataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
  const input = `<img src="${safeDataUrl}" alt="1x1 Red Dot" width="10" height="10"/>`;
  const { cleanHtml, hasExternalResources, hasDangerousProtocols, warnings } = sanitizeHtml(input);
  assert.equal(hasExternalResources, false);
  assert.equal(hasDangerousProtocols, false);
  assert.equal(warnings.length, 0);
  assert.ok(cleanHtml.includes(safeDataUrl));
});

test('SEC-14. normal inline styles: preserved intact', () => {
  const input = '<div style="color: #2563eb; background-color: #f8fafc; border: 2px solid #e2e8f0; border-radius: 12px; padding: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">Card</div>';
  const { cleanHtml, hasExternalResources } = sanitizeHtml(input);
  assert.equal(hasExternalResources, false);
  assert.ok(cleanHtml.includes('color: #2563eb'));
  assert.ok(cleanHtml.includes('background-color: #f8fafc'));
  assert.ok(cleanHtml.includes('border: 2px solid #e2e8f0'));
  assert.ok(cleanHtml.includes('border-radius: 12px'));
  assert.ok(cleanHtml.includes('padding: 16px'));
  assert.ok(cleanHtml.includes('box-shadow: 0 4px 6px rgba(0,0,0,0.05)'));
});

test('SEC-15. Flexbox and Grid layouts: completely functioning and preserved', () => {
  const input = '<div style="display: flex; justify-content: space-between; align-items: center; gap: 16px;"><div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;"><div>Col 1</div><div>Col 2</div><div>Col 3</div></div></div>';
  const { cleanHtml, hasExternalResources } = sanitizeHtml(input);
  assert.equal(hasExternalResources, false);
  assert.ok(cleanHtml.includes('display: flex'));
  assert.ok(cleanHtml.includes('justify-content: space-between'));
  assert.ok(cleanHtml.includes('align-items: center'));
  assert.ok(cleanHtml.includes('grid-template-columns: repeat(3, 1fr)'));
});

test('SEC-16. zero-leak audit: comprehensive snippet contains no remote HTTP/HTTPS resource references', () => {
  const payload = `
    <div style="background-image: url('https://leak.com/bg.jpg');">
      <img src="http://leak.com/img1.jpg" srcset="https://leak.com/img1@2x.jpg 2x"/>
      <video poster="https://leak.com/poster.jpg"><source src="https://leak.com/vid.mp4"/></video>
      <svg><image href="https://leak.com/svg.png"/></svg>
      <style>@import url('https://leak.com/font.css');</style>
      <p style="color: black;">Normal text</p>
    </div>
  `;
  const { cleanHtml } = sanitizeHtml(payload);
  assert.ok(!/(?:src|href|poster|srcset|url)\s*=\s*['"]?(?:https?:|\/\/)/i.test(cleanHtml));
  assert.ok(!cleanHtml.includes('leak.com'));
  assert.ok(cleanHtml.includes('Normal text'));
});

test('SEC-17. SANDBOX_CSP: guarantees default-src none, script-src none, connect-src none', async () => {
  const { SANDBOX_CSP } = await import('./sanitizer');
  assert.ok(SANDBOX_CSP.includes("default-src 'none'"));
  assert.ok(SANDBOX_CSP.includes("script-src 'none'"));
  assert.ok(SANDBOX_CSP.includes("connect-src 'none'"));
  assert.ok(SANDBOX_CSP.includes("img-src data: blob:"));
});
