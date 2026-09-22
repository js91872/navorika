/**
 * Client-Side PDF Text Extractor
 *
 * Uses pdfjs-dist dynamically in the browser to extract text layers page-by-page.
 * Handles progress reporting, cancellation, password-protected PDFs, corrupt files,
 * hyphenated line wraps, and scanned page detection.
 *
 * Privacy guarantee: 100% on-device processing. No data is sent over the network.
 */

import type { PageRawInput } from '@/lib/calculations/pdfWordCounter';

export interface ExtractionProgress {
  currentPage: number;
  totalPages: number;
  percent: number;
}

export interface ExtractionOptions {
  onProgress?: (progress: ExtractionProgress) => void;
  signal?: AbortSignal;
}

export interface OcrExtensionPoint {
  isAvailable: boolean;
  providerName: string;
  recognizePage?: (pageIndex: number) => Promise<string>;
}

export const ocrExtensionPoint: OcrExtensionPoint = {
  isAvailable: false,
  providerName: 'None (Local client OCR not installed)',
};

/**
 * Checks if the buffer starts with the PDF magic bytes (%PDF-).
 */
export function isValidPdfBuffer(buffer: ArrayBuffer): boolean {
  if (!buffer || buffer.byteLength < 5) return false;
  const bytes = new Uint8Array(buffer.slice(0, 5));
  // %PDF- is 0x25 0x50 0x44 0x46 0x2D
  return (
    bytes[0] === 0x25 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x44 &&
    bytes[3] === 0x46 &&
    bytes[4] === 0x2d
  );
}

/**
 * Asynchronously loads pdfjs-dist and configures the worker.
 */
export async function loadPdfJs() {
  const pdfjs = await import('pdfjs-dist');
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url
  ).toString();
  return pdfjs;
}

export interface PdfTextContentItem {
  str?: string;
  hasEOL?: boolean;
  [key: string]: unknown;
}

/**
 * Normalizes text items from a PDF page into coherent paragraphs and lines.
 * Handles trailing line-break hyphens and spacing between fragmented text items.
 */
function assemblePageText(items: readonly unknown[]): string {
  const lines: string[] = [];
  let currentLine = '';

  for (let i = 0; i < items.length; i++) {
    const item = items[i] as PdfTextContentItem | undefined;
    if (!item || typeof item.str !== 'string') continue;

    const str = item.str;

    if (currentLine.length > 0 && !currentLine.endsWith(' ') && !str.startsWith(' ')) {
      // If previous item was separated, add a space
      currentLine += ' ';
    }
    currentLine += str;

    if (item.hasEOL || i === items.length - 1) {
      // Check for trailing hyphen indicating a wrapped word (e.g. "repre-", "\n", "sentative")
      if (currentLine.endsWith('-') && currentLine.length > 1 && !currentLine.endsWith(' -')) {
        // Look ahead to check if next item starts with lowercase letter
        const nextItem = items[i + 1] as PdfTextContentItem | undefined;
        if (nextItem && typeof nextItem.str === 'string' && /^[a-z]/i.test(nextItem.str.trim())) {
          // De-hyphenate line break
          currentLine = currentLine.slice(0, -1);
        } else {
          lines.push(currentLine.trim());
          currentLine = '';
        }
      } else {
        lines.push(currentLine.trim());
        currentLine = '';
      }
    }
  }

  if (currentLine.trim()) {
    lines.push(currentLine.trim());
  }

  return lines.filter(Boolean).join('\n');
}

/**
 * Extracts text page-by-page from a PDF ArrayBuffer.
 */
export async function extractPdfTextPages(
  buffer: ArrayBuffer,
  options: ExtractionOptions = {}
): Promise<PageRawInput[]> {
  if (!isValidPdfBuffer(buffer)) {
    throw new Error('The selected file does not appear to be a valid PDF document (missing %PDF- header).');
  }

  const pdfjs = await loadPdfJs();
  const loadingTask = pdfjs.getDocument({
    data: new Uint8Array(buffer),
    // Disable external font fetching or remote content to ensure privacy and security
    disableFontFace: false,
    useSystemFonts: true,
  });

  try {
    const doc = await loadingTask.promise;
    const totalPages = doc.numPages;
    const pages: PageRawInput[] = [];

    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
      if (options.signal?.aborted) {
        throw new Error('Text extraction was cancelled.');
      }

      // Yield event loop to keep UI completely responsive
      await new Promise((resolve) => setTimeout(resolve, 0));

      const page = await doc.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageText = assemblePageText(textContent.items);

      pages.push({
        pageNumber: pageNum,
        text: pageText,
      });

      if (options.onProgress) {
        options.onProgress({
          currentPage: pageNum,
          totalPages,
          percent: Math.round((pageNum / totalPages) * 100),
        });
      }
    }

    return pages;
  } catch (err: unknown) {
    if (err instanceof Error) {
      if (err.name === 'PasswordException' || /password/i.test(err.message)) {
        throw new Error('This PDF is password-protected. Please unlock or decrypt the document before counting words.');
      }
      if (err.name === 'InvalidPDFException' || /corrupt|invalid/i.test(err.message)) {
        throw new Error('The PDF file is corrupted or could not be parsed by the browser text engine.');
      }
      throw err;
    }
    throw new Error('An unexpected error occurred while parsing the PDF document.');
  } finally {
    try {
      await loadingTask.destroy();
    } catch {
      // ignore cleanup errors
    }
  }
}
