'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Upload,
  FileText,
  X,
  ShieldCheck,
  Download,
  Loader2,
  Scissors,
  Check,
  CheckCircle2,
  AlertCircle,
  Layers,
  Archive,
} from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import JSZip from 'jszip';
import { tools } from '@/data/registry';

type SplitMode = 'extract' | 'split-all';

interface ThumbnailMap {
  [pageNum: number]: string;
}

interface SplitResult {
  url: string;
  filename: string;
  size: number;
  count: number;
  mode: SplitMode;
}

interface RangeParseResult {
  pages: number[];
  invalidTokens: string[];
  outOfRangeNumbers: number[];
  hasError: boolean;
}

async function loadPdfJs() {
  const pdfjs = await import('pdfjs-dist');
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url
  ).toString();
  return pdfjs;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatPageRange(pages: number[]): string {
  if (pages.length === 0) return '';
  const sorted = [...pages].sort((a, b) => a - b);
  const ranges: string[] = [];
  let start = sorted[0];
  let end = sorted[0];

  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] === end + 1) {
      end = sorted[i];
    } else {
      ranges.push(start === end ? `${start}` : `${start}-${end}`);
      start = sorted[i];
      end = sorted[i];
    }
  }
  ranges.push(start === end ? `${start}` : `${start}-${end}`);
  return ranges.join(', ');
}

function parsePageRange(input: string, totalPages: number): RangeParseResult {
  const trimmed = input.trim();
  if (!trimmed) {
    return { pages: [], invalidTokens: [], outOfRangeNumbers: [], hasError: false };
  }

  const tokens = trimmed.split(',').map((t) => t.trim()).filter(Boolean);
  const resultSet = new Set<number>();
  const invalidTokens: string[] = [];
  const outOfRangeNumbers: number[] = [];

  for (const token of tokens) {
    if (token.includes('-')) {
      const parts = token.split('-').map((p) => p.trim());
      if (parts.length !== 2) {
        invalidTokens.push(token);
        continue;
      }
      const start = Number(parts[0]);
      const end = Number(parts[1]);
      if (isNaN(start) || isNaN(end) || !Number.isInteger(start) || !Number.isInteger(end)) {
        invalidTokens.push(token);
        continue;
      }
      const min = Math.min(start, end);
      const max = Math.max(start, end);

      let tokenHasOutOfRange = false;
      for (let p = min; p <= max; p++) {
        if (p < 1 || p > totalPages) {
          outOfRangeNumbers.push(p);
          tokenHasOutOfRange = true;
        } else {
          resultSet.add(p);
        }
      }
      if (tokenHasOutOfRange && min > totalPages) {
        invalidTokens.push(token);
      }
    } else {
      const num = Number(token);
      if (isNaN(num) || !Number.isInteger(num)) {
        invalidTokens.push(token);
      } else if (num < 1 || num > totalPages) {
        outOfRangeNumbers.push(num);
      } else {
        resultSet.add(num);
      }
    }
  }

  const pages = Array.from(resultSet).sort((a, b) => a - b);
  const hasError = invalidTokens.length > 0 || outOfRangeNumbers.length > 0;

  return { pages, invalidTokens, outOfRangeNumbers, hasError };
}

export default function SplitPDFTool() {
  const meta = tools.find((t) => t.slug === 'split-pdf');
  const toolMeta = meta || {
    heroTitle: 'Split PDF Online',
    heroDescription: 'Visually select PDF pages to extract or split into individual documents.',
    formulaExplanation: 'This tool processes your documents locally in your browser.',
    faq: [
      {
        question: 'How does this tool work?',
        answer: 'All processing happens locally in your browser. No data is ever uploaded to any server.',
      },
      {
        question: 'Is my data safe?',
        answer: 'Yes! Your files and data never leave your computer.',
      },
      {
        question: 'Do I need to install anything?',
        answer: 'No installation needed. Everything runs directly in your web browser.',
      },
    ],
  };

  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [thumbnails, setThumbnails] = useState<ThumbnailMap>({});
  const [renderedCount, setRenderedCount] = useState<number>(0);
  const [isRenderingThumbnails, setIsRenderingThumbnails] = useState<boolean>(false);
  const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set());
  const [splitMode, setSplitMode] = useState<SplitMode>('extract');
  const [rangeInput, setRangeInput] = useState<string>('');
  const [rangeError, setRangeError] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingProgress, setProcessingProgress] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [result, setResult] = useState<SplitResult | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const thumbnailUrlsRef = useRef<string[]>([]);
  const abortControllerRef = useRef<{ cancelled: boolean }>({ cancelled: false });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pdfDocTaskRef = useRef<any>(null);

  const cleanupResources = useCallback(() => {
    abortControllerRef.current.cancelled = true;
    if (pdfDocTaskRef.current) {
      try {
        pdfDocTaskRef.current.destroy();
      } catch {
        // ignore
      }
      pdfDocTaskRef.current = null;
    }
    thumbnailUrlsRef.current.forEach((url) => {
      try {
        URL.revokeObjectURL(url);
      } catch {
        // ignore
      }
    });
    thumbnailUrlsRef.current = [];
  }, []);

  useEffect(() => {
    return () => {
      cleanupResources();
    };
  }, [cleanupResources]);

  useEffect(() => {
    return () => {
      if (result?.url) {
        URL.revokeObjectURL(result.url);
      }
    };
  }, [result]);

  const handleFileSelect = async (selected: File | undefined) => {
    if (!selected) return;
    if (selected.type !== 'application/pdf' && !selected.name.toLowerCase().endsWith('.pdf')) {
      setError('Please select a valid PDF document (.pdf).');
      return;
    }

    cleanupResources();
    if (result?.url) {
      URL.revokeObjectURL(result.url);
      setResult(null);
    }

    setError('');
    setRangeError('');
    setFile(selected);
    setThumbnails({});
    setRenderedCount(0);
    setIsRenderingThumbnails(true);

    const abortToken = { cancelled: false };
    abortControllerRef.current = abortToken;

    try {
      const pdfjs = await loadPdfJs();
      const arrayBuffer = await selected.arrayBuffer();
      if (abortToken.cancelled) return;

      const loadingTask = pdfjs.getDocument({ data: new Uint8Array(arrayBuffer) });
      pdfDocTaskRef.current = loadingTask;
      const pdf = await loadingTask.promise;
      if (abortToken.cancelled) return;

      const numPages = pdf.numPages;
      if (numPages <= 0) {
        throw new Error('This PDF has no pages.');
      }

      setPageCount(numPages);

      // Initially select all pages
      const initialPages = Array.from({ length: numPages }, (_, i) => i + 1);
      setSelectedPages(new Set(initialPages));
      setRangeInput(numPages === 1 ? '1' : `1-${numPages}`);

      // Sequentially render low-memory thumbnails with microtask yields
      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        if (abortToken.cancelled) break;

        try {
          const page = await pdf.getPage(pageNum);
          const unscaledViewport = page.getViewport({ scale: 1 });
          // Scale to max width 180px or max height 240px for lightweight previews
          const scale = Math.min(180 / unscaledViewport.width, 240 / unscaledViewport.height, 0.4);
          const viewport = page.getViewport({ scale: Math.max(scale, 0.15) });

          const canvas = document.createElement('canvas');
          canvas.width = Math.ceil(viewport.width);
          canvas.height = Math.ceil(viewport.height);
          const ctx = canvas.getContext('2d', { alpha: false });

          if (ctx) {
            await page.render({
              canvas,
              canvasContext: ctx,
              viewport,
              background: '#ffffff',
            }).promise;

            if (abortToken.cancelled) break;

            const blob = await new Promise<Blob | null>((resolve) =>
              canvas.toBlob(resolve, 'image/jpeg', 0.8)
            );

            if (blob && !abortToken.cancelled) {
              const url = URL.createObjectURL(blob);
              thumbnailUrlsRef.current.push(url);
              setThumbnails((prev) => ({ ...prev, [pageNum]: url }));
            }
          }
        } catch (renderErr) {
          console.warn(`Failed to render thumbnail for page ${pageNum}:`, renderErr);
        }

        setRenderedCount(pageNum);
        // Yield to browser to prevent UI lockup
        await new Promise((resolve) => setTimeout(resolve, 10));
      }
    } catch (err: unknown) {
      console.error('PDF loading error:', err);
      if (!abortToken.cancelled) {
        setFile(null);
        setPageCount(0);
        setSelectedPages(new Set());
        const errorMessage = err instanceof Error ? err.message : String(err);
        const errorName = err instanceof Error ? err.name : '';
        if (errorName === 'PasswordException' || errorMessage.toLowerCase().includes('password')) {
          setError(
            'This PDF is encrypted or password-protected. Please remove the password before splitting.'
          );
        } else {
          setError(
            'Could not read the PDF structure. The file may be corrupt or an unsupported format.'
          );
        }
      }
    } finally {
      if (!abortToken.cancelled) {
        setIsRenderingThumbnails(false);
      }
    }
  };

  const togglePage = (pageNum: number) => {
    setSelectedPages((prev) => {
      const next = new Set(prev);
      if (next.has(pageNum)) {
        next.delete(pageNum);
      } else {
        next.add(pageNum);
      }
      setRangeInput(formatPageRange(Array.from(next)));
      setRangeError('');
      return next;
    });
  };

  const selectAll = () => {
    const all = Array.from({ length: pageCount }, (_, i) => i + 1);
    setSelectedPages(new Set(all));
    setRangeInput(formatPageRange(all));
    setRangeError('');
  };

  const clearSelection = () => {
    setSelectedPages(new Set());
    setRangeInput('');
    setRangeError('');
  };

  const handleRangeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setRangeInput(val);
    if (!val.trim()) {
      setRangeError('');
      return;
    }
    const { invalidTokens, outOfRangeNumbers, hasError } = parsePageRange(val, pageCount);
    if (hasError) {
      if (outOfRangeNumbers.length > 0) {
        setRangeError(
          `Pages must be between 1 and ${pageCount}. (Out of bounds: ${outOfRangeNumbers
            .slice(0, 5)
            .join(', ')}${outOfRangeNumbers.length > 5 ? '...' : ''})`
        );
      } else if (invalidTokens.length > 0) {
        setRangeError(`Invalid range syntax: "${invalidTokens.join(', ')}"`);
      }
    } else {
      setRangeError('');
    }
  };

  const applyRangeInput = () => {
    if (!rangeInput.trim()) {
      setSelectedPages(new Set());
      setRangeError('');
      return;
    }
    const { pages, invalidTokens, outOfRangeNumbers, hasError } = parsePageRange(
      rangeInput,
      pageCount
    );
    if (hasError) {
      if (outOfRangeNumbers.length > 0) {
        setRangeError(
          `Pages must be between 1 and ${pageCount}. (Out of bounds: ${outOfRangeNumbers
            .slice(0, 5)
            .join(', ')}${outOfRangeNumbers.length > 5 ? '...' : ''})`
        );
      } else if (invalidTokens.length > 0) {
        setRangeError(`Invalid range syntax: "${invalidTokens.join(', ')}"`);
      }
      if (pages.length > 0) {
        setSelectedPages(new Set(pages));
      }
      return;
    }
    setSelectedPages(new Set(pages));
    setRangeError('');
  };

  const resetPdf = () => {
    cleanupResources();
    if (result?.url) {
      URL.revokeObjectURL(result.url);
      setResult(null);
    }
    setFile(null);
    setPageCount(0);
    setThumbnails({});
    setRenderedCount(0);
    setSelectedPages(new Set());
    setRangeInput('');
    setRangeError('');
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const processSplit = async () => {
    if (!file || selectedPages.size === 0) return;
    setIsProcessing(true);
    setError('');
    setProcessingProgress('Reading original PDF...');

    if (result?.url) {
      URL.revokeObjectURL(result.url);
      setResult(null);
    }

    const baseName = file.name.replace(/\.pdf$/i, '') || 'document';
    const sortedPages = Array.from(selectedPages).sort((a, b) => a - b);

    try {
      const fileBuffer = await file.arrayBuffer();
      const srcPdf = await PDFDocument.load(fileBuffer);

      if (splitMode === 'extract') {
        setProcessingProgress(`Extracting ${sortedPages.length} selected pages...`);
        const splitPdf = await PDFDocument.create();
        const copiedPages = await splitPdf.copyPages(
          srcPdf,
          sortedPages.map((p) => p - 1)
        );
        copiedPages.forEach((page) => splitPdf.addPage(page));

        setProcessingProgress('Building output PDF...');
        const splitPdfBytes = await splitPdf.save({ useObjectStreams: true });
        const blob = new Blob([splitPdfBytes.buffer as ArrayBuffer], {
          type: 'application/pdf',
        });
        const url = URL.createObjectURL(blob);
        const outputFilename =
          sortedPages.length === 1
            ? `${baseName}_page_${sortedPages[0]}.pdf`
            : `${baseName}_extracted.pdf`;

        setResult({
          url,
          filename: outputFilename,
          size: blob.size,
          count: sortedPages.length,
          mode: 'extract',
        });

        // Trigger direct browser download
        const a = document.createElement('a');
        a.href = url;
        a.download = outputFilename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        // splitMode === 'split-all'
        setProcessingProgress(`Preparing individual PDFs for ${sortedPages.length} pages...`);
        const zip = new JSZip();

        for (let i = 0; i < sortedPages.length; i++) {
          const pageNum = sortedPages[i];
          setProcessingProgress(
            `Generating PDF for page ${pageNum} (${i + 1}/${sortedPages.length})...`
          );
          const singlePdf = await PDFDocument.create();
          const [copiedPage] = await singlePdf.copyPages(srcPdf, [pageNum - 1]);
          singlePdf.addPage(copiedPage);
          const singleBytes = await singlePdf.save({ useObjectStreams: true });
          zip.file(`${baseName}_page_${pageNum}.pdf`, singleBytes);
        }

        setProcessingProgress('Compressing ZIP archive...');
        const zipBlob = await zip.generateAsync(
          { type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 6 } },
          (metadata) => {
            setProcessingProgress(`Packaging ZIP archive: ${metadata.percent.toFixed(0)}%...`);
          }
        );

        const url = URL.createObjectURL(zipBlob);
        const outputFilename = `${baseName}_split_pages.zip`;

        setResult({
          url,
          filename: outputFilename,
          size: zipBlob.size,
          count: sortedPages.length,
          mode: 'split-all',
        });

        // Trigger direct browser download
        const a = document.createElement('a');
        a.href = url;
        a.download = outputFilename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    } catch (err: unknown) {
      console.error('Split processing failed:', err);
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(`Failed to split PDF: ${message}. Verify that the document is valid and readable.`);
    } finally {
      setIsProcessing(false);
      setProcessingProgress('');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      void handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  if (!meta) return null;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 lg:px-8">
      {/* Back Link */}
      <Link
        href="/categories/pdf-tools"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition mb-6"
      >
        <ArrowLeft className="h-4 w-4" /> Back to PDF Tools
      </Link>

      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3 border border-emerald-500/20">
          <ShieldCheck className="h-4 w-4" /> Local Processing Only
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mb-2">
          {toolMeta.heroTitle}
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          {toolMeta.heroDescription}
        </p>
      </div>

      {/* Main Workspace Container */}
      {!file ? (
        /* Upload Area */
        <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden p-6 sm:p-10 mb-16">
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-10 sm:p-14 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 ${
              isDragging
                ? 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-500/10 scale-[1.01]'
                : 'border-indigo-300 dark:border-indigo-500/30 hover:bg-indigo-50/50 dark:hover:bg-indigo-500/5'
            }`}
          >
            <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 mb-4 shadow-sm">
              <Upload className="h-10 w-10" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Select PDF File to Split
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mb-4">
              Click to browse your device or drag and drop a PDF file here.
            </p>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-400">
              Interactive visual preview • 100% Client-side
            </span>
            <input
              type="file"
              accept="application/pdf,.pdf"
              className="hidden"
              ref={fileInputRef}
              onChange={(e) => void handleFileSelect(e.target.files?.[0])}
            />
          </div>

          {error && (
            <div
              role="alert"
              className="mt-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-sm text-red-700 dark:text-red-300 font-medium flex items-start gap-3"
            >
              <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
        </div>
      ) : (
        /* Active Interactive Workspace */
        <div className="space-y-6 mb-16">
          {/* Top Document Status & Toolbar */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-md flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 min-w-0 max-w-full sm:max-w-md">
              <div className="p-2.5 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 shrink-0">
                <FileText className="h-6 w-6" />
              </div>
              <div className="min-w-0">
                <p
                  className="text-sm font-bold text-slate-900 dark:text-white truncate"
                  title={file.name}
                >
                  {file.name}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <span>{formatBytes(file.size)}</span>
                  <span>•</span>
                  <span>{pageCount} total pages</span>
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <button
                type="button"
                onClick={selectAll}
                className="px-3.5 py-2 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                Select All
              </button>
              <button
                type="button"
                onClick={clearSelection}
                className="px-3.5 py-2 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-red-50 hover:text-red-600 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={resetPdf}
                aria-label="Remove or change PDF"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
                <span>Change File</span>
              </button>
            </div>
          </div>

          {/* Thumbnail Generation Progress Banner */}
          {isRenderingThumbnails && (
            <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Loader2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400 animate-spin shrink-0" />
                <span className="text-xs sm:text-sm font-semibold text-indigo-900 dark:text-indigo-200">
                  Rendering thumbnails: {renderedCount} of {pageCount} pages loaded...
                </span>
              </div>
              <div className="w-24 sm:w-36 h-2 bg-indigo-200 dark:bg-indigo-900 rounded-full overflow-hidden shrink-0">
                <div
                  className="h-full bg-indigo-600 dark:bg-indigo-400 transition-all duration-200"
                  style={{
                    width: `${pageCount > 0 ? (renderedCount / pageCount) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          )}

          {/* Main 2-Column Responsive Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
            {/* Left: Thumbnail Selection Grid */}
            <div className="lg:col-span-8 space-y-4">
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 shadow-xl">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      Page Thumbnails
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      Click to toggle
                    </span>
                  </div>
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    {selectedPages.size} of {pageCount} selected
                  </span>
                </div>

                {/* Thumbnails Grid Container */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 max-h-[680px] overflow-y-auto p-1 pr-2">
                  {Array.from({ length: pageCount }, (_, i) => i + 1).map((pageNum) => {
                    const isSelected = selectedPages.has(pageNum);
                    const thumbnailSrc = thumbnails[pageNum];

                    return (
                      <button
                        type="button"
                        key={pageNum}
                        onClick={() => togglePage(pageNum)}
                        aria-label={`Page ${pageNum}${isSelected ? ', selected' : ', not selected'}`}
                        className={`group relative flex flex-col rounded-xl overflow-hidden border-2 text-left transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 cursor-pointer ${
                          isSelected
                            ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30 shadow-md ring-2 ring-indigo-500/20'
                            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 hover:border-slate-400 dark:hover:border-slate-600 opacity-60 hover:opacity-100'
                        }`}
                      >
                        {/* Aspect Box for Image Preview */}
                        <div className="relative aspect-[3/4] w-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                          {thumbnailSrc ? (
                            <img
                              src={thumbnailSrc}
                              alt={`Preview of page ${pageNum}`}
                              className={`w-full h-full object-contain transition-transform duration-200 ${
                                isSelected ? 'scale-100' : 'group-hover:scale-105'
                              }`}
                              loading="lazy"
                            />
                          ) : (
                            <div className="flex flex-col items-center justify-center p-4 text-slate-400">
                              <Loader2 className="h-6 w-6 animate-spin mb-1 opacity-50" />
                              <span className="text-[10px] font-semibold">Page {pageNum}</span>
                            </div>
                          )}

                          {/* Top-Right Checkbox Badge */}
                          <div
                            className={`absolute top-2 right-2 h-6 w-6 rounded-full flex items-center justify-center transition-all ${
                              isSelected
                                ? 'bg-indigo-600 text-white shadow-sm scale-100'
                                : 'bg-white/80 dark:bg-slate-900/80 text-transparent border border-slate-300 dark:border-slate-600 group-hover:border-indigo-400 scale-90'
                            }`}
                          >
                            <Check
                              className={`h-3.5 w-3.5 stroke-[3] ${
                                isSelected ? 'opacity-100' : 'opacity-0'
                              }`}
                            />
                          </div>

                          {/* Top-Left Page Number Badge */}
                          <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-slate-900/70 text-white text-[10px] font-bold backdrop-blur-xs">
                            {pageNum}
                          </div>
                        </div>

                        {/* Bottom Label */}
                        <div className="p-2 text-center text-xs font-semibold text-slate-700 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-center">
                          <span>Page {pageNum}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right: Sticky Action & Settings Panel */}
            <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-6">
              {/* Split Mode Selector Card */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-md space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Split Mode
                </h3>
                <div className="space-y-2.5">
                  <button
                    type="button"
                    onClick={() => setSplitMode('extract')}
                    className={`w-full p-3.5 rounded-xl border-2 text-left flex items-start gap-3 transition-all cursor-pointer ${
                      splitMode === 'extract'
                        ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 dark:border-indigo-500 shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg mt-0.5 shrink-0 ${
                        splitMode === 'extract'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                      }`}
                    >
                      <Layers className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        Extract selected pages
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Combine all selected pages into one output PDF file.
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSplitMode('split-all')}
                    className={`w-full p-3.5 rounded-xl border-2 text-left flex items-start gap-3 transition-all cursor-pointer ${
                      splitMode === 'split-all'
                        ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 dark:border-indigo-500 shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg mt-0.5 shrink-0 ${
                        splitMode === 'split-all'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                      }`}
                    >
                      <Archive className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        Split into individual PDFs
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Create one separate PDF per selected page, packaged into a ZIP archive.
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Selection Helper Card */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-md space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Page Selection Helper
                  </h3>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                    {selectedPages.size} of {pageCount}
                  </span>
                </div>

                {/* Page Range Input Helper */}
                <div>
                  <label
                    htmlFor="page-range-input"
                    className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5"
                  >
                    Custom Page Range
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="page-range-input"
                      type="text"
                      value={rangeInput}
                      onChange={handleRangeInputChange}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          applyRangeInput();
                        }
                      }}
                      placeholder="e.g. 1-3, 5, 8-10"
                      className={`flex-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs font-mono outline-none transition-colors ${
                        rangeError
                          ? 'border-red-500 focus:border-red-600'
                          : 'border-slate-200 dark:border-slate-700 focus:border-indigo-500'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={applyRangeInput}
                      className="px-3.5 py-2 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold hover:bg-slate-800 dark:hover:bg-white transition-colors cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                  {rangeError ? (
                    <p
                      role="alert"
                      className="text-xs text-red-500 mt-1.5 flex items-center gap-1 font-medium"
                    >
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                      {rangeError}
                    </p>
                  ) : (
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1.5">
                      Enter single pages (e.g. 2, 4) or ranges (e.g. 1-5).
                    </p>
                  )}
                </div>
              </div>

              {/* Action / Process Button Card */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-md space-y-4">
                <button
                  type="button"
                  onClick={processSplit}
                  disabled={isProcessing || selectedPages.size === 0}
                  className="w-full py-4 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-600 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>{processingProgress || 'Processing...'}</span>
                    </>
                  ) : (
                    <>
                      <Scissors className="h-5 w-5" />
                      <span>
                        {selectedPages.size === 0
                          ? 'Select Pages to Split'
                          : splitMode === 'extract'
                          ? `Extract ${selectedPages.size} ${
                              selectedPages.size === 1 ? 'Page' : 'Pages'
                            } (PDF)`
                          : `Split into ${selectedPages.size} ${
                              selectedPages.size === 1 ? 'PDF' : 'PDFs'
                            } (ZIP)`}
                      </span>
                    </>
                  )}
                </button>

                {selectedPages.size === 0 && !isProcessing && (
                  <p className="text-xs text-center text-amber-600 dark:text-amber-400 font-medium">
                    Please select at least 1 page to split.
                  </p>
                )}

                {/* Result Notification & Re-download */}
                {result && !isProcessing && (
                  <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 space-y-3">
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                          {result.mode === 'extract'
                            ? 'PDF Extracted Successfully!'
                            : 'ZIP Archive Generated!'}
                        </p>
                        <p className="text-[11px] text-emerald-700 dark:text-emerald-300 truncate mt-0.5">
                          {result.filename} ({formatBytes(result.size)})
                        </p>
                      </div>
                    </div>
                    <a
                      href={result.url}
                      download={result.filename}
                      className="w-full py-2.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                    >
                      <Download className="h-4 w-4" /> Download Again
                    </a>
                  </div>
                )}

                {error && (
                  <div
                    role="alert"
                    className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300 font-medium flex items-start gap-2"
                  >
                    <AlertCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
