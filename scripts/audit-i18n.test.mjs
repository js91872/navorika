import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import { tools } from '../src/data/registry.ts';
import { guidesMetadata } from '../src/lib/guidesMetadata.ts';
import { locales, translatedTools } from '../src/lib/i18n/config.ts';
import { businessCalculatorConfigs } from '../src/lib/calculations/businessConfigs.ts';

const report = JSON.parse(readFileSync('docs/i18n-coverage.json', 'utf8'));
test('full-rollout inventory covers each registered tool, guide and English page template', () => {
  assert.deepEqual(report.tools.map((row) => row.slug).sort(), tools.map((row) => row.slug).sort());
  assert.deepEqual(report.guides.map((row) => row.slug).sort(), guidesMetadata.map((row) => row.slug).sort());
  const contract = JSON.parse(readFileSync('scripts/english-route-contract.json', 'utf8'));
  const approvedNewRoutes = [
    'guides/can-chatgpt-make-videos/page.tsx',
    'guides/how-does-a-3d-printer-work/page.tsx',
    'guides/how-to-clean-phone-speaker/page.tsx',
    'guides/how-to-convert-jpg-to-dxf/page.tsx',
    'guides/is-claude-better-than-chatgpt/page.tsx',
    'guides/shopify-profit-margin-calculator/page.tsx',
    'tools/ai-video-prompt-generator/page.tsx',
    'tools/jpg-to-dxf/page.tsx',
    'tools/shopify-margin-calculator/page.tsx',
    'tools/speaker-dust-cleaning-sound/page.tsx',
  ];
  assert.deepEqual(report.pageTemplates.map((row) => row.source.replace('src/app/(english)/', '')).sort(), [...contract, ...approvedNewRoutes].sort());
  for (const row of report.tools) assert.ok(row.routeExists && existsSync(row.source), row.slug);
  assert.equal(report.summary.sharedCalculators, Object.keys(businessCalculatorConfigs).length);
  assert.equal(report.summary.publishedToolTranslations, translatedTools.length * locales.length);
  for (const row of report.tools) {
    assert.equal(row.status === 'published', translatedTools.includes(row.slug));
    assert.deepEqual(row.translatedLocales, row.status === 'published' ? [...locales] : []);
  }
});
test('inventory generation is reproducible and full completion fails while coverage remains', () => {
  const checked = spawnSync(process.execPath, ['--import', 'tsx', 'scripts/audit-i18n.mjs', '--check'], { encoding: 'utf8' });
  assert.equal(checked.status, 0, checked.stderr);
  const full = spawnSync(process.execPath, ['--import', 'tsx', 'scripts/audit-i18n.mjs', '--check', '--require-complete'], { encoding: 'utf8' });
  const missing = [...report.tools, ...report.guides, ...report.trustPages, ...report.pageTemplates].some((row) => row.status === 'pending') || report.infrastructure.some((row) => row.status !== 'verified');
  assert.equal(full.status, missing ? 1 : 0, full.stderr);
  if (missing) assert.match(full.stderr, /still need translation\/review/);
});
test('shared calculator extraction preserves real calculation examples and error behavior', () => {
  const run = (slug, values) => businessCalculatorConfigs[slug].calculate(values);
  assert.equal(run('image-megapixel-calculator', { widthPixels: 6000, heightPixels: 4000 }).megapixels, 24);
  const print = run('image-print-size-calculator', { widthPixels: 3000, heightPixels: 2400, ppi: 300 });
  assert.equal(print.widthInches, 10);
  assert.equal(print.heightCm, 20.32);
  assert.equal(run('ppi-calculator', { widthPixels: 3000, heightPixels: 2400, printWidth: 10, printHeight: 8 }).effectivePpi, 300);
  assert.throws(() => run('ppi-calculator', { widthPixels: 3000, heightPixels: 2400, printWidth: 0, printHeight: 8 }), RangeError);
  for (const [slug, config] of Object.entries(businessCalculatorConfigs)) {
    assert.ok(config.fields.length && config.results.length && config.note, slug);
    assert.equal(new Set(config.fields.map((field) => field.key)).size, config.fields.length, slug);
  }
});

test('shared result actions support complete native feedback without leaking browser errors', async () => {
  const React = await import('react');
  const { renderToStaticMarkup } = await import('react-dom/server');
  const { default: ResultActions } = await import('../src/components/ui/ResultActions.tsx');
  const { resultActionMessages, resultActionError } = await import('../src/lib/i18n/actionMessages.ts');
  for (const locale of locales) {
    const messages = resultActionMessages[locale];
    assert.deepEqual(Object.keys(messages).sort(), Object.keys(resultActionMessages.en).sort());
    for (const [key, value] of Object.entries(messages)) {
      assert.ok(value.trim());
      assert.notEqual(value, resultActionMessages.en[key], `${locale}/${key}`);
    }
    const html = renderToStaticMarkup(React.createElement(ResultActions, { actions: [{ kind: 'print' }], messages }));
    assert.ok(html.includes(messages.group), locale);
    assert.ok(html.includes(messages.print), locale);
    assert.equal(resultActionError(new Error('Permission denied by clipboard provider'), messages), messages.failed);
  }
  assert.equal(resultActionError(new Error('Original error')), 'Original error');
});

test('shared localization rejects missing labels and requires text-output classification', async () => {
  const { localizeBusinessCalculator } = await import('../src/lib/i18n/businessLocalization.ts');
  const copy = {
    fields: { widthPixels: { label: 'Largeur en pixels' }, heightPixels: { label: 'Hauteur en pixels' }, ppi: { label: 'Résolution', help: 'Pixels par pouce.' } },
    results: { widthInches: 'Largeur en pouces', heightInches: 'Hauteur en pouces', widthCm: 'Largeur en centimètres', heightCm: 'Hauteur en centimètres' },
    note: 'Les dimensions sont calculées sans modifier l’image.', textResults: {},
  };
  const native = localizeBusinessCalculator('image-print-size-calculator', copy);
  assert.deepEqual(native.calculate({ widthPixels: 3000, heightPixels: 2400, ppi: 300 }), { widthInches: 10, heightInches: 8, widthCm: 25.4, heightCm: 20.32 }, 'Native copy must preserve known calculation results');
  assert.equal(native.fields[0].label, 'Largeur en pixels');
  assert.equal(native.results[0].label, 'Largeur en pouces');
  assert.throws(() => localizeBusinessCalculator('image-print-size-calculator', { ...copy, fields: { ...copy.fields, ppi: { label: '' } } }), /Missing translation/);
  assert.throws(() => localizeBusinessCalculator('image-print-size-calculator', { ...copy, results: {} }), /keys do not match/);
  const ppi = businessCalculatorConfigs['ppi-calculator'];
  const textCopy = {
    fields: Object.fromEntries(ppi.fields.map((field) => [field.key, { label: field.label }])),
    results: Object.fromEntries(ppi.results.map((result) => [result.key, result.label])),
    note: 'Note de contrôle.', textResults: { aspectMatch: 'localized' },
  };
  assert.throws(() => localizeBusinessCalculator('ppi-calculator', textCopy), /Missing native result formatter/);
  const formatted = localizeBusinessCalculator('ppi-calculator', textCopy, { aspectMatch: () => 'Proportions identiques' });
  assert.equal(formatted.formatTextResult('aspectMatch', 'Matched'), 'Proportions identiques');
});
