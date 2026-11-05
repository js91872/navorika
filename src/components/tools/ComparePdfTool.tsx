'use client';

import React, { useState, useEffect, useMemo, useRef, useCallback, startTransition } from 'react';
import {
  Upload,
  FileText,
  AlertCircle,
  CheckCircle2,
  Download,
  Copy,
  Printer,
  Eye,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Sparkles,
  Layers,
  ShieldCheck,
  FileDiff,
  HelpCircle,
  X,
} from 'lucide-react';
import {
  tokenizeWords,
  compareDocuments,
  computeVisualPixelDiff,
  validatePdfBuffer,
  generateTextComparisonReport,
  generateJsonComparisonReport,
  formatBytes,
  type ComparisonSummary,
  type VisualDiffResult,
} from '@/lib/calculations/pdfCompare';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

// Dynamic loader for pdfjs-dist
async function loadPdfJs() {
  const pdfjs = await import('pdfjs-dist');
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url
  ).toString();
  return pdfjs;
}

type PdfJsModule = typeof import('pdfjs-dist');
type PdfLoadingTask = ReturnType<PdfJsModule['getDocument']>;

interface LoadedDoc {
  file: File;
  name: string;
  size: number;
  arrayBuffer: ArrayBuffer;
  pageCount: number;
  pagesText: { pageNumber: number; text: string }[];
}

export default function ComparePdfTool() {
  // Document states
  const [origDoc, setOrigDoc] = useState<LoadedDoc | null>(null);
  const [revDoc, setRevDoc] = useState<LoadedDoc | null>(null);

  // Processing states
  const [loadingOrig, setLoadingOrig] = useState(false);
  const [loadingRev, setLoadingRev] = useState(false);
  const [loadingDemo, setLoadingDemo] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Comparison result
  const [currentPage, setCurrentPage] = useState<number>(1);

  const summary = useMemo<ComparisonSummary | null>(() => {
    if (!origDoc || !revDoc) return null;
    return compareDocuments(
      { name: origDoc.name, size: origDoc.size, pages: origDoc.pagesText },
      { name: revDoc.name, size: revDoc.size, pages: revDoc.pagesText }
    );
  }, [origDoc, revDoc]);

  // View modes
  const [activeTab, setActiveTab] = useState<'visual' | 'text' | 'pages'>('visual');
  const [textViewMode, setTextViewMode] = useState<'inline' | 'sideBySide'>('inline');
  const [visualViewMode, setVisualViewMode] = useState<'split' | 'overlay' | 'slider'>('split');
  const [sliderPosition, setSliderPosition] = useState<number>(50); // 0 to 100%

  // Visual diff settings
  const [sensitivity, setSensitivity] = useState<number>(25);
  const [renderScale, setRenderScale] = useState<number>(1.25);
  const [visualDiffResult, setVisualDiffResult] = useState<VisualDiffResult | null>(null);
  const [isRenderingVisual, setIsRenderingVisual] = useState<boolean>(false);

  // Feedback states
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  // Canvas references for visual comparison
  const origCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const revCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const sliderOrigCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const sliderRevCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const fileInputOrigRef = useRef<HTMLInputElement>(null);
  const fileInputRevRef = useRef<HTMLInputElement>(null);

  // Parse a PDF file locally
  const parsePdfFile = useCallback(async (file: File): Promise<LoadedDoc> => {
    const arrayBuffer = await file.arrayBuffer();
    const validation = validatePdfBuffer(arrayBuffer);
    if (!validation.valid) {
      throw new Error(validation.error || 'The file does not appear to be a valid PDF document.');
    }

    const pdfjs = await loadPdfJs();
    const loadingTask = pdfjs.getDocument({
      data: new Uint8Array(arrayBuffer),
      useSystemFonts: true,
    });

    try {
      const doc = await loadingTask.promise;
      const totalPages = doc.numPages;
      const pagesText: { pageNumber: number; text: string }[] = [];

      for (let p = 1; p <= totalPages; p++) {
        const page = await doc.getPage(p);
        const textContent = await page.getTextContent();
        const textItems = textContent.items
          .map((item: unknown) => {
            if (typeof item === 'object' && item !== null && 'str' in item) {
              const strVal = (item as { str: unknown }).str;
              return typeof strVal === 'string' ? strVal : '';
            }
            return '';
          })
          .filter(Boolean);
        pagesText.push({
          pageNumber: p,
          text: textItems.join(' ').replace(/\s+/g, ' ').trim(),
        });
      }

      return {
        file,
        name: file.name,
        size: file.size,
        arrayBuffer,
        pageCount: totalPages,
        pagesText,
      };
    } finally {
      try {
        await loadingTask.destroy();
      } catch {
        // cleanup ignore
      }
    }
  }, []);

  // Handle original file selection
  const handleSelectOrig = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoadingOrig(true);
    setErrorMessage(null);
    try {
      const doc = await parsePdfFile(file);
      setOrigDoc(doc);
      setCurrentPage(1);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load Original PDF.';
      setErrorMessage(msg);
      setOrigDoc(null);
    } finally {
      setLoadingOrig(false);
      if (fileInputOrigRef.current) fileInputOrigRef.current.value = '';
    }
  };

  // Handle revised file selection
  const handleSelectRev = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoadingRev(true);
    setErrorMessage(null);
    try {
      const doc = await parsePdfFile(file);
      setRevDoc(doc);
      setCurrentPage(1);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load Revised PDF.';
      setErrorMessage(msg);
      setRevDoc(null);
    } finally {
      setLoadingRev(false);
      if (fileInputRevRef.current) fileInputRevRef.current.value = '';
    }
  };

  // Load sample PDFs for demonstration
  const handleLoadDemo = async () => {
    setLoadingDemo(true);
    setErrorMessage(null);
    try {
      // Create Document A (Original)
      const docA = await PDFDocument.create();
      const helvetica = await docA.embedFont(StandardFonts.Helvetica);
      const helveticaBold = await docA.embedFont(StandardFonts.HelveticaBold);

      const pageA1 = docA.addPage([600, 400]);
      pageA1.drawText('SOFTWARE SERVICE LEVEL AGREEMENT (ORIGINAL)', {
        x: 50,
        y: 340,
        size: 16,
        font: helveticaBold,
        color: rgb(0.1, 0.1, 0.1),
      });
      pageA1.drawText(
        '1. UPTIME COMMITMENT: Service Provider guarantees 99.5% monthly uptime.',
        { x: 50, y: 290, size: 12, font: helvetica, color: rgb(0.2, 0.2, 0.2) }
      );
      pageA1.drawText(
        '2. RESPONSE TIME: Critical incident response time shall not exceed 4 hours.',
        { x: 50, y: 250, size: 12, font: helvetica, color: rgb(0.2, 0.2, 0.2) }
      );
      pageA1.drawText(
        '3. JURISDICTION: This contract is governed by the laws of the State of California.',
        { x: 50, y: 210, size: 12, font: helvetica, color: rgb(0.2, 0.2, 0.2) }
      );
      pageA1.drawText(
        '4. ANNUAL FEE: Client agrees to remit $25,000 per annum payable in advance.',
        { x: 50, y: 170, size: 12, font: helvetica, color: rgb(0.2, 0.2, 0.2) }
      );

      const bytesA = await docA.save();
      const fileA = new File([bytesA as unknown as BlobPart], 'Sample_Agreement_Original.pdf', {
        type: 'application/pdf',
      });

      // Create Document B (Revised: modified page 1 + added page 2)
      const docB = await PDFDocument.create();
      const bFont = await docB.embedFont(StandardFonts.Helvetica);
      const bFontBold = await docB.embedFont(StandardFonts.HelveticaBold);

      const pageB1 = docB.addPage([600, 400]);
      pageB1.drawText('SOFTWARE SERVICE LEVEL AGREEMENT (REVISED)', {
        x: 50,
        y: 340,
        size: 16,
        font: bFontBold,
        color: rgb(0.1, 0.1, 0.1),
      });
      pageB1.drawText(
        '1. UPTIME COMMITMENT: Service Provider guarantees 99.9% monthly uptime.',
        { x: 50, y: 290, size: 12, font: bFont, color: rgb(0.2, 0.2, 0.2) }
      );
      pageB1.drawText(
        '2. RESPONSE TIME: Critical incident response time shall not exceed 1 hour.',
        { x: 50, y: 250, size: 12, font: bFont, color: rgb(0.2, 0.2, 0.2) }
      );
      pageB1.drawText(
        '3. JURISDICTION: This contract is governed by the laws of the State of Delaware.',
        { x: 50, y: 210, size: 12, font: bFont, color: rgb(0.2, 0.2, 0.2) }
      );
      pageB1.drawText(
        '4. ANNUAL FEE: Client agrees to remit $28,500 per annum with priority support.',
        { x: 50, y: 170, size: 12, font: bFont, color: rgb(0.2, 0.2, 0.2) }
      );

      // Added Page 2 in Document B
      const pageB2 = docB.addPage([600, 400]);
      pageB2.drawText('SCHEDULE A: CYBERSECURITY & COMPLIANCE REQUIREMENTS', {
        x: 50,
        y: 340,
        size: 14,
        font: bFontBold,
        color: rgb(0.1, 0.1, 0.1),
      });
      pageB2.drawText(
        'A. Provider shall maintain SOC 2 Type II and ISO 27001 certifications.',
        { x: 50, y: 290, size: 12, font: bFont, color: rgb(0.2, 0.2, 0.2) }
      );
      pageB2.drawText(
        'B. Penetration testing reports shall be delivered annually upon written request.',
        { x: 50, y: 250, size: 12, font: bFont, color: rgb(0.2, 0.2, 0.2) }
      );

      const bytesB = await docB.save();
      const fileB = new File([bytesB as unknown as BlobPart], 'Sample_Agreement_Revised.pdf', {
        type: 'application/pdf',
      });

      const parsedA = await parsePdfFile(fileA);
      const parsedB = await parsePdfFile(fileB);

      setOrigDoc(parsedA);
      setRevDoc(parsedB);
      setCurrentPage(1);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Could not initialize sample PDFs.';
      setErrorMessage(msg);
    } finally {
      setLoadingDemo(false);
    }
  };

  // Render Visual Comparison Canvases
  const renderVisualPage = useCallback(async () => {
    if (!origDoc || !revDoc || !summary) return;

    setIsRenderingVisual(true);
    setVisualDiffResult(null);

    let origTask: PdfLoadingTask | null = null;
    let revTask: PdfLoadingTask | null = null;

    try {
      const pdfjs = await loadPdfJs();

      const pageNum = currentPage;

      const origCanvas = origCanvasRef.current;
      const revCanvas = revCanvasRef.current;
      const overlayCanvas = overlayCanvasRef.current;
      const sOrigCanvas = sliderOrigCanvasRef.current;
      const sRevCanvas = sliderRevCanvasRef.current;

      const hasOrigPage = pageNum <= origDoc.pageCount;
      const hasRevPage = pageNum <= revDoc.pageCount;

      let origImgData: ImageData | null = null;
      let revImgData: ImageData | null = null;
      let targetWidth = 600;
      let targetHeight = 800;

      // 1. Render Original Page
      if (hasOrigPage) {
        origTask = pdfjs.getDocument({
          data: new Uint8Array(origDoc.arrayBuffer),
          useSystemFonts: true,
        });
        const doc = await origTask.promise;
        const page = await doc.getPage(pageNum);
        const viewport = page.getViewport({ scale: renderScale });
        targetWidth = Math.ceil(viewport.width);
        targetHeight = Math.ceil(viewport.height);

        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = targetWidth;
        tempCanvas.height = targetHeight;
        const ctx = tempCanvas.getContext('2d', { alpha: false });
        if (ctx) {
          await page.render({ canvas: tempCanvas, canvasContext: ctx, viewport, background: '#ffffff' }).promise;
          origImgData = ctx.getImageData(0, 0, targetWidth, targetHeight);
        }
      }

      // 2. Render Revised Page
      if (hasRevPage) {
        revTask = pdfjs.getDocument({
          data: new Uint8Array(revDoc.arrayBuffer),
          useSystemFonts: true,
        });
        const doc = await revTask.promise;
        const page = await doc.getPage(pageNum);
        const viewport = page.getViewport({ scale: renderScale });
        targetWidth = Math.max(targetWidth, Math.ceil(viewport.width));
        targetHeight = Math.max(targetHeight, Math.ceil(viewport.height));

        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = targetWidth;
        tempCanvas.height = targetHeight;
        const ctx = tempCanvas.getContext('2d', { alpha: false });
        if (ctx) {
          await page.render({ canvas: tempCanvas, canvasContext: ctx, viewport, background: '#ffffff' }).promise;
          revImgData = ctx.getImageData(0, 0, targetWidth, targetHeight);
        }
      }

      // If one page doesn't exist, create a blank white canvas
      if (!origImgData) {
        const blank = document.createElement('canvas');
        blank.width = targetWidth;
        blank.height = targetHeight;
        const ctx = blank.getContext('2d', { alpha: false });
        if (ctx) {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, targetWidth, targetHeight);
          ctx.fillStyle = '#94a3b8';
          ctx.font = 'bold 18px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('(Page Not in Original PDF)', targetWidth / 2, targetHeight / 2);
          origImgData = ctx.getImageData(0, 0, targetWidth, targetHeight);
        }
      }

      if (!revImgData) {
        const blank = document.createElement('canvas');
        blank.width = targetWidth;
        blank.height = targetHeight;
        const ctx = blank.getContext('2d', { alpha: false });
        if (ctx) {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, targetWidth, targetHeight);
          ctx.fillStyle = '#94a3b8';
          ctx.font = 'bold 18px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('(Page Deleted from Revised PDF)', targetWidth / 2, targetHeight / 2);
          revImgData = ctx.getImageData(0, 0, targetWidth, targetHeight);
        }
      }

      if (!origImgData || !revImgData) return;

      // Normalize dimensions if they differ slightly
      if (origImgData.width !== revImgData.width || origImgData.height !== revImgData.height) {
        const commonW = Math.max(origImgData.width, revImgData.width);
        const commonH = Math.max(origImgData.height, revImgData.height);

        const padCanvas = (data: ImageData) => {
          const c = document.createElement('canvas');
          c.width = commonW;
          c.height = commonH;
          const ctx = c.getContext('2d', { alpha: false })!;
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, commonW, commonH);
          const temp = document.createElement('canvas');
          temp.width = data.width;
          temp.height = data.height;
          temp.getContext('2d')!.putImageData(data, 0, 0);
          ctx.drawImage(temp, 0, 0);
          return ctx.getImageData(0, 0, commonW, commonH);
        };

        origImgData = padCanvas(origImgData);
        revImgData = padCanvas(revImgData);
        targetWidth = commonW;
        targetHeight = commonH;
      }

      // Compute pixel diff
      const diffOutput = computeVisualPixelDiff(
        origImgData.data,
        revImgData.data,
        targetWidth,
        targetHeight,
        { sensitivityThreshold: sensitivity }
      );
      setVisualDiffResult(diffOutput.result);

      // Render onto target canvases
      if (origCanvas) {
        origCanvas.width = targetWidth;
        origCanvas.height = targetHeight;
        origCanvas.getContext('2d')?.putImageData(origImgData, 0, 0);
      }
      if (revCanvas) {
        revCanvas.width = targetWidth;
        revCanvas.height = targetHeight;
        revCanvas.getContext('2d')?.putImageData(revImgData, 0, 0);
      }

      // Overlay canvas
      if (overlayCanvas && diffOutput.diffImageData) {
        overlayCanvas.width = targetWidth;
        overlayCanvas.height = targetHeight;
        const oCtx = overlayCanvas.getContext('2d');
        if (oCtx) {
          const imgData = oCtx.createImageData(targetWidth, targetHeight);
          imgData.data.set(diffOutput.diffImageData);
          oCtx.putImageData(imgData, 0, 0);

          // Draw highlight bounding boxes around changed regions
          oCtx.strokeStyle = '#e5322d';
          oCtx.lineWidth = 2;
          for (const box of diffOutput.result.boundingBoxes) {
            oCtx.strokeRect(box.x, box.y, box.width, box.height);
          }
        }
      }

      // Slider canvases
      if (sOrigCanvas) {
        sOrigCanvas.width = targetWidth;
        sOrigCanvas.height = targetHeight;
        sOrigCanvas.getContext('2d')?.putImageData(origImgData, 0, 0);
      }
      if (sRevCanvas) {
        sRevCanvas.width = targetWidth;
        sRevCanvas.height = targetHeight;
        sRevCanvas.getContext('2d')?.putImageData(revImgData, 0, 0);
      }
    } catch {
      // Visual render error handled gracefully
    } finally {
      setIsRenderingVisual(false);
      try {
        if (origTask) await origTask.destroy();
        if (revTask) await revTask.destroy();
      } catch {
        // cleanup ignore
      }
    }
  }, [origDoc, revDoc, summary, currentPage, sensitivity, renderScale]);

  // Trigger visual rendering whenever active tab is visual, or page/settings change
  useEffect(() => {
    let active = true;
    if (activeTab === 'visual' && summary) {
      const handle = requestAnimationFrame(() => {
        if (active) {
          startTransition(() => {
            void renderVisualPage();
          });
        }
      });
      return () => {
        active = false;
        cancelAnimationFrame(handle);
      };
    }
  }, [activeTab, summary, currentPage, sensitivity, renderScale, renderVisualPage]);

  // Jump to next modified/added/removed page
  const handleNextChange = () => {
    if (!summary) return;
    const nextChanged = summary.pages.find(
      (p) => p.pageNumber > currentPage && p.status !== 'identical'
    );
    if (nextChanged) {
      setCurrentPage(nextChanged.pageNumber);
    } else {
      // Loop around
      const firstChanged = summary.pages.find((p) => p.status !== 'identical');
      if (firstChanged) setCurrentPage(firstChanged.pageNumber);
    }
  };

  const handlePrevChange = () => {
    if (!summary) return;
    const prevChanged = [...summary.pages]
      .reverse()
      .find((p) => p.pageNumber < currentPage && p.status !== 'identical');
    if (prevChanged) {
      setCurrentPage(prevChanged.pageNumber);
    } else {
      // Loop around to end
      const lastChanged = [...summary.pages]
        .reverse()
        .find((p) => p.status !== 'identical');
      if (lastChanged) setCurrentPage(lastChanged.pageNumber);
    }
  };

  // Download Text Report
  const handleDownloadTextReport = () => {
    if (!summary) return;
    const text = generateTextComparisonReport(summary);
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `pdf_comparison_${summary.origFileName.replace(/\.pdf$/i, '')}_vs_${summary.revFileName.replace(/\.pdf$/i, '')}.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  // Download JSON Report
  const handleDownloadJsonReport = () => {
    if (!summary) return;
    const json = generateJsonComparisonReport(summary);
    const blob = new Blob([json], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `pdf_comparison_${summary.origFileName.replace(/\.pdf$/i, '')}_vs_${summary.revFileName.replace(/\.pdf$/i, '')}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  // Copy Summary to clipboard
  const handleCopySummary = async () => {
    if (!summary) return;
    const text = generateTextComparisonReport(summary);
    try {
      await navigator.clipboard.writeText(text);
      setCopyFeedback('Comparison summary copied to clipboard!');
      setTimeout(() => setCopyFeedback(null), 3000);
    } catch {
      setCopyFeedback('Failed to copy summary to clipboard.');
      setTimeout(() => setCopyFeedback(null), 3000);
    }
  };

  // Print view
  const handlePrint = () => {
    window.print();
  };

  const currentPageInfo = summary?.pages.find((p) => p.pageNumber === currentPage);

  return (
    <div className="space-y-8">
      {/* Optional demo action remains available before uploading, without a large notice. */}
      <div className="flex justify-end">
        {!origDoc && !revDoc && (
          <button
            type="button"
            onClick={handleLoadDemo}
            disabled={loadingDemo}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 transition active:scale-95 disabled:opacity-50 shrink-0"
          >
            {loadingDemo ? (
              <RefreshCw className="size-3.5 animate-spin" />
            ) : (
              <Sparkles className="size-3.5" />
            )}
            Load Sample PDFs
          </button>
        )}
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="rounded-xl border border-red-500/30 bg-red-50 p-4 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-950/20 dark:text-red-400 flex items-start gap-3">
          <AlertCircle className="size-5 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold">Document Processing Error</p>
            <p className="mt-1">{errorMessage}</p>
          </div>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="text-red-500 hover:text-red-700"
            aria-label="Dismiss error"
          >
            <X className="size-4" />
          </button>
        </div>
      )}

      {/* Upload Dual Dropzones */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Original PDF Card */}
        <div
          className={`relative rounded-2xl border-2 p-6 transition-all ${
            origDoc
              ? 'border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900/60 shadow-sm'
              : 'border-dashed border-zinc-300 dark:border-zinc-700 hover:border-[#e5322d] dark:hover:border-[#e5322d] bg-zinc-50/50 dark:bg-zinc-900/20'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Baseline Document
            </span>
            {origDoc && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 dark:bg-emerald-950/50 px-2.5 py-0.5 text-xs font-medium text-emerald-800 dark:text-emerald-300">
                <CheckCircle2 className="size-3" /> Ready
              </span>
            )}
          </div>
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
            1. Original PDF
          </h2>

          {origDoc ? (
            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-zinc-100 dark:bg-zinc-800/60">
                <FileText className="size-6 text-[#e5322d] shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-zinc-900 dark:text-white">
                    {origDoc.name}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {formatBytes(origDoc.size)} • {origDoc.pageCount} page{origDoc.pageCount === 1 ? '' : 's'}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => fileInputOrigRef.current?.click()}
                  className="flex-1 text-xs font-medium py-1.5 px-3 rounded-lg border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                >
                  Change File
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setOrigDoc(null);
                    setCurrentPage(1);
                  }}
                  className="text-xs font-medium py-1.5 px-3 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/40 dark:hover:bg-red-950/20 transition"
                >
                  Clear
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-4">
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                Select or drag the earlier revision, draft, or base contract.
              </p>
              <input
                ref={fileInputOrigRef}
                type="file"
                accept="application/pdf"
                onChange={handleSelectOrig}
                className="hidden"
                id="original-pdf-upload"
              />
              <button
                type="button"
                onClick={() => fileInputOrigRef.current?.click()}
                disabled={loadingOrig}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 py-3 px-4 text-sm font-semibold shadow hover:bg-zinc-800 dark:hover:bg-zinc-100 transition active:scale-[0.99] disabled:opacity-50"
              >
                {loadingOrig ? (
                  <RefreshCw className="size-4 animate-spin" />
                ) : (
                  <Upload className="size-4" />
                )}
                {loadingOrig ? 'Parsing Original...' : 'Upload Original PDF'}
              </button>
            </div>
          )}
        </div>

        {/* Revised PDF Card */}
        <div
          className={`relative rounded-2xl border-2 p-6 transition-all ${
            revDoc
              ? 'border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900/60 shadow-sm'
              : 'border-dashed border-zinc-300 dark:border-zinc-700 hover:border-[#e5322d] dark:hover:border-[#e5322d] bg-zinc-50/50 dark:bg-zinc-900/20'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Updated Document
            </span>
            {revDoc && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 dark:bg-emerald-950/50 px-2.5 py-0.5 text-xs font-medium text-emerald-800 dark:text-emerald-300">
                <CheckCircle2 className="size-3" /> Ready
              </span>
            )}
          </div>
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
            2. Revised PDF
          </h2>

          {revDoc ? (
            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-zinc-100 dark:bg-zinc-800/60">
                <FileText className="size-6 text-[#e5322d] shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-zinc-900 dark:text-white">
                    {revDoc.name}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {formatBytes(revDoc.size)} • {revDoc.pageCount} page{revDoc.pageCount === 1 ? '' : 's'}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRevRef.current?.click()}
                  className="flex-1 text-xs font-medium py-1.5 px-3 rounded-lg border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                >
                  Change File
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRevDoc(null);
                    setCurrentPage(1);
                  }}
                  className="text-xs font-medium py-1.5 px-3 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/40 dark:hover:bg-red-950/20 transition"
                >
                  Clear
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-4">
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                Select or drag the new draft, final proof, or supplier update.
              </p>
              <input
                ref={fileInputRevRef}
                type="file"
                accept="application/pdf"
                onChange={handleSelectRev}
                className="hidden"
                id="revised-pdf-upload"
              />
              <button
                type="button"
                onClick={() => fileInputRevRef.current?.click()}
                disabled={loadingRev}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 py-3 px-4 text-sm font-semibold shadow hover:bg-zinc-800 dark:hover:bg-zinc-100 transition active:scale-[0.99] disabled:opacity-50"
              >
                {loadingRev ? (
                  <RefreshCw className="size-4 animate-spin" />
                ) : (
                  <Upload className="size-4" />
                )}
                {loadingRev ? 'Parsing Revised...' : 'Upload Revised PDF'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Comparison Results Section */}
      {summary && (
        <div className="space-y-6 pt-4">
          {/* Summary Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-4">
              <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Similarity</p>
              <p className="mt-1 text-2xl font-black text-zinc-900 dark:text-white">
                {summary.overallSimilarityPercent}%
              </p>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">text agreement</p>
            </div>

            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-4">
              <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Words Added</p>
              <p className="mt-1 text-2xl font-black text-emerald-600 dark:text-emerald-400">
                +{summary.totalWordsAdded}
              </p>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">new tokens</p>
            </div>

            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-4">
              <p className="text-xs font-semibold text-red-600 dark:text-red-400">Words Removed</p>
              <p className="mt-1 text-2xl font-black text-red-600 dark:text-red-400">
                -{summary.totalWordsRemoved}
              </p>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">deleted tokens</p>
            </div>

            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-4">
              <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Changed Pages</p>
              <p className="mt-1 text-2xl font-black text-amber-600 dark:text-amber-400">
                {summary.modifiedPages + summary.addedPages + summary.removedPages}
              </p>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">of {summary.totalPages} total</p>
            </div>

            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-4">
              <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Added Pages</p>
              <p className="mt-1 text-2xl font-black text-blue-600 dark:text-blue-400">
                +{summary.addedPages}
              </p>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">inserted pages</p>
            </div>

            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-4">
              <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Removed Pages</p>
              <p className="mt-1 text-2xl font-black text-purple-600 dark:text-purple-400">
                -{summary.removedPages}
              </p>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">deleted pages</p>
            </div>
          </div>

          {/* Scanned PDF Honest Disclosure if applicable */}
          {summary.scannedPages > 0 && (
            <div className="rounded-xl border border-amber-300 dark:border-amber-800/60 bg-amber-50/70 dark:bg-amber-950/20 p-4 flex items-start gap-3">
              <HelpCircle className="size-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm text-amber-900 dark:text-amber-200">
                <p className="font-bold">Image-Only Scan Detected on {summary.scannedPages} Page(s)</p>
                <p className="mt-1 text-amber-800 dark:text-amber-300">
                  One or more pages contain no selectable digital text layer. Visual pixel comparison functions accurately to highlight visual layout shifts, but word-level diffing requires Optical Character Recognition (OCR), which is not bundled locally. No file content is sent to any server.
                </p>
              </div>
            </div>
          )}

          {/* Action Toolbar & Navigation */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-y border-zinc-200 dark:border-zinc-800 py-3">
            {/* View Mode Switcher */}
            <div className="inline-flex rounded-lg bg-zinc-100 dark:bg-zinc-800/80 p-1">
              <button
                type="button"
                onClick={() => setActiveTab('visual')}
                className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                  activeTab === 'visual'
                    ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-sm'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                <Eye className="size-3.5" /> Visual Comparison
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('text')}
                className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                  activeTab === 'text'
                    ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-sm'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                <FileDiff className="size-3.5" /> Text Diff
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('pages')}
                className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                  activeTab === 'pages'
                    ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-sm'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                <Layers className="size-3.5" /> Page Matrix ({summary.totalPages})
              </button>
            </div>

            {/* Changed Page Navigator */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrevChange}
                className="inline-flex items-center gap-1 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-2.5 py-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition"
                title="Jump to previous changed page"
              >
                <ChevronLeft className="size-3.5" /> Prev Change
              </button>

              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                Page {currentPage} of {summary.totalPages}
              </span>

              <button
                type="button"
                onClick={handleNextChange}
                className="inline-flex items-center gap-1 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-2.5 py-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition"
                title="Jump to next changed page"
              >
                Next Change <ChevronRight className="size-3.5" />
              </button>
            </div>

            {/* Export & Report Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={handleDownloadTextReport}
                className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition"
              >
                <Download className="size-3.5" /> TXT Report
              </button>
              <button
                type="button"
                onClick={handleDownloadJsonReport}
                className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition"
              >
                <Download className="size-3.5" /> JSON Data
              </button>
              <button
                type="button"
                onClick={handleCopySummary}
                className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition"
              >
                <Copy className="size-3.5" /> Copy
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition"
              >
                <Printer className="size-3.5" /> Print
              </button>
            </div>
          </div>

          {copyFeedback && (
            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 text-right">
              {copyFeedback}
            </p>
          )}

          {/* Current Page Status Pill */}
          {currentPageInfo && (
            <div className="flex items-center justify-between bg-zinc-100/70 dark:bg-zinc-800/40 rounded-xl px-4 py-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-zinc-700 dark:text-zinc-300">
                  Page {currentPageInfo.pageNumber} Status:
                </span>
                <span
                  className={`px-2 py-0.5 rounded-md font-bold uppercase tracking-wider text-[10px] ${
                    currentPageInfo.status === 'identical'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                      : currentPageInfo.status === 'added'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                      : currentPageInfo.status === 'removed'
                      ? 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300'
                      : currentPageInfo.status === 'scanned'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                      : 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300'
                  }`}
                >
                  {currentPageInfo.status}
                </span>
              </div>
              <div className="flex items-center gap-4 text-zinc-500 dark:text-zinc-400">
                <span>Text Similarity: {currentPageInfo.similarityPercent}%</span>
                <span>+{currentPageInfo.wordsAdded} / -{currentPageInfo.wordsRemoved} words</span>
                {visualDiffResult && (
                  <span>Visual Difference: {visualDiffResult.diffPercentage}%</span>
                )}
              </div>
            </div>
          )}

          {/* TAB 1: VISUAL COMPARISON */}
          {activeTab === 'visual' && (
            <div className="space-y-4">
              {/* Visual Controls Sub-bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-3 bg-zinc-50 dark:bg-zinc-900/40 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs">
                {/* Visual View Mode */}
                <div className="inline-flex rounded-lg bg-zinc-200/80 dark:bg-zinc-800 p-0.5">
                  <button
                    type="button"
                    onClick={() => setVisualViewMode('split')}
                    className={`px-2.5 py-1 rounded font-medium ${
                      visualViewMode === 'split'
                        ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-sm'
                        : 'text-zinc-600 dark:text-zinc-400'
                    }`}
                  >
                    Side by Side
                  </button>
                  <button
                    type="button"
                    onClick={() => setVisualViewMode('overlay')}
                    className={`px-2.5 py-1 rounded font-medium ${
                      visualViewMode === 'overlay'
                        ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-sm'
                        : 'text-zinc-600 dark:text-zinc-400'
                    }`}
                  >
                    Diff Heatmap
                  </button>
                  <button
                    type="button"
                    onClick={() => setVisualViewMode('slider')}
                    className={`px-2.5 py-1 rounded font-medium ${
                      visualViewMode === 'slider'
                        ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-sm'
                        : 'text-zinc-600 dark:text-zinc-400'
                    }`}
                  >
                    Swipe Curtain
                  </button>
                </div>

                {/* Sensitivity Slider */}
                <div className="flex items-center gap-2">
                  <span className="font-medium text-zinc-600 dark:text-zinc-400">
                    Sensitivity:
                  </span>
                  <input
                    type="range"
                    min="5"
                    max="60"
                    step="5"
                    value={sensitivity}
                    onChange={(e) => setSensitivity(Number(e.target.value))}
                    className="w-24 accent-[#e5322d]"
                  />
                  <span className="w-8 font-mono text-zinc-700 dark:text-zinc-300">
                    {sensitivity}
                  </span>
                </div>

                {/* Scale selection */}
                <div className="flex items-center gap-2">
                  <span className="font-medium text-zinc-600 dark:text-zinc-400">Zoom:</span>
                  <select
                    value={renderScale}
                    onChange={(e) => setRenderScale(Number(e.target.value))}
                    className="rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-2 py-0.5 text-xs text-zinc-800 dark:text-zinc-200"
                  >
                    <option value={1.0}>100%</option>
                    <option value={1.25}>125%</option>
                    <option value={1.5}>150%</option>
                  </select>
                </div>
              </div>

              {isRenderingVisual && (
                <div className="p-8 text-center text-sm font-medium text-zinc-500 dark:text-zinc-400 flex items-center justify-center gap-2">
                  <RefreshCw className="size-4 animate-spin" /> Rendering page {currentPage} at {Math.round(renderScale * 100)}% resolution...
                </div>
              )}

              {/* View 1: Side by Side Dual Canvas */}
              {visualViewMode === 'split' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-3 shadow-sm">
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">
                      Original: Page {currentPage}
                    </p>
                    <div className="overflow-auto max-h-[700px] border border-zinc-100 dark:border-zinc-800/80 rounded-lg flex justify-center bg-zinc-100 dark:bg-zinc-950 p-2">
                      <canvas ref={origCanvasRef} className="max-w-full h-auto shadow-md rounded" />
                    </div>
                  </div>

                  <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-3 shadow-sm">
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">
                      Revised: Page {currentPage}
                    </p>
                    <div className="overflow-auto max-h-[700px] border border-zinc-100 dark:border-zinc-800/80 rounded-lg flex justify-center bg-zinc-100 dark:bg-zinc-950 p-2">
                      <canvas ref={revCanvasRef} className="max-w-full h-auto shadow-md rounded" />
                    </div>
                  </div>
                </div>
              )}

              {/* View 2: Diff Heatmap Overlay */}
              {visualViewMode === 'overlay' && (
                <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                      Pixel Difference Overlay (Red = Visual Shift)
                    </p>
                    {visualDiffResult && (
                      <span className="text-xs font-semibold text-[#e5322d]">
                        {visualDiffResult.diffPixelCount.toLocaleString()} changed pixels ({visualDiffResult.diffPercentage}%)
                      </span>
                    )}
                  </div>
                  <div className="overflow-auto max-h-[750px] border border-zinc-100 dark:border-zinc-800/80 rounded-lg flex justify-center bg-zinc-950 p-4">
                    <canvas ref={overlayCanvasRef} className="max-w-full h-auto shadow-lg rounded" />
                  </div>
                </div>
              )}

              {/* View 3: Swipe Curtain Slider */}
              {visualViewMode === 'slider' && (
                <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                      Interactive Before / After Curtain
                    </p>
                    <span className="text-xs text-zinc-500">
                      Drag slider: {sliderPosition}%
                    </span>
                  </div>
                  <div className="mb-4">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={sliderPosition}
                      onChange={(e) => setSliderPosition(Number(e.target.value))}
                      className="w-full accent-[#e5322d]"
                      aria-label="Before after comparison divider"
                    />
                  </div>
                  <div className="overflow-auto max-h-[750px] flex justify-center bg-zinc-100 dark:bg-zinc-950 p-4 rounded-lg">
                    <div className="relative inline-block overflow-hidden shadow-lg rounded">
                      {/* Under layer: Revised */}
                      <canvas ref={sliderRevCanvasRef} className="block max-w-full h-auto" />
                      {/* Over layer: Original clipped by slider */}
                      <div
                        className="absolute inset-0 overflow-hidden border-r-2 border-[#e5322d]"
                        style={{ width: `${sliderPosition}%` }}
                      >
                        <canvas ref={sliderOrigCanvasRef} className="block max-w-none h-full" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: TEXT COMPARISON */}
          {activeTab === 'text' && (
            <div className="space-y-4">
              {/* Text Controls Sub-bar */}
              <div className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-900/40 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs">
                <div className="inline-flex rounded-lg bg-zinc-200/80 dark:bg-zinc-800 p-0.5">
                  <button
                    type="button"
                    onClick={() => setTextViewMode('inline')}
                    className={`px-3 py-1 rounded font-medium ${
                      textViewMode === 'inline'
                        ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-sm'
                        : 'text-zinc-600 dark:text-zinc-400'
                    }`}
                  >
                    Inline Redline
                  </button>
                  <button
                    type="button"
                    onClick={() => setTextViewMode('sideBySide')}
                    className={`px-3 py-1 rounded font-medium ${
                      textViewMode === 'sideBySide'
                        ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-sm'
                        : 'text-zinc-600 dark:text-zinc-400'
                    }`}
                  >
                    Side by Side Columns
                  </button>
                </div>

                <div className="flex items-center gap-4 text-xs font-medium">
                  <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                    <span className="size-2.5 rounded-full bg-emerald-500" /> Inserted / Added
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-red-600 dark:text-red-400">
                    <span className="size-2.5 rounded-full bg-red-500" /> Removed / Deleted
                  </span>
                </div>
              </div>

              {/* Text Diff Content */}
              {currentPageInfo && (
                <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm">
                  {currentPageInfo.isOrigScanned && currentPageInfo.isRevScanned ? (
                    <div className="p-8 text-center text-zinc-500 dark:text-zinc-400">
                      <HelpCircle className="size-8 mx-auto mb-2 text-amber-500" />
                      <p className="font-semibold text-zinc-800 dark:text-zinc-200">
                        No Selectable Text Found on Page {currentPage}
                      </p>
                      <p className="text-xs mt-1 max-w-md mx-auto">
                        This page appears to be a scanned image or vector drawing without an embedded text stream. Switch to the Visual Comparison tab to view pixel differences.
                      </p>
                    </div>
                  ) : textViewMode === 'inline' ? (
                    <div className="font-mono text-sm leading-relaxed p-4 bg-zinc-50 dark:bg-zinc-950/60 rounded-lg whitespace-pre-wrap break-words">
                      {currentPageInfo.diffTokens.length === 0 ? (
                        <span className="text-zinc-400 italic">No text content on this page.</span>
                      ) : (
                        currentPageInfo.diffTokens.map((token, idx) => {
                          if (token.type === 'insert') {
                            return (
                              <ins
                                key={idx}
                                className="bg-emerald-100 text-emerald-900 dark:bg-emerald-950/80 dark:text-emerald-200 px-1 py-0.5 rounded no-underline font-semibold"
                              >
                                {token.value}{' '}
                              </ins>
                            );
                          }
                          if (token.type === 'delete') {
                            return (
                              <del
                                key={idx}
                                className="bg-red-100 text-red-900 dark:bg-red-950/80 dark:text-red-200 px-1 py-0.5 rounded line-through text-opacity-80"
                              >
                                {token.value}{' '}
                              </del>
                            );
                          }
                          return <span key={idx}>{token.value} </span>;
                        })
                      )}
                    </div>
                  ) : (
                    /* Side-by-Side Text Columns */
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-sm">
                      <div className="p-4 bg-zinc-50 dark:bg-zinc-950/60 rounded-lg border border-zinc-200 dark:border-zinc-800/80">
                        <div className="flex items-center justify-between pb-2 mb-3 border-b border-zinc-200 dark:border-zinc-800 text-xs font-bold text-zinc-500">
                          <span>ORIGINAL (PAGE {currentPage})</span>
                          <span>{tokenizeWords(currentPageInfo.origText).length} words</span>
                        </div>
                        <div className="whitespace-pre-wrap break-words leading-relaxed">
                          {currentPageInfo.origText ? (
                            currentPageInfo.diffTokens
                              .filter((t) => t.type !== 'insert')
                              .map((token, idx) => (
                                <span
                                  key={idx}
                                  className={
                                    token.type === 'delete'
                                      ? 'bg-red-100 text-red-900 dark:bg-red-950/80 dark:text-red-200 px-1 py-0.5 rounded'
                                      : ''
                                  }
                                >
                                  {token.value}{' '}
                                </span>
                              ))
                          ) : (
                            <span className="text-zinc-400 italic">Page does not exist in Original PDF.</span>
                          )}
                        </div>
                      </div>

                      <div className="p-4 bg-zinc-50 dark:bg-zinc-950/60 rounded-lg border border-zinc-200 dark:border-zinc-800/80">
                        <div className="flex items-center justify-between pb-2 mb-3 border-b border-zinc-200 dark:border-zinc-800 text-xs font-bold text-zinc-500">
                          <span>REVISED (PAGE {currentPage})</span>
                          <span>{tokenizeWords(currentPageInfo.revText).length} words</span>
                        </div>
                        <div className="whitespace-pre-wrap break-words leading-relaxed">
                          {currentPageInfo.revText ? (
                            currentPageInfo.diffTokens
                              .filter((t) => t.type !== 'delete')
                              .map((token, idx) => (
                                <span
                                  key={idx}
                                  className={
                                    token.type === 'insert'
                                      ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950/80 dark:text-emerald-200 px-1 py-0.5 rounded font-semibold'
                                      : ''
                                  }
                                >
                                  {token.value}{' '}
                                </span>
                              ))
                          ) : (
                            <span className="text-zinc-400 italic">Page removed in Revised PDF.</span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PAGE MATRIX */}
          {activeTab === 'pages' && (
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500 mb-4">
                Full Document Page-by-Page Status Matrix
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {summary.pages.map((p) => (
                  <button
                    key={p.pageNumber}
                    type="button"
                    onClick={() => {
                      setCurrentPage(p.pageNumber);
                      setActiveTab('visual');
                    }}
                    className={`p-3 rounded-xl border text-left transition hover:scale-[1.02] ${
                      currentPage === p.pageNumber
                        ? 'ring-2 ring-[#e5322d] border-[#e5322d]'
                        : 'border-zinc-200 dark:border-zinc-800'
                    } ${
                      p.status === 'identical'
                        ? 'bg-emerald-50/40 dark:bg-emerald-950/10'
                        : p.status === 'added'
                        ? 'bg-blue-50/40 dark:bg-blue-950/10'
                        : p.status === 'removed'
                        ? 'bg-purple-50/40 dark:bg-purple-950/10'
                        : p.status === 'scanned'
                        ? 'bg-amber-50/40 dark:bg-amber-950/10'
                        : 'bg-red-50/40 dark:bg-red-950/10'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-sm text-zinc-900 dark:text-white">
                        Page {p.pageNumber}
                      </span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                          p.status === 'identical'
                            ? 'text-emerald-700 bg-emerald-100 dark:text-emerald-300 dark:bg-emerald-950'
                            : p.status === 'added'
                            ? 'text-blue-700 bg-blue-100 dark:text-blue-300 dark:bg-blue-950'
                            : p.status === 'removed'
                            ? 'text-purple-700 bg-purple-100 dark:text-purple-300 dark:bg-purple-950'
                            : p.status === 'scanned'
                            ? 'text-amber-700 bg-amber-100 dark:text-amber-300 dark:bg-amber-950'
                            : 'text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-950'
                        }`}
                      >
                        {p.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                      {p.status === 'identical'
                        ? 'No changes'
                        : p.status === 'added'
                        ? `+${p.wordsAdded} words`
                        : p.status === 'removed'
                        ? `-${p.wordsRemoved} words`
                        : `+${p.wordsAdded} / -${p.wordsRemoved}`}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      <div className="mt-8 flex items-start gap-3 rounded-xl border border-emerald-500/30 bg-emerald-50/60 p-4 dark:border-emerald-500/20 dark:bg-emerald-950/20" aria-label="PDF comparison privacy information">
        <ShieldCheck className="size-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
        <p className="text-sm font-medium text-emerald-900 dark:text-emerald-200">
          <strong>Client-side privacy:</strong> Both PDF files are parsed and compared entirely in your browser. No document pages or text are uploaded to Navorika.
        </p>
      </div>
    </div>
  );
}
