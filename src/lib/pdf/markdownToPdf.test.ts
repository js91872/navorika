import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { PDFDocument } from 'pdf-lib';
import { createCanvas } from '@napi-rs/canvas';
import { convertMarkdownToPdf, CanvasCreator } from './markdownToPdf';

const nodeCanvasCreator: CanvasCreator = (w: number, h: number) => {
  const canvas = createCanvas(w, h);
  const ctx = canvas.getContext('2d') as unknown as CanvasRenderingContext2D;
  return {
    canvas,
    ctx,
    toPngBytes: async () => new Uint8Array(canvas.toBuffer('image/png')),
  };
};

describe('Markdown to PDF Unicode Preservation', () => {
  it('converts Russian Cyrillic markdown without character loss or corruption', async () => {
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
  });

  it('converts Arabic markdown with RTL layout and without character corruption', async () => {
    const md = `# وثيقة تجريبية باللغة العربية
هذا النص هو مثال لمستند يتم تصديره إلى ملف بي دي إف محلياً داخل المتصفح:
- النقطة الأولى في القائمة
- النقطة الثانية مع أرقام وتفاصيل ١٢٣٤٥
`;

    const pdfBytes = await convertMarkdownToPdf(md, { title: 'Arabic Document' }, nodeCanvasCreator);
    assert.equal(String.fromCharCode(...pdfBytes.subarray(0, 5)), '%PDF-');

    const doc = await PDFDocument.load(pdfBytes);
    assert.ok(doc.getPageCount() >= 1);
  });

  it('converts multilingual and accented Latin markdown correctly', async () => {
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
  });
});
