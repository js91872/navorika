#!/usr/bin/env node
/**
 * Static route-level editorial inventory. This is a triage report, NOT a
 * Google/AdSense verdict. Review rendered pages and actual tool behavior manually.
 *
 * Run: node scripts/audit-tool-page-quality.mjs
 */
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const toolsRoot = path.join(root, 'src/app/(english)/tools');
const reviewSlugs = new Set(['blur-face','bioluminescent-reader','image-dpi-converter','png-to-svg','protect-pdf','unlock-pdf']);
const read = file => fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
const dirs = fs.readdirSync(toolsRoot, { withFileTypes: true }).filter(item => item.isDirectory() && !item.name.startsWith('['));
const rows = [];
for (const dir of dirs) {
  const slug = dir.name;
  const base = path.join(toolsRoot, slug);
  const page = read(path.join(base, 'page.tsx'));
  if (!page) continue;
  const layout = read(path.join(base, 'layout.tsx'));
  const flags = [];
  if (reviewSlugs.has(slug)) flags.push('Previously quarantined: verify current status');
  if (!layout.includes('ToolPageContent') && !page.includes('ToolPageContent') && !page.includes('Article') && !page.includes('ToolContent')) {
    flags.push('Check rendered page for unique methodology/examples');
  }
  if (/ToolSEOWrapper/.test(page + layout)) flags.push('Legacy wrapper: check unique editorial content');
  if (/ToolPageContent/.test(layout) && /(?:Article|Guide)\s*\/>/.test(page) && !/supplementalOnly/.test(layout)) {
    flags.push('Possible overlapping full guide and shared editorial sections');
  }
  if (/browser.local|entirely in your browser|never uploaded|not sent to|stay on your device/i.test(page + layout)) {
    flags.push('Verify privacy claim against actual processing');
  }
  if (/canonicalOverride|createToolMetadata\([^\n]+https:\/\//.test(layout)) flags.push('Review canonical destination');
  const status = flags.length ? 'REVIEW' : 'UNVERIFIED';
  rows.push({ slug, status, flags });
}
rows.sort((a,b) => b.flags.length - a.flags.length || a.slug.localeCompare(b.slug));
const escape = v => String(v).replaceAll('|','\\|').replaceAll('\n',' ');
const output = [
  '# Navorika tool-page static triage',
  '',
  'Generated from repository source. This is not a Google quality classification; absence of flags does not mean the page passed.',
  'The inventory covers explicit English tool page files only; dynamic sub-routes, translated routes, guides and category URLs require separate review.',
  '',
  `Scanned **${rows.length}** explicit tool routes; **${rows.filter(r => r.flags.length).length}** flagged for manual review.`,
  '',
  '| Route | Status | Static review flags |',
  '|---|---|---|',
  ...rows.map(r => `| /tools/${escape(r.slug)} | ${r.status} | ${escape(r.flags.join('; ') || 'Manual functional/content review required')} |`),
  '',
  '## Before changing indexability',
  'Confirm the rendered page, user value, tool accuracy, traffic, canonical intent and internal links. Never noindex merely because search volume is low.',
  ''
].join('\n');
if (process.argv.includes('--write')) {
  const target = path.join(root,'docs/adsense-tool-page-triage.md');
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, output);
  process.stdout.write(`Wrote ${path.relative(root,target)}\n`);
} else {
  process.stdout.write(output);
}
