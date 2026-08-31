import JSZip from 'jszip';
import { XMLParser, XMLValidator } from 'fast-xml-parser';
import { XML_WORD_LIMITS } from './config';
import { assertDocxFile, assertSafeXmlSource, assertZipMagic, ConversionError, safeDownloadName } from './security';
import { escapeXml } from './xml-parser';
import type { ConversionResult, WordToXmlMode } from './types';

type Entry = Record<string, unknown> & { ':@'?: Record<string, unknown> };
type ZipEntryInternals = { _data?: { compressedSize?: number; uncompressedSize?: number }; unsafeOriginalName?: string };

function element(entry: Entry, name: string): unknown[] | null { const value = entry[name]; return Array.isArray(value) ? value : null; }
function attrs(entry: Entry) { return Object.fromEntries(Object.entries(entry[':@'] ?? {}).map(([key, value]) => [key.replace(/^@_/, ''), String(value)])); }
function descendant(entries: unknown[], name: string): Entry | null { for (const raw of entries) { if (!raw || typeof raw !== 'object') continue; const entry = raw as Entry; if (element(entry, name)) return entry; for (const value of Object.values(entry)) if (Array.isArray(value)) { const found = descendant(value, name); if (found) return found; } } return null; }
function textContent(entries: unknown[]): string { let value = ''; for (const raw of entries) { if (!raw || typeof raw !== 'object') continue; const entry = raw as Entry; const text = entry['#text']; if (typeof text === 'string') value += text; if (element(entry, 'w:tab')) value += '\t'; if (element(entry, 'w:br')) value += '\n'; for (const [name, child] of Object.entries(entry)) if (Array.isArray(child) && name !== 'w:tab' && name !== 'w:br') value += textContent(child); } return value; }
function paragraphStyle(content: unknown[]) { const pStyle = descendant(content, 'w:pStyle'); return pStyle ? attrs(pStyle)['w:val'] ?? attrs(pStyle).val ?? '' : ''; }
function paragraphList(content: unknown[]) { const numPr = descendant(content, 'w:numPr'); if (!numPr) return null; const levelEntry = descendant(element(numPr, 'w:numPr') ?? [], 'w:ilvl'); const numIdEntry = descendant(element(numPr, 'w:numPr') ?? [], 'w:numId'); return { level: Number(attrs(levelEntry ?? {})['w:val'] ?? 0), numId: attrs(numIdEntry ?? {})['w:val'] ?? '' }; }
function inlineParagraphXml(content: unknown[], links: Map<string, string>) { const pieces: string[] = []; for (const raw of content) { if (!raw || typeof raw !== 'object') continue; const entry = raw as Entry; const run = element(entry, 'w:r'); if (run) pieces.push(escapeXml(textContent(run))); const hyperlink = element(entry, 'w:hyperlink'); if (hyperlink) { const id = attrs(entry)['r:id']; const label = escapeXml(textContent(hyperlink)); const target = links.get(id); pieces.push(target ? `<link href="${escapeXml(target)}">${label}</link>` : label); } } return pieces.join(''); }
function relationshipMap(source?: string) { const result = new Map<string, string>(); if (!source) return result; assertSafeXmlSource(source); const parser = new XMLParser({ preserveOrder: true, ignoreAttributes: false, attributeNamePrefix: '', processEntities: false }); const parsed = parser.parse(source) as unknown[]; const walk = (entries: unknown[]) => { for (const raw of entries) { if (!raw || typeof raw !== 'object') continue; const entry = raw as Entry; if (element(entry, 'Relationship')) { const data = attrs(entry); if (data.Id && data.Target && /^https?:|^mailto:/i.test(data.Target)) result.set(data.Id, data.Target); } for (const value of Object.values(entry)) if (Array.isArray(value)) walk(value); } }; walk(parsed); return result; }
function orderedListIds(numbering?: string) { const ordered = new Set<string>(); if (!numbering) return ordered; assertSafeXmlSource(numbering); const parser = new XMLParser({ preserveOrder: true, ignoreAttributes: false, attributeNamePrefix: '', processEntities: false }); const parsed = parser.parse(numbering) as unknown[]; const abstractFormats = new Map<string, boolean>(); const numToAbstract = new Map<string, string>(); const walk = (entries: unknown[]) => { for (const raw of entries) { if (!raw || typeof raw !== 'object') continue; const entry = raw as Entry; const abstract = element(entry, 'w:abstractNum'); if (abstract) { const id = attrs(entry)['w:abstractNumId']; const fmt = descendant(abstract, 'w:numFmt'); abstractFormats.set(id, (attrs(fmt ?? {})['w:val'] ?? 'bullet') !== 'bullet'); } const num = element(entry, 'w:num'); if (num) { const id = attrs(entry)['w:numId']; const abstractId = descendant(num, 'w:abstractNumId'); numToAbstract.set(id, attrs(abstractId ?? {})['w:val'] ?? ''); } for (const value of Object.values(entry)) if (Array.isArray(value)) walk(value); } }; walk(parsed); for (const [numId, abstractId] of numToAbstract) if (abstractFormats.get(abstractId)) ordered.add(numId); return ordered; }

function structuredXml(documentXml: string, relationships?: string, numbering?: string) {
  assertSafeXmlSource(documentXml);
  const validation = XMLValidator.validate(documentXml);
  if (validation !== true) throw new ConversionError('The DOCX main document part contains malformed WordprocessingML.');
  const parser = new XMLParser({ preserveOrder: true, ignoreAttributes: false, attributeNamePrefix: '', trimValues: false, parseTagValue: false, processEntities: false });
  const parsed = parser.parse(documentXml) as unknown[];
  const bodyEntry = descendant(parsed, 'w:body');
  const body = bodyEntry ? element(bodyEntry, 'w:body') ?? [] : [];
  const links = relationshipMap(relationships);
  const ordered = orderedListIds(numbering);
  const blocks: string[] = [];
  for (const raw of body) {
    if (!raw || typeof raw !== 'object') continue;
    const entry = raw as Entry;
    const paragraph = element(entry, 'w:p');
    if (paragraph) {
      const style = paragraphStyle(paragraph);
      const list = paragraphList(paragraph);
      const content = inlineParagraphXml(paragraph, links);
      const heading = /^Heading([1-6])$/i.exec(style);
      if (/^Title$/i.test(style)) blocks.push(`<title>${content}</title>`);
      else if (heading) blocks.push(`<heading level="${heading[1]}">${content}</heading>`);
      else if (list) blocks.push(`<list-item level="${Math.max(0, list.level)}" ordered="${ordered.has(list.numId)}">${content}</list-item>`);
      else blocks.push(`<paragraph>${content}</paragraph>`);
    }
    const table = element(entry, 'w:tbl');
    if (table) {
      const rows: string[] = [];
      for (const rowRaw of table) {
        if (!rowRaw || typeof rowRaw !== 'object') continue;
        const row = element(rowRaw as Entry, 'w:tr');
        if (!row) continue;
        const cells: string[] = [];
        for (const cellRaw of row) {
          if (!cellRaw || typeof cellRaw !== 'object') continue;
          const cell = element(cellRaw as Entry, 'w:tc');
          if (cell) cells.push(`<cell>${escapeXml(textContent(cell).trim())}</cell>`);
        }
        rows.push(`<row>${cells.join('')}</row>`);
      }
      blocks.push(`<table>${rows.join('')}</table>`);
    }
  }
  const result = `<?xml version="1.0" encoding="UTF-8"?>\n<document>\n  <body>\n    ${blocks.join('\n    ')}\n  </body>\n</document>\n`;
  if (XMLValidator.validate(result) !== true) throw new ConversionError('The extracted XML could not be validated.');
  return result;
}

async function readPart(zip: JSZip, path: string, required = false) { const entry = zip.file(path); if (!entry) { if (required) throw new ConversionError(`The DOCX package is missing ${path}.`); return undefined; } return entry.async('string'); }

export async function convertDocxToXml(file: File, mode: WordToXmlMode): Promise<ConversionResult & { text: string }> {
  assertDocxFile(file);
  const bytes = new Uint8Array(await file.arrayBuffer());
  assertZipMagic(bytes);
  let zip: JSZip;
  try { zip = await JSZip.loadAsync(bytes, { createFolders: false }); } catch { throw new ConversionError('The DOCX ZIP package is invalid or corrupted.'); }
  const entries = Object.values(zip.files);
  if (entries.length > XML_WORD_LIMITS.maxArchiveEntries) throw new ConversionError(`The DOCX contains more than ${XML_WORD_LIMITS.maxArchiveEntries} archive entries.`);
  let total = 0;
  for (const entry of entries) {
    const internals = entry as typeof entry & ZipEntryInternals;
    const archiveName = internals.unsafeOriginalName ?? entry.name;
    if (/^(?:\/|\\)|(?:^|[\\/])\.\.(?:[\\/]|$)/.test(archiveName)) throw new ConversionError('The DOCX contains an unsafe archive path.');
    const data = internals._data;
    const compressed = data?.compressedSize ?? 0;
    const uncompressed = data?.uncompressedSize ?? 0;
    if (uncompressed > XML_WORD_LIMITS.maxArchiveEntryBytes) throw new ConversionError(`Archive entry ${entry.name} exceeds the safe expanded-size limit.`);
    if (compressed > 0 && uncompressed / compressed > XML_WORD_LIMITS.maxCompressionRatio) throw new ConversionError(`Archive entry ${entry.name} has an unsafe compression ratio.`);
    total += uncompressed;
  }
  if (total > XML_WORD_LIMITS.maxArchiveUncompressedBytes) throw new ConversionError('The DOCX expanded size exceeds the 40 MB safety limit.');
  if (!zip.file('[Content_Types].xml') || !zip.file('_rels/.rels')) throw new ConversionError('The ZIP is not a complete DOCX package.');
  const documentXml = await readPart(zip, 'word/document.xml', true) as string;
  const text = mode === 'raw' ? documentXml : structuredXml(documentXml, await readPart(zip, 'word/_rels/document.xml.rels'), await readPart(zip, 'word/numbering.xml'));
  return { text, blob: new Blob([text], { type: 'application/xml;charset=utf-8' }), fileName: safeDownloadName(file.name, 'xml'), warnings: mode === 'structured' ? ['Layout, images, tracked changes, comments, footnotes, and advanced Word styling are not represented in clean XML.'] : [] };
}
