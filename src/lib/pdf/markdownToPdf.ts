/**
 * High-fidelity Markdown-to-PDF engine.
 *
 * Architecture:
 * 1. Selectable Vector Text (Latin/Western European scripts):
 *    When input text is encodable in standard WinAnsi (English, French, Spanish, German,
 *    Portuguese, Italian, and common typographical punctuation like —, –, ‘, ’, “, ”, «, », €, £),
 *    this engine renders true native vector text using StandardFonts.Helvetica / HelveticaBold.
 *    The resulting PDF is ultra-compact (~1-2 KB), fully selectable, copyable, and searchable.
 *
 * 2. High-Resolution Canvas Rasterization (Complex scripts: Arabic, Cyrillic):
 *    Standard PDF 14 fonts (Helvetica, Times, Courier) use 8-bit WinAnsi encoding and cannot
 *    encode Cyrillic (Russian) or Arabic characters. Embedding multi-megabyte TTF fonts in the
 *    client-side bundle would degrade performance, and standard PDF text drawing lacks the
 *    complex text shaping (BiDi, cursive Arabic ligatures, HarfBuzz shaping) natively provided by
 *    the browser/canvas rendering engine. Therefore, complex scripts are rendered via 2x print-resolution
 *    canvas rasterization with RTL and font hierarchy preservation.
 */

import type { PDFFont } from 'pdf-lib';

export interface MarkdownPdfOptions {
  title?: string;
  author?: string;
}

export type CanvasCreator = (w: number, h: number) => {
  canvas: any;
  ctx: CanvasRenderingContext2D;
  toPngBytes: () => Promise<Uint8Array>;
};

/** Helper to get or create canvas in browser environment. */
function getBrowserCanvasCreator(): CanvasCreator {
  if (typeof document !== 'undefined' && typeof document.createElement === 'function') {
    return (w: number, h: number) => {
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d')!;
      return {
        canvas,
        ctx,
        toPngBytes: async () => {
          const blob = await new Promise<Blob>((resolve, reject) => {
            canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Canvas toBlob failed'))), 'image/png');
          });
          return new Uint8Array(await blob.arrayBuffer());
        },
      };
    };
  }
  throw new Error('Canvas environment is unavailable.');
}

const RTL_REGEX = /[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/;

function isRtlText(text: string): boolean {
  return RTL_REGEX.test(text);
}

/** Check if text can be natively encoded using PDF WinAnsi standard font encoding. */
function canEncodeWinAnsi(font: PDFFont, text: string): boolean {
  try {
    font.encodeText(text);
    return true;
  } catch {
    return false;
  }
}

/** Strips markdown formatting markers like bold/italic for drawing. */
function cleanMarkdownLine(raw: string): string {
  return raw
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    .replace(/`([^`]+)`/g, '$1');
}

/**
 * Renders Markdown as genuine, selectable, searchable vector text using pdf-lib.
 * Suitable for WinAnsi-compatible scripts (English, French, Spanish, German, Italian, Portuguese).
 */
async function renderVectorMarkdownPdf(
  markdownText: string,
  options: MarkdownPdfOptions = {}
): Promise<Uint8Array> {
  const { PDFDocument, StandardFonts, rgb } = await import('pdf-lib');
  const pdfDoc = await PDFDocument.create();
  pdfDoc.setTitle(options.title || 'Markdown Document');
  pdfDoc.setAuthor(options.author || 'Navorika');

  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const PAGE_WIDTH = 595.28; // A4 width at 72 pt
  const PAGE_HEIGHT = 841.89; // A4 height at 72 pt
  const MARGIN_LEFT = 54;
  const MARGIN_RIGHT = 54;
  const MARGIN_TOP = 54;
  const MARGIN_BOTTOM = 54;
  const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT;

  let page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  let currentY = PAGE_HEIGHT - MARGIN_TOP;

  const lines = markdownText.split(/\r?\n/);

  for (const rawLine of lines) {
    const trimmed = rawLine.trim();

    if (!trimmed) {
      currentY -= 12; // blank line spacing
      if (currentY < MARGIN_BOTTOM) {
        page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
        currentY = PAGE_HEIGHT - MARGIN_TOP;
      }
      continue;
    }

    let fontSize = 10.5;
    let leading = 15;
    let isHeading = false;
    let isBullet = false;
    let font = fontRegular;
    let textToDraw = trimmed;

    if (trimmed.startsWith('# ')) {
      isHeading = true;
      fontSize = 20;
      leading = 26;
      font = fontBold;
      textToDraw = trimmed.slice(2).trim();
    } else if (trimmed.startsWith('## ')) {
      isHeading = true;
      fontSize = 15;
      leading = 20;
      font = fontBold;
      textToDraw = trimmed.slice(3).trim();
    } else if (trimmed.startsWith('### ')) {
      isHeading = true;
      fontSize = 12.5;
      leading = 17;
      font = fontBold;
      textToDraw = trimmed.slice(4).trim();
    } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      isBullet = true;
      fontSize = 10.5;
      leading = 15;
      textToDraw = trimmed.slice(2).trim();
    }

    textToDraw = cleanMarkdownLine(textToDraw);

    const words = textToDraw.split(/\s+/);
    let line = '';

    const drawLine = (str: string, isFirstLine: boolean) => {
      if (currentY - leading < MARGIN_BOTTOM) {
        page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
        currentY = PAGE_HEIGHT - MARGIN_TOP;
      }
      const x = isBullet ? MARGIN_LEFT + 16 : MARGIN_LEFT;
      if (isBullet && isFirstLine) {
        page.drawText('•', {
          x: MARGIN_LEFT + 4,
          y: currentY,
          size: fontSize,
          font: fontRegular,
          color: rgb(0.2, 0.2, 0.2),
        });
      }
      page.drawText(str, {
        x,
        y: currentY,
        size: fontSize,
        font,
        color: isHeading ? rgb(0.08, 0.12, 0.2) : rgb(0.12, 0.15, 0.2),
      });
      currentY -= leading;
    };

    let firstLine = true;
    for (const word of words) {
      const candidate = line ? `${line} ${word}` : word;
      const width = font.widthOfTextAtSize(candidate, fontSize);
      if (width > CONTENT_WIDTH && line) {
        drawLine(line, firstLine);
        firstLine = false;
        line = word;
      } else {
        line = candidate;
      }
    }
    if (line) {
      drawLine(line, firstLine);
    }
    if (isHeading) currentY -= 6;
    else currentY -= 3;
  }

  return pdfDoc.save();
}

/**
 * High-resolution canvas-based PDF generation.
 * Handles complex Unicode scripts (Arabic RTL, Russian Cyrillic) preserving native
 * font shaping, cursive joining, and glyph layouts.
 */
async function renderCanvasMarkdownPdf(
  markdownText: string,
  options: MarkdownPdfOptions = {},
  customCanvasCreator?: CanvasCreator
): Promise<Uint8Array> {
  const { PDFDocument } = await import('pdf-lib');
  const pdfDoc = await PDFDocument.create();
  pdfDoc.setTitle(options.title || 'Markdown Document');
  pdfDoc.setAuthor(options.author || 'Navorika');

  const canvasCreator = customCanvasCreator || getBrowserCanvasCreator();

  // Page dimensions: A4 at 72 pt = 595 x 842. At 2x scale = 1190 x 1684.
  const PAGE_WIDTH = 1190;
  const PAGE_HEIGHT = 1684;
  const MARGIN_X = 100;
  const MARGIN_Y = 120;
  const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_X * 2;
  const MAX_Y = PAGE_HEIGHT - MARGIN_Y;

  const pagesPngBytes: Uint8Array[] = [];

  let currentCanvasInfo = canvasCreator(PAGE_WIDTH, PAGE_HEIGHT);
  let ctx = currentCanvasInfo.ctx;

  const initPage = (c: CanvasRenderingContext2D) => {
    c.fillStyle = '#ffffff';
    c.fillRect(0, 0, PAGE_WIDTH, PAGE_HEIGHT);
    c.textBaseline = 'top';
  };

  initPage(ctx);
  let currentY = MARGIN_Y;

  const flushPage = async () => {
    const bytes = await currentCanvasInfo.toPngBytes();
    pagesPngBytes.push(bytes);
    currentCanvasInfo = canvasCreator(PAGE_WIDTH, PAGE_HEIGHT);
    ctx = currentCanvasInfo.ctx;
    initPage(ctx);
    currentY = MARGIN_Y;
  };

  const lines = markdownText.split(/\r?\n/);

  for (const rawLine of lines) {
    const trimmed = rawLine.trim();

    if (!trimmed) {
      currentY += 24;
      if (currentY > MAX_Y) {
        await flushPage();
      }
      continue;
    }

    let fontSize = 22;
    let isHeading = false;
    let isBullet = false;
    let fontWeight = 'normal';
    let textToDraw = trimmed;

    if (trimmed.startsWith('# ')) {
      isHeading = true;
      fontSize = 38;
      fontWeight = 'bold';
      textToDraw = trimmed.slice(2).trim();
    } else if (trimmed.startsWith('## ')) {
      isHeading = true;
      fontSize = 30;
      fontWeight = 'bold';
      textToDraw = trimmed.slice(3).trim();
    } else if (trimmed.startsWith('### ')) {
      isHeading = true;
      fontSize = 26;
      fontWeight = 'bold';
      textToDraw = trimmed.slice(4).trim();
    } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      isBullet = true;
      fontSize = 22;
      textToDraw = trimmed.slice(2).trim();
    }

    textToDraw = cleanMarkdownLine(textToDraw);

    const rtl = isRtlText(textToDraw);
    const lineHeight = Math.round(fontSize * 1.55);

    ctx.font = `${fontWeight} ${fontSize}px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans", "Noto Sans Arabic", Arial, sans-serif`;
    ctx.fillStyle = isHeading ? '#0f172a' : '#1e293b';
    ctx.direction = rtl ? 'rtl' : 'ltr';
    ctx.textAlign = rtl ? 'right' : 'left';

    const words = textToDraw.split(/\s+/);
    let currentLine = '';

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const metrics = ctx.measureText(testLine);

      if (metrics.width > CONTENT_WIDTH && currentLine) {
        if (currentY + lineHeight > MAX_Y) {
          await flushPage();
          ctx.font = `${fontWeight} ${fontSize}px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans", "Noto Sans Arabic", Arial, sans-serif`;
          ctx.fillStyle = isHeading ? '#0f172a' : '#1e293b';
          ctx.direction = rtl ? 'rtl' : 'ltr';
          ctx.textAlign = rtl ? 'right' : 'left';
        }

        const drawX = rtl ? PAGE_WIDTH - MARGIN_X : MARGIN_X + (isBullet ? 28 : 0);
        ctx.fillText(currentLine, drawX, currentY);

        if (isBullet && !rtl) {
          ctx.fillText('•', MARGIN_X, currentY);
          isBullet = false;
        }

        currentY += lineHeight;
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }

    if (currentLine) {
      if (currentY + lineHeight > MAX_Y) {
        await flushPage();
        ctx.font = `${fontWeight} ${fontSize}px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans", "Noto Sans Arabic", Arial, sans-serif`;
        ctx.fillStyle = isHeading ? '#0f172a' : '#1e293b';
        ctx.direction = rtl ? 'rtl' : 'ltr';
        ctx.textAlign = rtl ? 'right' : 'left';
      }

      const drawX = rtl ? PAGE_WIDTH - MARGIN_X : MARGIN_X + (isBullet ? 28 : 0);
      ctx.fillText(currentLine, drawX, currentY);

      if (isBullet && !rtl) {
        ctx.fillText('•', MARGIN_X, currentY);
      }

      currentY += lineHeight + (isHeading ? 14 : 8);
    }
  }

  const finalBytes = await currentCanvasInfo.toPngBytes();
  pagesPngBytes.push(finalBytes);

  for (const pagePng of pagesPngBytes) {
    const embeddedImg = await pdfDoc.embedPng(pagePng);
    const pdfPage = pdfDoc.addPage([595, 842]);
    pdfPage.drawImage(embeddedImg, {
      x: 0,
      y: 0,
      width: 595,
      height: 842,
    });
  }

  return pdfDoc.save();
}

/**
 * Converts Markdown text into a valid PDF document.
 * - For Latin and Western scripts: produces selectable, searchable vector text.
 * - For complex scripts (Arabic RTL, Russian Cyrillic): uses high-resolution canvas
 *   rasterization to preserve complex cursive shaping and glyph integrity.
 */
export async function convertMarkdownToPdf(
  markdownText: string,
  options: MarkdownPdfOptions = {},
  customCanvasCreator?: CanvasCreator
): Promise<Uint8Array> {
  const { PDFDocument, StandardFonts } = await import('pdf-lib');
  const tempDoc = await PDFDocument.create();
  const font = await tempDoc.embedFont(StandardFonts.Helvetica);

  // Strip markdown markers, whitespace controls, and bullet prefixes to test character encodability
  const cleaned = cleanMarkdownLine(markdownText)
    .replace(/^[#\-*]\s+/gm, '')
    .replace(/[\r\n\t]/g, ' ')
    .trim();

  // If text is encodable in WinAnsi, render true selectable vector text
  if (canEncodeWinAnsi(font, cleaned)) {
    return renderVectorMarkdownPdf(markdownText, options);
  }

  // Fallback to high-resolution canvas rasterization for complex scripts (Arabic, Cyrillic)
  return renderCanvasMarkdownPdf(markdownText, options, customCanvasCreator);
}
