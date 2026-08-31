import assert from 'node:assert/strict';
import test from 'node:test';
import JSZip from 'jszip';
import { Document, ExternalHyperlink, HeadingLevel, Packer, Paragraph, Table, TableCell, TableRow, TextRun } from 'docx';
import { XMLValidator } from 'fast-xml-parser';
import { convertDocxToXml } from './docx-to-xml';
import { convertXmlToDocx } from './xml-to-docx';
import { parseXml } from './xml-parser';

const catalog = `<?xml version="1.0"?><catalog source="test"><book id="1"><title>One</title><price>10</price></book><book id="2"><title>Two</title><price>20</price></book></catalog>`;

test('parses namespaces, attributes, Unicode, mixed depth, and empty elements', () => {
  const root = parseXml('<x:root xmlns:x="urn:test" label="café"><x:item/><x:item>東京 &amp; Seoul</x:item></x:root>');
  assert.equal(root.name, 'x:root');
  assert.equal(root.attributes['xmlns:x'], 'urn:test');
  assert.equal(root.children[1].text, '東京 & Seoul');
});

test('rejects malformed XML and entity declarations', () => {
  assert.throws(() => parseXml('<root><open></root>'), /Malformed XML.*line/i);
  assert.throws(() => parseXml('<!DOCTYPE x [<!ENTITY e SYSTEM "file:///etc/passwd">]><x>&e;</x>'), /blocked/i);
  const deep = `${'<node>'.repeat(82)}value${'</node>'.repeat(82)}`;
  assert.throws(() => parseXml(deep), /depth limit/i);
});

test('creates a genuine DOCX package in hierarchy, table, and raw modes', async () => {
  for (const mode of ['hierarchy', 'table', 'raw'] as const) {
    const result = await convertXmlToDocx(catalog, mode, 'catalog.xml');
    assert.equal(result.fileName, 'catalog.docx');
    const zip = await JSZip.loadAsync(await result.blob.arrayBuffer());
    assert.ok(zip.file('[Content_Types].xml'));
    const documentXml = await zip.file('word/document.xml')?.async('string');
    assert.ok(documentXml?.includes('w:document'));
  }
});

test('extracts valid structured XML and exact raw WordprocessingML from generated DOCX', async () => {
  const generated = await convertXmlToDocx(catalog, 'hierarchy', 'catalog.xml');
  const file = new File([generated.blob], generated.fileName, { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
  const structured = await convertDocxToXml(file, 'structured');
  assert.equal(XMLValidator.validate(structured.text), true);
  assert.match(structured.text, /<heading level="1">catalog<\/heading>/);
  const raw = await convertDocxToXml(file, 'raw');
  assert.match(raw.text, /<w:document[\s>]/);
});

test('preserves document order, headings, paragraphs, lists, tables, and basic hyperlinks', async () => {
  const fixture = new Document({
    numbering: { config: [
      { reference: 'bullets', levels: [{ level: 0, format: 'bullet', text: '•', alignment: 'left' }] },
      { reference: 'numbers', levels: [{ level: 0, format: 'decimal', text: '%1.', alignment: 'left' }] },
    ] },
    sections: [{ children: [
      new Paragraph({ text: 'Test title', heading: HeadingLevel.TITLE }),
      new Paragraph({ text: 'Section one', heading: HeadingLevel.HEADING_1 }),
      new Paragraph({ text: 'Subsection', heading: HeadingLevel.HEADING_2 }),
      new Paragraph({ children: [new TextRun('Read '), new ExternalHyperlink({ link: 'https://example.com/docs', children: [new TextRun('the docs')] })] }),
      new Paragraph({ text: 'First item', numbering: { reference: 'bullets', level: 0 } }),
      new Paragraph({ text: 'Number one — 東京', numbering: { reference: 'numbers', level: 0 } }),
      new Table({ rows: [new TableRow({ children: [new TableCell({ children: [new Paragraph('A')] }), new TableCell({ children: [new Paragraph('B')] })] })] }),
    ] }],
  });
  const blob = await Packer.toBlob(fixture);
  const file = new File([blob], 'features.docx', { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
  const result = await convertDocxToXml(file, 'structured');
  assert.equal(XMLValidator.validate(result.text), true);
  assert.match(result.text, /<title>Test title<\/title>/);
  assert.match(result.text, /<heading level="1">Section one<\/heading>/);
  assert.match(result.text, /<heading level="2">Subsection<\/heading>/);
  assert.match(result.text, /<paragraph>Read <link href="https:\/\/example.com\/docs">the docs<\/link><\/paragraph>/);
  assert.match(result.text, /<list-item level="0" ordered="false">First item<\/list-item>/);
  assert.match(result.text, /<list-item level="0" ordered="true">Number one — 東京<\/list-item>/);
  assert.match(result.text, /<table><row><cell>A<\/cell><cell>B<\/cell><\/row><\/table>/);
});

test('extracts an empty DOCX as parseable XML with an empty body', async () => {
  const blob = await Packer.toBlob(new Document({ sections: [{ children: [] }] }));
  const result = await convertDocxToXml(new File([blob], 'empty.docx', { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }), 'structured');
  assert.equal(XMLValidator.validate(result.text), true);
  assert.match(result.text, /<body>\s*<\/body>/);
});

test('rejects legacy DOC, invalid ZIP content, and unsafe expanded archives', async () => {
  const legacy = new File(['old'], 'legacy.doc', { type: 'application/msword' });
  await assert.rejects(() => convertDocxToXml(legacy, 'structured'), /Legacy \.doc/);
  const invalid = new File(['not a zip'], 'fake.docx', { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
  await assert.rejects(() => convertDocxToXml(invalid, 'structured'), /not a valid DOCX ZIP package/);
  const oversizedZip = new JSZip();
  oversizedZip.file('[Content_Types].xml', '<Types/>'); oversizedZip.file('_rels/.rels', '<Relationships/>');
  oversizedZip.file('word/document.xml', 'A'.repeat(16 * 1024 * 1024));
  const oversizedBlob = await oversizedZip.generateAsync({ type: 'blob', compression: 'DEFLATE' });
  await assert.rejects(() => convertDocxToXml(new File([oversizedBlob], 'bomb.docx', { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }), 'structured'), /expanded-size limit|compression ratio/);
  const traversalZip = new JSZip();
  traversalZip.file('[Content_Types].xml', '<Types/>'); traversalZip.file('_rels/.rels', '<Relationships/>'); traversalZip.file('word/document.xml', '<w:document/>'); traversalZip.file('../outside.xml', '<x/>');
  const traversalBlob = await traversalZip.generateAsync({ type: 'blob' });
  await assert.rejects(() => convertDocxToXml(new File([traversalBlob], 'traversal.docx', { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }), 'structured'), /unsafe archive path/);
});
