import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = (path) => readFileSync(new URL('../' + path, import.meta.url), 'utf8');
function before(src, first, second, label) {
  const a = src.indexOf(first), b = src.indexOf(second);
  assert.ok(a >= 0 && b >= 0 && a < b, label + ': expected interaction before notice');
}

test('shared English tool wrapper places UI before capability badges', () => {
  const s = read('src/components/tools/ExpansionToolPage.tsx');
  before(s, '{children}', '<PrivacyBadges slug={slug}', 'ExpansionToolPage');
  const e = read('src/components/EnhancedToolWrapper.tsx');
  before(e, '{children}', 'Private by Design', 'EnhancedToolWrapper');
});

test('localized tool pages place interactive controls ahead of generic trust banner', () => {
  const s = read('src/app/[locale]/tools/[slug]/page.tsx');
  before(s, '<LocalizedTools ', '<span>{d.ui.local}</span>', 'localized tool page');
  assert.match(s, /getToolCapabilities\(slug\)\.processedLocally/, 'Only verified local tools receive a local-processing claim');
});

test('CorelDRAW tools render file selection and actions ahead of longer notices', () => {
  const server = read('src/components/tools/coreldraw/CorelServerTool.tsx');
  before(server, '<CorelFileDropzone ', '<ServerPrivacyNotice />', 'server CorelDRAW');
  before(server, 'Create CorelDRAW-ready output', '<NativeCdrNotice />', 'server CDR');
  const raster = read('src/components/tools/coreldraw/RasterToCorelTool.tsx');
  before(raster, '<CorelFileDropzone ', '<LocalPrivacyNotice />', 'raster CorelDRAW');
  before(raster, "Create CorelDRAW-ready output", '<NativeCdrNotice />', 'raster CDR');
});

test('localized CorelDRAW input and conversion come before notices in all three widgets', () => {
  const s = read('src/components/i18n/LocalizedCorelTools.tsx');
  const parts = [
    s.slice(s.indexOf('function LocalizedCdrVersionChecker'), s.indexOf('function LocalizedRasterToCorelTool')),
    s.slice(s.indexOf('function LocalizedRasterToCorelTool'), s.indexOf('function LocalizedCorelServerTool')),
    s.slice(s.indexOf('function LocalizedCorelServerTool'), s.indexOf('export default function LocalizedCorelTools')),
  ];
  assert.equal(parts.length, 3);
  for (const [i, part] of parts.entries()) {
    before(part, '<LocalizedDropzone', i === 2 ? '<span>{ui.privacyNotice}</span>' : '<span>{ui.localPrivacyNotice}</span>', 'localized CorelDRAW ' + i);
  }
  before(parts[2], 'ui.convertBtn', '{ui.nativeNoticeTitle}', 'localized native CDR disclosure');
});

test('STEP 3D PDF and media tools show upload and primary action before long privacy notices', () => {
  const cad = read('src/components/tools/cad/StepTo3dPdfTool.tsx');
  before(cad, 'm.btnConvert', '<CadPrivacyNotice ', 'STEP 3D PDF');
  before(cad, 'm.btnConvert', '<CadViewerNotice ', 'STEP viewer notice');
  const media = read('src/components/tools/media/MediaConverterTool.tsx');
  before(media, '{/* Upload Zone */}', 'Your file is processed locally', 'media conversion');
});

test('comparison, JSON and roof/house calculators keep controls ahead of privacy badges', () => {
  const compare = read('src/components/tools/ComparePdfTool.tsx');
  before(compare, '{/* Upload Dual Dropzones */}', 'Client-side privacy:', 'PDF comparison');
  for (const [path, input] of [
    ['src/app/(english)/tools/json-formatter/page.tsx', 'textarea'],
    ['src/app/(english)/tools/roof-area-calculator/page.tsx', 'Building Length'],
    ['src/app/(english)/tools/house-construction-cost-calculator/page.tsx', 'House Area'],
  ]) before(read(path), input, '<PrivacyBadges slug=', path);
});
