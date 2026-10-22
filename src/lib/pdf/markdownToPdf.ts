/**
 * High-fidelity Markdown-to-PDF engine.
 * Preserves user-entered Unicode text across all scripts (Arabic, Cyrillic, Latin accents, CJK)
 * using canvas vector-rasterization at 2x print resolution embedded into PDFDocument.
 * Performs RTL detection, word wrapping, heading hierarchies, and pagination.
 */

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

/**
 * Converts Markdown text into a valid PDF document preserving full Unicode and Arabic/Russian text.
 */
export async function convertMarkdownToPdf(
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

  // Initialize first page
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
      currentY += 24; // empty line spacing
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

    // Strip inline formatting markers like **bold** or _italic_
    textToDraw = textToDraw.replace(/\*\*([^*]+)\*\*/g, '$1').replace(/_([^_]+)_/g, '$1');

    const rtl = isRtlText(textToDraw);
    const lineHeight = Math.round(fontSize * 1.55);

    ctx.font = `${fontWeight} ${fontSize}px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans", "Noto Sans Arabic", Arial, sans-serif`;
    ctx.fillStyle = isHeading ? '#0f172a' : '#1e293b';
    ctx.direction = rtl ? 'rtl' : 'ltr';
    ctx.textAlign = rtl ? 'right' : 'left';

    // Word wrap
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
          isBullet = false; // only draw bullet on first line
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

  // Flush final page
  const finalBytes = await currentCanvasInfo.toPngBytes();
  pagesPngBytes.push(finalBytes);

  // Embed PNGs into PDFDocument
  for (const pagePng of pagesPngBytes) {
    const embeddedImg = await pdfDoc.embedPng(pagePng);
    const pdfPage = pdfDoc.addPage([595, 842]); // A4
    pdfPage.drawImage(embeddedImg, {
      x: 0,
      y: 0,
      width: 595,
      height: 842,
    });
  }

  return pdfDoc.save();
}
