import { PDFDocument } from 'pdf-lib';

export interface StandardPaperSize {
  name: string;
  widthPt: number;
  heightPt: number;
  widthMm: number;
  heightMm: number;
  widthIn: number;
  heightIn: number;
}

export const standardPaperSizes: StandardPaperSize[] = [
  { name: 'A0', widthPt: 2383.94, heightPt: 3370.39, widthMm: 841, heightMm: 1189, widthIn: 33.11, heightIn: 46.81 },
  { name: 'A1', widthPt: 1683.78, heightPt: 2383.94, widthMm: 594, heightMm: 841, widthIn: 23.39, heightIn: 33.11 },
  { name: 'A2', widthPt: 1190.55, heightPt: 1683.78, widthMm: 420, heightMm: 594, widthIn: 16.54, heightIn: 23.39 },
  { name: 'A3', widthPt: 841.89, heightPt: 1190.55, widthMm: 297, heightMm: 420, widthIn: 11.69, heightIn: 16.54 },
  { name: 'A4', widthPt: 595.28, heightPt: 841.89, widthMm: 210, heightMm: 297, widthIn: 8.27, heightIn: 11.69 },
  { name: 'A5', widthPt: 419.53, heightPt: 595.28, widthMm: 148, heightMm: 210, widthIn: 5.83, heightIn: 8.27 },
  { name: 'A6', widthPt: 297.64, heightPt: 419.53, widthMm: 105, heightMm: 148, widthIn: 4.13, heightIn: 5.83 },
  { name: 'Letter', widthPt: 612, heightPt: 792, widthMm: 215.9, heightMm: 279.4, widthIn: 8.5, heightIn: 11.0 },
  { name: 'Legal', widthPt: 612, heightPt: 1008, widthMm: 215.9, heightMm: 355.6, widthIn: 8.5, heightIn: 14.0 },
  { name: 'Tabloid / Ledger', widthPt: 792, heightPt: 1224, widthMm: 279.4, heightMm: 431.8, widthIn: 11.0, heightIn: 17.0 },
  { name: 'Executive', widthPt: 522, heightPt: 756, widthMm: 184.15, heightMm: 266.7, widthIn: 7.25, heightIn: 10.5 },
  { name: 'Half Letter', widthPt: 396, heightPt: 612, widthMm: 139.7, heightMm: 215.9, widthIn: 5.5, heightIn: 8.5 },
  { name: 'US Business Card', widthPt: 252, heightPt: 144, widthMm: 88.9, heightMm: 50.8, widthIn: 3.5, heightIn: 2.0 },
  { name: 'EU Business Card', widthPt: 240.94, heightPt: 155.91, widthMm: 85.0, heightMm: 55.0, widthIn: 3.35, heightIn: 2.17 },
];

export interface PageSizeInspection {
  pageNumber: number;
  widthPt: number;
  heightPt: number;
  widthIn: number;
  heightIn: number;
  widthMm: number;
  heightMm: number;
  orientation: 'Portrait' | 'Landscape' | 'Square';
  matchedStandardSize: string;
  isStandardSize: boolean;
}

export interface PdfPageSizeAnalysis {
  valid: boolean;
  error?: string;
  pageCount: number;
  isUniformSize: boolean;
  primaryStandardSize: string;
  pages: PageSizeInspection[];
  summary: string;
  differingPagesNote: string;
  [key: string]: any;
}

function roundTo(num: number, digits = 2): number {
  return Number(num.toFixed(digits));
}

export function classifyPageDimensions(widthPt: number, heightPt: number, pageNumber = 1): PageSizeInspection {
  const w = Number.isFinite(widthPt) ? Math.max(0, widthPt) : 0;
  const h = Number.isFinite(heightPt) ? Math.max(0, heightPt) : 0;

  const widthIn = roundTo(w / 72, 2);
  const heightIn = roundTo(h / 72, 2);
  const widthMm = roundTo((w / 72) * 25.4, 1);
  const heightMm = roundTo((h / 72) * 25.4, 1);

  let orientation: 'Portrait' | 'Landscape' | 'Square' = 'Portrait';
  if (Math.abs(w - h) < 1) {
    orientation = 'Square';
  } else if (w > h) {
    orientation = 'Landscape';
  }

  // Find matching standard size regardless of orientation (short side vs long side)
  const shortPt = Math.min(w, h);
  const longPt = Math.max(w, h);
  const tolerancePt = 4.0; // ~1.4 mm tolerance

  let matchedSize = 'Custom';
  let isStandard = false;

  for (const std of standardPaperSizes) {
    const stdShort = Math.min(std.widthPt, std.heightPt);
    const stdLong = Math.max(std.widthPt, std.heightPt);

    if (Math.abs(shortPt - stdShort) <= tolerancePt && Math.abs(longPt - stdLong) <= tolerancePt) {
      matchedSize = `${std.name} (${orientation})`;
      isStandard = true;
      break;
    }
  }

  return {
    pageNumber,
    widthPt: roundTo(w, 2),
    heightPt: roundTo(h, 2),
    widthIn,
    heightIn,
    widthMm,
    heightMm,
    orientation,
    matchedStandardSize: matchedSize,
    isStandardSize: isStandard,
  };
}

export function analyzePdfPages(pages: Array<{ width: number; height: number; pageNumber?: number }>): PdfPageSizeAnalysis {
  if (!pages || pages.length === 0) {
    return {
      valid: false,
      error: 'No page dimensions provided.',
      pageCount: 0,
      isUniformSize: false,
      primaryStandardSize: 'None',
      pages: [],
      summary: 'No pages found',
      differingPagesNote: '',
    };
  }

  const inspected = pages.map((p, index) => classifyPageDimensions(p.width, p.height, p.pageNumber ?? index + 1));

  const first = inspected[0];
  const tolerance = 2.0;
  const differing = inspected.filter(
    (p) => Math.abs(p.widthPt - first.widthPt) > tolerance || Math.abs(p.heightPt - first.heightPt) > tolerance
  );

  const isUniform = differing.length === 0;
  const primaryStandardSize = first.matchedStandardSize;

  let differingPagesNote = '';
  if (!isUniform) {
    const count = differing.length;
    differingPagesNote = `Note: Multipage document with mixed sizes. ${count} page${
      count === 1 ? ' differs' : 's differ'
    } from Page 1 dimensions (${first.widthMm} × ${first.heightMm} mm).`;
  }

  const summary = isUniform
    ? `${inspected.length} page${inspected.length === 1 ? '' : 's'} — All pages uniformly ${first.matchedStandardSize} (${first.widthMm} × ${first.heightMm} mm / ${first.widthIn} × ${first.heightIn} in, ${first.orientation}).`
    : `${inspected.length} pages — Mixed page dimensions detected across document. Page 1 is ${first.matchedStandardSize} (${first.widthMm} × ${first.heightMm} mm).`;

  return {
    valid: true,
    pageCount: inspected.length,
    isUniformSize: isUniform,
    primaryStandardSize,
    pages: inspected,
    summary,
    differingPagesNote,
  };
}

export async function parsePdfPageSizes(pdfBytes: Uint8Array | ArrayBuffer): Promise<PdfPageSizeAnalysis> {
  try {
    const bytes = pdfBytes instanceof Uint8Array ? pdfBytes : new Uint8Array(pdfBytes);
    if (!bytes.length) {
      return {
        valid: false,
        error: 'PDF file is empty.',
        pageCount: 0,
        isUniformSize: false,
        primaryStandardSize: 'None',
        pages: [],
        summary: 'Empty input',
        differingPagesNote: '',
      };
    }

    const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
    const pdfPages = doc.getPages();
    if (!pdfPages.length) {
      return {
        valid: false,
        error: 'PDF contains no pages.',
        pageCount: 0,
        isUniformSize: false,
        primaryStandardSize: 'None',
        pages: [],
        summary: 'Zero pages',
        differingPagesNote: '',
      };
    }

    const dims = pdfPages.map((page, idx) => {
      const { width, height } = page.getMediaBox();
      return { width, height, pageNumber: idx + 1 };
    });

    return analyzePdfPages(dims);
  } catch (err) {
    return {
      valid: false,
      error: err instanceof Error ? err.message : 'Failed to read PDF pages.',
      pageCount: 0,
      isUniformSize: false,
      primaryStandardSize: 'None',
      pages: [],
      summary: 'Invalid PDF',
      differingPagesNote: '',
    };
  }
}
