import { PDFDocument, PDFName } from 'pdf-lib';

export interface PageBoxRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface PageBoxInput {
  mediaBox: PageBoxRect;
  cropBox?: PageBoxRect;
  trimBox?: PageBoxRect;
  bleedBox?: PageBoxRect;
  isTrimBoxExplicit?: boolean;
  isBleedBoxExplicit?: boolean;
  isCropBoxExplicit?: boolean;
}

export interface PageBoxInspection {
  pageNumber: number;
  mediaBox: PageBoxRect;
  cropBox: PageBoxRect;
  trimBox: PageBoxRect;
  bleedBox: PageBoxRect;
  hasExplicitTrimBox: boolean;
  hasExplicitBleedBox: boolean;
  hasExplicitCropBox: boolean;
  trimWidthPt: number;
  trimHeightPt: number;
  trimWidthMm: number;
  trimHeightMm: number;
  bleedMarginPt: { top: number; bottom: number; left: number; right: number };
  bleedMarginMm: { top: number; bottom: number; left: number; right: number };
  hasExtraBleedBoxArea: boolean;
  interpretation: string;
}

export interface PdfBleedTrimResult {
  valid: boolean;
  error?: string;
  pageCount: number;
  pages: PageBoxInspection[];
  summary: string;
  [key: string]: any;
}

function safeNumber(val: unknown, fallback = 0): number {
  const num = Number(val);
  return Number.isFinite(num) ? num : fallback;
}

function ptToMm(pt: number): number {
  return Number(((pt / 72) * 25.4).toFixed(2));
}

function normalizeRect(rect?: Partial<PageBoxRect>): PageBoxRect {
  const x = safeNumber(rect?.x, 0);
  const y = safeNumber(rect?.y, 0);
  const width = Math.max(0, safeNumber(rect?.width, 0));
  const height = Math.max(0, safeNumber(rect?.height, 0));
  return { x, y, width, height };
}

export function analyzePageBoxes(input: PageBoxInput, pageNumber = 1): PageBoxInspection {
  const mediaBox = normalizeRect(input.mediaBox);
  const hasExplicitCrop = Boolean(input.isCropBoxExplicit);
  const hasExplicitTrim = Boolean(input.isTrimBoxExplicit);
  const hasExplicitBleed = Boolean(input.isBleedBoxExplicit);

  const cropBox = input.cropBox ? normalizeRect(input.cropBox) : mediaBox;
  const trimBox = input.trimBox ? normalizeRect(input.trimBox) : (hasExplicitCrop ? cropBox : mediaBox);
  const bleedBox = input.bleedBox ? normalizeRect(input.bleedBox) : (hasExplicitCrop ? cropBox : mediaBox);

  const trimTop = trimBox.y + trimBox.height;
  const trimRight = trimBox.x + trimBox.width;
  const bleedTop = bleedBox.y + bleedBox.height;
  const bleedRight = bleedBox.x + bleedBox.width;

  const topMarginPt = Math.max(0, Number((bleedTop - trimTop).toFixed(2)));
  const bottomMarginPt = Math.max(0, Number((trimBox.y - bleedBox.y).toFixed(2)));
  const leftMarginPt = Math.max(0, Number((trimBox.x - bleedBox.x).toFixed(2)));
  const rightMarginPt = Math.max(0, Number((bleedRight - trimRight).toFixed(2)));

  const hasExtraBleed = hasExplicitBleed && (topMarginPt > 0 || bottomMarginPt > 0 || leftMarginPt > 0 || rightMarginPt > 0);

  let interpretation: string;
  if (!hasExplicitTrim && !hasExplicitBleed) {
    interpretation =
      'Default configuration: No explicit TrimBox or BleedBox declared on this page. Per ISO 32000-1 (PDF 1.7), TrimBox and BleedBox inherit from CropBox/MediaBox. The absence of explicit PDF boxes does not prove that visual artwork bleed is missing, nor does it guarantee bleed is present.';
  } else if (hasExplicitTrim && !hasExplicitBleed) {
    interpretation =
      'TrimBox is explicitly defined, but no BleedBox is declared. BleedBox defaults to CropBox. Review whether the printer requires an explicit BleedBox or accepts TrimBox plus CropBox boundaries.';
  } else if (!hasExplicitTrim && hasExplicitBleed) {
    interpretation =
      'BleedBox is explicitly declared, but TrimBox is omitted (inherits from CropBox/MediaBox). Usually, prepress workflows require both TrimBox and BleedBox to calculate trim allowances.';
  } else if (hasExtraBleed) {
    const avgMarginMm = Number((((topMarginPt + bottomMarginPt + leftMarginPt + rightMarginPt) / 4 / 72) * 25.4).toFixed(2));
    interpretation = `Explicit bleed boxes configured. BleedBox extends beyond TrimBox by ~${avgMarginMm} mm average margin. Note: An explicit BleedBox defines PDF page geometry, but prepress visual inspection is still required to confirm artwork graphics reach the bleed edge.`;
  } else {
    interpretation =
      'Both TrimBox and BleedBox are explicitly declared, but BleedBox dimensions match TrimBox (0 mm bleed margin). Artwork has no defined PDF bleed geometry beyond the final cut line.';
  }

  return {
    pageNumber,
    mediaBox,
    cropBox,
    trimBox,
    bleedBox,
    hasExplicitTrimBox: hasExplicitTrim,
    hasExplicitBleedBox: hasExplicitBleed,
    hasExplicitCropBox: hasExplicitCrop,
    trimWidthPt: Number(trimBox.width.toFixed(2)),
    trimHeightPt: Number(trimBox.height.toFixed(2)),
    trimWidthMm: ptToMm(trimBox.width),
    trimHeightMm: ptToMm(trimBox.height),
    bleedMarginPt: {
      top: topMarginPt,
      bottom: bottomMarginPt,
      left: leftMarginPt,
      right: rightMarginPt,
    },
    bleedMarginMm: {
      top: ptToMm(topMarginPt),
      bottom: ptToMm(bottomMarginPt),
      left: ptToMm(leftMarginPt),
      right: ptToMm(rightMarginPt),
    },
    hasExtraBleedBoxArea: hasExtraBleed,
    interpretation,
  };
}

export async function parsePdfBleedTrim(pdfBytes: Uint8Array | ArrayBuffer): Promise<PdfBleedTrimResult> {
  try {
    const bytes = pdfBytes instanceof Uint8Array ? pdfBytes : new Uint8Array(pdfBytes);
    if (!bytes.length) {
      return {
        valid: false,
        error: 'PDF file buffer is empty.',
        pageCount: 0,
        pages: [],
        summary: 'Invalid input',
      };
    }

    const pdfDoc = await PDFDocument.load(bytes, { ignoreEncryption: true });
    const pages = pdfDoc.getPages();
    if (!pages.length) {
      return {
        valid: false,
        error: 'PDF document contains no pages.',
        pageCount: 0,
        pages: [],
        summary: 'No pages found',
      };
    }

    const inspections: PageBoxInspection[] = pages.map((page, index) => {
      const media = page.getMediaBox();
      const crop = page.getCropBox();
      const trim = page.getTrimBox();
      const bleed = page.getBleedBox();

      const hasExplicitTrim = page.node.has(PDFName.of('TrimBox'));
      const hasExplicitBleed = page.node.has(PDFName.of('BleedBox'));
      const hasExplicitCrop = page.node.has(PDFName.of('CropBox'));

      return analyzePageBoxes(
        {
          mediaBox: { x: media.x, y: media.y, width: media.width, height: media.height },
          cropBox: { x: crop.x, y: crop.y, width: crop.width, height: crop.height },
          trimBox: { x: trim.x, y: trim.y, width: trim.width, height: trim.height },
          bleedBox: { x: bleed.x, y: bleed.y, width: bleed.width, height: bleed.height },
          isTrimBoxExplicit: hasExplicitTrim,
          isBleedBoxExplicit: hasExplicitBleed,
          isCropBoxExplicit: hasExplicitCrop,
        },
        index + 1
      );
    });

    const hasAnyExplicitTrim = inspections.some((p) => p.hasExplicitTrimBox);
    const hasAnyExplicitBleed = inspections.some((p) => p.hasExplicitBleedBox);

    const summary = `${inspections.length} page${inspections.length === 1 ? '' : 's'} inspected. ${
      hasAnyExplicitTrim ? 'Explicit TrimBox detected.' : 'No explicit TrimBox (defaults to MediaBox).'
    } ${hasAnyExplicitBleed ? 'Explicit BleedBox detected.' : 'No explicit BleedBox.'}`;

    return {
      valid: true,
      pageCount: inspections.length,
      pages: inspections,
      summary,
    };
  } catch (err) {
    return {
      valid: false,
      error: err instanceof Error ? err.message : 'Failed to parse PDF document.',
      pageCount: 0,
      pages: [],
      summary: 'Error reading PDF',
    };
  }
}
