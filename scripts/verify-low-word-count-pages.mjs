import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { pageHelp } from '../src/data/pageHelp.ts';

// Check the actual production HTML, not RSC payloads or source strings. Run after npm run build.
const audit = JSON.parse(readFileSync('docs/low-word-count-audit.json', 'utf8'));
assert.equal(audit.pages.length, 52);
assert.deepEqual(Object.keys(pageHelp).sort(), audit.pages.map(({ path }) => path).sort());
const stripMarkup = (html) => html
  .replace(/<(script|style|noscript)\b[^>]*>[\s\S]*?<\/\1>/gi, '')
  .replace(/<[^>]*>/g, ' ')
  .replace(/&(?:[a-z]+|#\d+|#x[\da-f]+);/gi, ' ');
let minimum = Infinity;
for (const { path } of audit.pages) {
  const html = readFileSync(`.next/server/app${path}.html`, 'utf8');
  const withoutScripts = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
  const markers = [...withoutScripts.matchAll(/<article data-page-help="([^"]+)"/g)];
  assert.equal(markers.length, 1, `${path}: missing or duplicated support article`);
  assert.equal(markers[0][1], path, `${path}: content from a different route`);
  const article = withoutScripts.match(/<article data-page-help="[^"]+"[^>]*>([\s\S]*?)<\/article>/)?.[1];
  assert.ok(article, `${path}: article must be in initial HTML`);
  assert.equal((article.match(/<h2\b/g) ?? []).length, 3, `${path}: incomplete article`);
  const words = stripMarkup(article).trim().split(/\s+/).length;
  assert.ok(words >= 160, `${path}: too little support text (${words})`);
  const text = stripMarkup(withoutScripts);
  for (const { heading } of pageHelp[path]) {
    assert.ok(text.includes(heading), `${path}: outdated or missing heading ${heading}`);
  }
  const total = text.trim().split(/\s+/).length;
  assert.ok(total >= 250, `${path}: initial HTML has only ${total} words`);
  minimum = Math.min(minimum, total);
}
// Parent directory pages must not append their help to every descendant.
for (const path of ['/categories/developer-tools', '/tools/jpg-to-pdf', '/fr/tools/svg-to-ico']) {
  const html = readFileSync(`.next/server/app${path}.html`, 'utf8');
  assert.ok(!html.includes('<article data-page-help='), `${path}: unrelated help leaked from parent`);
}
console.log(`Verified all 52 audited routes: one route-specific article in initial HTML; minimum ${minimum} total words. Unrelated routes remain clean.`);
console.log('HTML counts exclude script/style/noscript content. Ubersuggest may count visible text differently; re-crawl after deployment.');
