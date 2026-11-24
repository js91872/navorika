/**
 * PDF Comparison Calculation Engine
 *
 * Pure TypeScript implementation for word-level and visual document diffing,
 * page-by-page comparison, change detection, statistics, and report generation.
 *
 * Strictly free of DOM/React dependencies for deterministic Node.js and browser execution.
 */

export type DiffOp = 'equal' | 'insert' | 'delete';

export interface WordDiffToken {
  type: DiffOp;
  value: string;
}

export type PageStatus = 'identical' | 'modified' | 'added' | 'removed' | 'scanned';

export interface PageComparison {
  pageNumber: number;
  status: PageStatus;
  origText: string;
  revText: string;
  wordsAdded: number;
  wordsRemoved: number;
  wordsUnchanged: number;
  similarityPercent: number;
  isOrigScanned: boolean;
  isRevScanned: boolean;
  diffTokens: WordDiffToken[];
}

export interface DocumentInput {
  name: string;
  size: number;
  pages: { pageNumber: number; text: string }[];
}

export interface ComparisonSummary {
  origFileName: string;
  revFileName: string;
  origFileSize: number;
  revFileSize: number;
  origPageCount: number;
  revPageCount: number;
  totalPages: number;
  identicalPages: number;
  modifiedPages: number;
  addedPages: number;
  removedPages: number;
  scannedPages: number;
  totalWordsAdded: number;
  totalWordsRemoved: number;
  totalWordsUnchanged: number;
  totalOriginalWords: number;
  totalRevisedWords: number;
  overallSimilarityPercent: number;
  pages: PageComparison[];
  comparedAt: string;
}

export interface VisualDiffOptions {
  /**
   * Sensitivity tolerance (1 = ultra sensitive, detect 1-level RGB shifts; 50 = tolerant).
   * Default is 25.
   */
  sensitivityThreshold?: number;
  /**
   * RGBA tuple for highlighting changed pixels in the diff overlay.
   * Default is [229, 50, 45, 230] (Navorika red).
   */
  highlightColor?: [number, number, number, number];
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface VisualDiffResult {
  diffPixelCount: number;
  totalPixels: number;
  diffPercentage: number;
  isIdentical: boolean;
  boundingBoxes: BoundingBox[];
}

/**
 * Validates whether an ArrayBuffer or Uint8Array starts with valid PDF magic bytes (%PDF-).
 */
export function validatePdfBuffer(buffer: ArrayBuffer | Uint8Array): { valid: boolean; error?: string } {
  if (!buffer) {
    return { valid: false, error: 'File buffer is missing or empty.' };
  }
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  if (bytes.byteLength < 5) {
    return { valid: false, error: 'File is too small to be a valid PDF document (under 5 bytes).' };
  }
  // %PDF- is 0x25 0x50 0x44 0x46 0x2D
  const hasMagicBytes =
    bytes[0] === 0x25 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x44 &&
    bytes[3] === 0x46 &&
    bytes[4] === 0x2d;

  if (!hasMagicBytes) {
    return {
      valid: false,
      error: 'Invalid PDF header: Missing standard %PDF- identifier at start of file.',
    };
  }

  return { valid: true };
}

/**
 * Detects whether page text is empty or lacks extractable content (scanned image).
 */
export function isLikelyScannedText(text: string | null | undefined): boolean {
  if (!text) return true;
  const stripped = text.replace(/[\s\r\n\t]+/g, '');
  return stripped.length === 0;
}

/**
 * Tokenizes text into word-level strings, normalizing whitespace while preserving words.
 */
export function tokenizeWords(text: string): string[] {
  if (!text) return [];
  const words = text.trim().match(/\S+/g);
  return words ?? [];
}

/**
 * Computes word-level diff using a Myers-style dynamic programming diff algorithm.
 * Guarantees optimal shortest edit script for word sequences.
 */
export function diffWords(
  originalWords: string[] | string,
  revisedWords: string[] | string,
  options: { caseSensitive?: boolean } = {}
): WordDiffToken[] {
  const orig = Array.isArray(originalWords) ? originalWords : tokenizeWords(originalWords);
  const rev = Array.isArray(revisedWords) ? revisedWords : tokenizeWords(revisedWords);

  const n = orig.length;
  const m = rev.length;

  if (n === 0 && m === 0) return [];
  if (n === 0) return rev.map((w) => ({ type: 'insert', value: w }));
  if (m === 0) return orig.map((w) => ({ type: 'delete', value: w }));

  const caseSensitive = options.caseSensitive ?? true;
  const match = (a: string, b: string) => (caseSensitive ? a === b : a.toLowerCase() === b.toLowerCase());

  // LCS table
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Uint32Array(m + 1) as unknown as number[]);

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      if (match(orig[i], rev[j])) {
        dp[i + 1][j + 1] = dp[i][j] + 1;
      } else {
        dp[i + 1][j + 1] = Math.max(dp[i + 1][j], dp[i][j + 1]);
      }
    }
  }

  // Backtrack to build tokens
  const rawTokens: WordDiffToken[] = [];
  let i = n;
  let j = m;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && match(orig[i - 1], rev[j - 1])) {
      rawTokens.push({ type: 'equal', value: rev[j - 1] });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      rawTokens.push({ type: 'insert', value: rev[j - 1] });
      j--;
    } else if (i > 0 && (j === 0 || dp[i][j - 1] < dp[i - 1][j])) {
      rawTokens.push({ type: 'delete', value: orig[i - 1] });
      i--;
    }
  }

  rawTokens.reverse();

  // Combine contiguous tokens of identical type
  const result: WordDiffToken[] = [];
  for (const token of rawTokens) {
    if (result.length > 0 && result[result.length - 1].type === token.type) {
      result[result.length - 1].value += ' ' + token.value;
    } else {
      result.push({ ...token });
    }
  }

  return result;
}

/**
 * Compares two pages of text and calculates status, word counts, and similarity.
 */
export function comparePageTexts(
  pageNumber: number,
  origText: string | null,
  revText: string | null
): PageComparison {
  const isOrigNull = origText === null;
  const isRevNull = revText === null;

  if (isOrigNull && isRevNull) {
    return {
      pageNumber,
      status: 'identical',
      origText: '',
      revText: '',
      wordsAdded: 0,
      wordsRemoved: 0,
      wordsUnchanged: 0,
      similarityPercent: 100,
      isOrigScanned: false,
      isRevScanned: false,
      diffTokens: [],
    };
  }

  if (isOrigNull) {
    const revWords = tokenizeWords(revText ?? '');
    const isScanned = isLikelyScannedText(revText);
    return {
      pageNumber,
      status: 'added',
      origText: '',
      revText: revText ?? '',
      wordsAdded: revWords.length,
      wordsRemoved: 0,
      wordsUnchanged: 0,
      similarityPercent: 0,
      isOrigScanned: false,
      isRevScanned: isScanned,
      diffTokens: revWords.length > 0 ? [{ type: 'insert', value: revWords.join(' ') }] : [],
    };
  }

  if (isRevNull) {
    const origWords = tokenizeWords(origText ?? '');
    const isScanned = isLikelyScannedText(origText);
    return {
      pageNumber,
      status: 'removed',
      origText: origText ?? '',
      revText: '',
      wordsAdded: 0,
      wordsRemoved: origWords.length,
      wordsUnchanged: 0,
      similarityPercent: 0,
      isOrigScanned: isScanned,
      isRevScanned: false,
      diffTokens: origWords.length > 0 ? [{ type: 'delete', value: origWords.join(' ') }] : [],
    };
  }

  const origWords = tokenizeWords(origText);
  const revWords = tokenizeWords(revText);
  const isOrigScanned = isLikelyScannedText(origText);
  const isRevScanned = isLikelyScannedText(revText);

  if (isOrigScanned && isRevScanned) {
    return {
      pageNumber,
      status: 'scanned',
      origText,
      revText,
      wordsAdded: 0,
      wordsRemoved: 0,
      wordsUnchanged: 0,
      similarityPercent: 100,
      isOrigScanned: true,
      isRevScanned: true,
      diffTokens: [],
    };
  }

  const diffTokens = diffWords(origWords, revWords);

  let wordsAdded = 0;
  let wordsRemoved = 0;
  let wordsUnchanged = 0;

  for (const token of diffTokens) {
    const count = tokenizeWords(token.value).length;
    if (token.type === 'insert') wordsAdded += count;
    else if (token.type === 'delete') wordsRemoved += count;
    else wordsUnchanged += count;
  }

  const totalWords = Math.max(origWords.length, revWords.length);
  const similarityPercent =
    totalWords === 0
      ? 100
      : Math.round(((2 * wordsUnchanged) / (origWords.length + revWords.length)) * 1000) / 10;

  const isIdentical = wordsAdded === 0 && wordsRemoved === 0;

  return {
    pageNumber,
    status: isIdentical ? 'identical' : isOrigScanned || isRevScanned ? 'scanned' : 'modified',
    origText,
    revText,
    wordsAdded,
    wordsRemoved,
    wordsUnchanged,
    similarityPercent,
    isOrigScanned,
    isRevScanned,
    diffTokens,
  };
}

/**
 * Compares two documents across all pages and produces a complete comparison summary.
 */
export function compareDocuments(
  origDoc: DocumentInput,
  revDoc: DocumentInput,
  comparedAt: string = new Date().toISOString()
): ComparisonSummary {
  const origPageCount = origDoc.pages.length;
  const revPageCount = revDoc.pages.length;
  const totalPages = Math.max(origPageCount, revPageCount);

  const pageComparisons: PageComparison[] = [];
  let totalWordsAdded = 0;
  let totalWordsRemoved = 0;
  let totalWordsUnchanged = 0;
  let totalOriginalWords = 0;
  let totalRevisedWords = 0;

  let identicalPages = 0;
  let modifiedPages = 0;
  let addedPages = 0;
  let removedPages = 0;
  let scannedPages = 0;

  for (let p = 1; p <= totalPages; p++) {
    const origPage = origDoc.pages.find((page) => page.pageNumber === p);
    const revPage = revDoc.pages.find((page) => page.pageNumber === p);

    const origText = origPage ? origPage.text : null;
    const revText = revPage ? revPage.text : null;

    const pageResult = comparePageTexts(p, origText, revText);
    pageComparisons.push(pageResult);

    totalWordsAdded += pageResult.wordsAdded;
    totalWordsRemoved += pageResult.wordsRemoved;
    totalWordsUnchanged += pageResult.wordsUnchanged;

    if (origText) totalOriginalWords += tokenizeWords(origText).length;
    if (revText) totalRevisedWords += tokenizeWords(revText).length;

    switch (pageResult.status) {
      case 'identical':
        identicalPages++;
        break;
      case 'modified':
        modifiedPages++;
        break;
      case 'added':
        addedPages++;
        break;
      case 'removed':
        removedPages++;
        break;
      case 'scanned':
        scannedPages++;
        break;
    }
  }

  const denominator = totalOriginalWords + totalRevisedWords;
  const overallSimilarityPercent =
    denominator === 0
      ? 100
      : Math.round(((2 * totalWordsUnchanged) / denominator) * 1000) / 10;

  return {
    origFileName: origDoc.name,
    revFileName: revDoc.name,
    origFileSize: origDoc.size,
    revFileSize: revDoc.size,
    origPageCount,
    revPageCount,
    totalPages,
    identicalPages,
    modifiedPages,
    addedPages,
    removedPages,
    scannedPages,
    totalWordsAdded,
    totalWordsRemoved,
    totalWordsUnchanged,
    totalOriginalWords,
    totalRevisedWords,
    overallSimilarityPercent,
    pages: pageComparisons,
    comparedAt,
  };
}

/**
 * Compares two RGBA pixel buffers and calculates pixel difference metrics,
 * changed regions bounding boxes, and an optional diff heatmap overlay.
 */
export function computeVisualPixelDiff(
  origRgba: Uint8ClampedArray | Uint8Array,
  revRgba: Uint8ClampedArray | Uint8Array,
  width: number,
  height: number,
  options: VisualDiffOptions = {}
): { result: VisualDiffResult; diffImageData?: Uint8ClampedArray } {
  const sensitivity = options.sensitivityThreshold ?? 25;
  const highlightColor = options.highlightColor ?? [229, 50, 45, 230]; // Brand red

  const totalPixels = width * height;
  const diffImageData = new Uint8ClampedArray(totalPixels * 4);

  let diffPixelCount = 0;

  // Grid cells for cluster detection (32x32 blocks)
  const cellSize = 32;
  const cols = Math.ceil(width / cellSize);
  const rows = Math.ceil(height / cellSize);
  const grid = new Uint8Array(cols * rows);

  for (let i = 0; i < totalPixels; i++) {
    const offset = i * 4;

    const r1 = origRgba[offset];
    const g1 = origRgba[offset + 1];
    const b1 = origRgba[offset + 2];
    const a1 = origRgba[offset + 3];

    const r2 = revRgba[offset];
    const g2 = revRgba[offset + 1];
    const b2 = revRgba[offset + 2];
    const a2 = revRgba[offset + 3];

    // Color difference using Manhattan metric with alpha consideration
    const colorDist = (Math.abs(r1 - r2) + Math.abs(g1 - g2) + Math.abs(b1 - b2)) / 3;
    const alphaDist = Math.abs(a1 - a2);

    const isDifferent = colorDist > sensitivity || alphaDist > sensitivity;

    if (isDifferent) {
      diffPixelCount++;

      // Highlight changed pixel
      diffImageData[offset] = highlightColor[0];
      diffImageData[offset + 1] = highlightColor[1];
      diffImageData[offset + 2] = highlightColor[2];
      diffImageData[offset + 3] = highlightColor[3];

      const x = i % width;
      const y = Math.floor(i / width);
      const col = Math.floor(x / cellSize);
      const row = Math.floor(y / cellSize);
      grid[row * cols + col] = 1;
    } else {
      // Retain dim grayscale baseline representation
      const gray = Math.round((r2 * 0.299 + g2 * 0.587 + b2 * 0.114) * 0.65 + 70);
      diffImageData[offset] = gray;
      diffImageData[offset + 1] = gray;
      diffImageData[offset + 2] = gray;
      diffImageData[offset + 3] = 180;
    }
  }

  // Aggregate bounding boxes from active grid cells
  const boundingBoxes: BoundingBox[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r * cols + c] === 1) {
        boundingBoxes.push({
          x: c * cellSize,
          y: r * cellSize,
          width: Math.min(cellSize, width - c * cellSize),
          height: Math.min(cellSize, height - r * cellSize),
        });
      }
    }
  }

  const diffPercentage =
    totalPixels === 0 ? 0 : Math.round((diffPixelCount / totalPixels) * 1000) / 10;

  return {
    result: {
      diffPixelCount,
      totalPixels,
      diffPercentage,
      isIdentical: diffPixelCount === 0,
      boundingBoxes,
    },
    diffImageData,
  };
}

/**
 * Formats file size in bytes to human-readable string.
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Generates an exhaustive plain-text comparison audit report.
 */
export function generateTextComparisonReport(summary: ComparisonSummary): string {
  const divider = '='.repeat(70);
  const subDivider = '-'.repeat(70);

  const lines: string[] = [
    divider,
    'NAVORIKA PDF COMPARISON REPORT',
    'Generated 100% locally in browser memory. No data was sent to a server.',
    divider,
    `Date & Time:           ${summary.comparedAt}`,
    `Original Document:     ${summary.origFileName} (${formatBytes(summary.origFileSize)}, ${summary.origPageCount} pages)`,
    `Revised Document:      ${summary.revFileName} (${formatBytes(summary.revFileSize)}, ${summary.revPageCount} pages)`,
    `Total Compared Pages:  ${summary.totalPages}`,
    subDivider,
    'OVERALL SUMMARY STATISTICS:',
    `Text Similarity:       ${summary.overallSimilarityPercent}%`,
    `Words Added (+):       ${summary.totalWordsAdded}`,
    `Words Removed (-):     ${summary.totalWordsRemoved}`,
    `Words Unchanged:       ${summary.totalWordsUnchanged}`,
    `Original Total Words:  ${summary.totalOriginalWords}`,
    `Revised Total Words:   ${summary.totalRevisedWords}`,
    subDivider,
    'PAGE-BY-PAGE AUDIT BREAKDOWN:',
    `Identical Pages:       ${summary.identicalPages}`,
    `Modified Pages:        ${summary.modifiedPages}`,
    `Added / Inserted:      ${summary.addedPages}`,
    `Removed / Deleted:     ${summary.removedPages}`,
    `Scanned / No Text:     ${summary.scannedPages}`,
    divider,
    '',
  ];

  for (const page of summary.pages) {
    lines.push(`PAGE ${page.pageNumber}: [STATUS: ${page.status.toUpperCase()}]`);
    lines.push(`  Similarity:      ${page.similarityPercent}%`);
    lines.push(`  Words Added:     +${page.wordsAdded}`);
    lines.push(`  Words Removed:   -${page.wordsRemoved}`);
    lines.push(`  Words Unchanged: ${page.wordsUnchanged}`);

    if (page.isOrigScanned || page.isRevScanned) {
      lines.push(
        '  Notice: Scanned image detected. Text comparison requires OCR. Visual comparison active.'
      );
    }

    if (page.status === 'modified' && page.diffTokens.length > 0) {
      lines.push('  Key Changes:');
      for (const token of page.diffTokens) {
        if (token.type === 'insert') {
          lines.push(`    [+] "${token.value}"`);
        } else if (token.type === 'delete') {
          lines.push(`    [-] "${token.value}"`);
        }
      }
    }
    lines.push('');
  }

  lines.push(divider);
  lines.push('End of Comparison Report — Verified via Navorika Client Engine');
  lines.push(divider);

  return lines.join('\n');
}

/**
 * Generates structured JSON export of the comparison summary.
 */
export function generateJsonComparisonReport(summary: ComparisonSummary): string {
  return JSON.stringify(summary, null, 2);
}
