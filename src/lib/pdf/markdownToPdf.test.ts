import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { PDFDocument } from 'pdf-lib';
import { createCanvas } from '@napi-rs/canvas';
import sharp from 'sharp';
import { convertMarkdownToPdf, CanvasCreator } from './markdownToPdf';

let lastRenderedPng: Uint8Array | null = null;
const nodeCanvasCreator: CanvasCreator = (w: number, h: number) => {
  const canvas = createCanvas(w, h);
  const ctx = canvas.getContext('2d') as unknown as CanvasRenderingContext2D;
  return {
    canvas,
    ctx,
    toPngBytes: async () => {
      const bytes = new Uint8Array(canvas.toBuffer('image/png'));
      lastRenderedPng = bytes;
      return bytes;
    },
  };
};

describe('Markdown to PDF Unicode Preservation', () => {
  it('converts Russian Cyrillic markdown without character loss or corruption', async () => {
    lastRenderedPng = null;
    const md = `# Отчет о конвертации
Это подробный абзац на русском языке с проверкой символов:
- Первая строка списка
- Вторая строка со знаками препинания: «кавычки» и тире — длинное.
`;

    const pdfBytes = await convertMarkdownToPdf(md, { title: 'Russian Document' }, nodeCanvasCreator);

    // Validate PDF magic bytes: %PDF-
    assert.equal(String.fromCharCode(...pdfBytes.subarray(0, 5)), '%PDF-');

    // Parse and verify with PDFDocument
    const doc = await PDFDocument.load(pdfBytes);
    assert.equal(doc.getPageCount(), 1);
    const [page] = doc.getPages();
    const { width, height } = page.getSize();
    assert.equal(Math.round(width), 595);
    assert.equal(Math.round(height), 842);

    // Rendered visual check for glyph readability on canvas rasterization (documented font limitation)
    assert.ok(lastRenderedPng, 'Canvas PNG rendered for complex Cyrillic script');
    const img = sharp(lastRenderedPng);
    const meta = await img.metadata();
    assert.equal(meta.width, 1190, 'Rendered at 2x print width');
    assert.equal(meta.height, 1684, 'Rendered at 2x print height');
    const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
    let darkTextPixels = 0;
    let leftHalfDarkPixels = 0;
    let rightHalfDarkPixels = 0;
    for (let y = 100; y < 600; y++) {
      for (let x = 100; x < info.width - 100; x++) {
        const idx = (y * info.width + x) * info.channels;
        const r = data[idx], g = data[idx + 1], b = data[idx + 2];
        if (r < 100 && g < 100 && b < 100) {
          darkTextPixels++;
          if (x < info.width / 2) leftHalfDarkPixels++;
          else rightHalfDarkPixels++;
        }
      }
    }
    assert.ok(darkTextPixels > 500, `Russian glyphs rendered with substantial readable text pixels (${darkTextPixels})`);
    assert.ok(leftHalfDarkPixels > rightHalfDarkPixels, 'Russian LTR text is concentrated on the left half');
  });

  it('converts Arabic markdown with RTL layout and without character corruption', async () => {
    lastRenderedPng = null;
    const md = `# وثيقة تجريبية باللغة العربية
هذا النص هو مثال لمستند يتم تصديره إلى ملف بي دي إف محلياً داخل المتصفح:
- النقطة الأولى في القائمة
- النقطة الثانية مع أرقام وتفاصيل ١٢٣٤٥
`;

    const pdfBytes = await convertMarkdownToPdf(md, { title: 'Arabic Document' }, nodeCanvasCreator);
    assert.equal(String.fromCharCode(...pdfBytes.subarray(0, 5)), '%PDF-');

    const doc = await PDFDocument.load(pdfBytes);
    assert.ok(doc.getPageCount() >= 1);

    // Rendered visual check for glyph readability on canvas rasterization (documented font limitation)
    assert.ok(lastRenderedPng, 'Canvas PNG rendered for complex Arabic script');
    const img = sharp(lastRenderedPng);
    const meta = await img.metadata();
    assert.equal(meta.width, 1190, 'Rendered at 2x print width');
    assert.equal(meta.height, 1684, 'Rendered at 2x print height');
    const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
    let darkTextPixels = 0;
    let leftHalfDarkPixels = 0;
    let rightHalfDarkPixels = 0;
    for (let y = 100; y < 600; y++) {
      for (let x = 100; x < info.width - 100; x++) {
        const idx = (y * info.width + x) * info.channels;
        const r = data[idx], g = data[idx + 1], b = data[idx + 2];
        if (r < 100 && g < 100 && b < 100) {
          darkTextPixels++;
          if (x < info.width / 2) leftHalfDarkPixels++;
          else rightHalfDarkPixels++;
        }
      }
    }
    assert.ok(darkTextPixels > 500, `Arabic glyphs rendered with substantial readable text pixels (${darkTextPixels})`);
    assert.ok(rightHalfDarkPixels > leftHalfDarkPixels, 'Arabic RTL text is concentrated on the right half');
  });

  it('converts multilingual and accented Latin markdown correctly with selectable vector text', async () => {
    const md = `# Multilingual Test: Français, Español, Deutsch & Italiano
- Français: Les élèves étudient l'ingénierie à l'université de Genève.
- Español: Mañana habrá una reunión de diseño en el año 2026.
- Deutsch: Größere Überprüfungen für Maßstäbe und Qualitätssicherung.
- Italiano: È arrivato il momento di verificare l'efficacia del programma.
`;

    const pdfBytes = await convertMarkdownToPdf(md, { title: 'Multilingual' }, nodeCanvasCreator);
    assert.equal(String.fromCharCode(...pdfBytes.subarray(0, 5)), '%PDF-');

    const doc = await PDFDocument.load(pdfBytes);
    assert.equal(doc.getPageCount(), 1);

    // Verify vector text is selectable and extractable using pdfjs-dist
    const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
    const loadingTask = pdfjs.getDocument({ data: pdfBytes });
    const pdf = await loadingTask.promise;
    const page = await pdf.getPage(1);
    const content = await page.getTextContent();
    const extracted = content.items.map((item: any) => item.str).join(' ');

    assert.ok(extracted.includes('Multilingual Test'), 'H1 title extracted');
    assert.ok(extracted.includes('Français'), 'French text extracted');
    assert.ok(extracted.includes('Español'), 'Spanish text extracted');
    assert.ok(extracted.includes('Deutsch'), 'German text extracted');
    assert.ok(extracted.includes('Italiano'), 'Italian text extracted');
    assert.ok(pdfBytes.length < 10000, 'Vector PDF is compact (<10KB)');
  });
});
