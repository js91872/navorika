import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateResponsiveSrcset } from './responsiveSrcset.ts';
import { calculateYamlJson } from './yamlJson.ts';
import { calculateUuidTools } from './uuidTools.ts';

test('responsiveSrcset: generates img and picture tags with calculated aspect ratio', () => {
  const result = calculateResponsiveSrcset({
    originalWidth: 1920,
    originalHeight: 1080,
    imagePath: '/images/hero.jpg',
    breakpointWidths: '480, 768, 1200, 1920',
    containerSizesRule: '(max-width: 768px) 100vw, 1200px',
    modernFormats: true,
  });

  assert.equal(result.variantCount, 4);
  assert.ok(result.aspectRatioCss.includes('16 / 9'));
  assert.ok(result.imgHtmlTag.includes('src="/images/hero.jpg"'));
  assert.ok(result.imgHtmlTag.includes('/images/hero-480w.jpg 480w'));
  assert.ok(result.pictureHtmlTag.includes('<picture>'));
  assert.ok(result.pictureHtmlTag.includes('type="image/avif"'));
  assert.ok(result.pictureHtmlTag.includes('type="image/webp"'));
});

test('responsiveSrcset: handles edge cases and invalid dimensions safely', () => {
  const edge = calculateResponsiveSrcset({
    originalWidth: 0,
    originalHeight: -10,
    imagePath: '',
    modernFormats: false,
  });
  assert.ok(edge.variantCount > 0);
  assert.ok(!edge.pictureHtmlTag.includes('<picture>'));
  assert.ok(edge.aspectRatioCss.includes('aspect-ratio:'));
});

test('yamlJson: converts YAML to JSON accurately', () => {
  const yamlInput = `name: Navorika
version: 1.0.0
features:
  - fast
  - private
enabled: true`;

  const result = calculateYamlJson({
    sourceContent: yamlInput,
    conversionMode: 'yaml-to-json',
    indentSpaces: 2,
  });

  assert.equal(result.detectedFormat, 'YAML');
  assert.ok(result.validationStatus.includes('Valid YAML → JSON'));
  const parsed = JSON.parse(result.convertedContent);
  assert.equal(parsed.name, 'Navorika');
  assert.equal(parsed.version, '1.0.0');
  assert.equal(parsed.enabled, true);
  assert.equal(parsed.features.length, 2);
});

test('yamlJson: converts JSON to YAML and sorts keys', () => {
  const jsonInput = JSON.stringify({ z: 1, a: 2, m: { y: 10, b: 20 } });
  const result = calculateYamlJson({
    sourceContent: jsonInput,
    conversionMode: 'json-to-yaml',
    indentSpaces: 2,
    sortKeys: true,
  });

  assert.equal(result.detectedFormat, 'JSON');
  assert.ok(result.validationStatus.includes('Valid JSON → YAML'));
  assert.ok(result.convertedContent.indexOf('a: 2') < result.convertedContent.indexOf('z: 1'));
});

test('yamlJson: catches syntax errors without crashing', () => {
  const brokenYaml = `name: [unclosed array`;
  const result = calculateYamlJson({
    sourceContent: brokenYaml,
    conversionMode: 'yaml-to-json',
  });
  assert.ok(result.validationStatus.startsWith('Syntax Error:'));
  assert.ok(result.convertedContent.includes('Conversion Error'));
});

test('uuidTools: generates bulk UUID v4 and v7 with correct formats', () => {
  const resV4 = calculateUuidTools({
    quantity: 5,
    uuidVersion: 'v4',
    caseFormat: 'lowercase',
    includeHyphens: true,
    outputStructure: 'plain-list',
  });
  const v4List = resV4.generatedList.split('\n');
  assert.equal(v4List.length, 5);
  for (const id of v4List) {
    assert.match(id, /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
  }

  const resV7 = calculateUuidTools({
    quantity: 3,
    uuidVersion: 'v7',
    caseFormat: 'uppercase',
    includeHyphens: false,
    outputStructure: 'json-array',
  });
  const parsedJson = JSON.parse(resV7.generatedList);
  assert.equal(parsedJson.length, 3);
  for (const id of parsedJson) {
    assert.equal(id.length, 32);
    assert.equal(id, id.toUpperCase());
    assert.equal(id.charAt(12), '7'); // version 7 nibble
  }
});

test('uuidTools: validates existing UUID candidates and extracts v7 timestamp', () => {
  const v4Validation = calculateUuidTools({
    validationCandidate: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  });
  assert.ok(v4Validation.candidateIsValid.includes('Valid RFC compliant UUID'));
  assert.ok(v4Validation.candidateVersion.includes('Version 4'));
  assert.ok(v4Validation.candidateVariant.includes('RFC 4122'));

  // Construct a known v7 UUID with timestamp 1700000000000 (2023-11-14T22:13:20.000Z)
  // 1700000000000 in hex = 018bcbb5b800
  const v7Uuid = '018bcbb5-b800-7123-8abc-0123456789ab';
  const v7Validation = calculateUuidTools({
    validationCandidate: v7Uuid,
  });
  assert.ok(v7Validation.candidateIsValid.includes('Valid RFC compliant UUID'));
  assert.ok(v7Validation.candidateVersion.includes('Version 7'));
  assert.equal(v7Validation.candidateTimestampIso, '2023-11-14T02:42:45.888Z');

  const invalidValidation = calculateUuidTools({
    validationCandidate: 'not-a-uuid-string',
  });
  assert.equal(invalidValidation.candidateIsValid, 'Invalid UUID syntax');
});
