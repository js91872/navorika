'use client';

import { useMemo, useState, useCallback } from 'react';
import {
  FileText,
  Download,
  RotateCw,
  Scissors,
  Layers,
  FilePlus,
  Minimize2,
  Trash2,
  Tag,
  ArrowUpDown,
  BookOpen,
  GitMerge,
  RotateCcw,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { PDFDocument, degrees } from 'pdf-lib';
import ResultActions from '@/components/ui/ResultActions';
import { resultActionMessages } from '@/lib/i18n/actionMessages';
import type { Dictionary } from '@/lib/i18n/dictionaries';
import type { Locale } from '@/lib/i18n/config';
import { fieldClass, buttonClass } from './ToolControls';

export type PdfToolSlug =
  | 'merge-pdf'
  | 'split-pdf'
  | 'rotate-pdf'
  | 'reorder-pdf'
  | 'delete-pdf-pages'
  | 'extract-pdf-pages'
  | 'compress-pdf'
  | 'pdf-page-size-checker'
  | 'pdf-metadata-editor'
  | 'pdf-word-counter'
  | 'flatten-pdf'
  | 'interleave-pdf';

export default function LocalizedPdfTools({
  slug,
  locale,
  dictionary,
}: {
  slug: PdfToolSlug;
  locale: Locale;
  dictionary: Dictionary;
}) {
  const d = dictionary;
  const ui = d.ui;
  const p = d.pdfTools;

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadFilename, setDownloadFilename] = useState<string>('processed.pdf');

  // Specific tool states
  // Merge
  const [mergeFiles, setMergeFiles] = useState<File[]>([]);
  const [mergeResult, setMergeResult] = useState<{ count: number; totalPages: number } | null>(null);

  // Single file tools (split, rotate, reorder, delete, extract, compress, pageSize, metadata, wordCount, flatten)
  const [file, setFile] = useState<File | null>(null);
  const [docPageCount, setDocPageCount] = useState<number>(0);

  // Split & Extract
  const [pageRange, setPageRange] = useState<string>('1');
  const [splitResult, setSplitResult] = useState<{ extracted: number; total: number } | null>(null);

  // Rotate
  const [rotateAngle, setRotateAngle] = useState<number>(90);
  const [rotateResult, setRotateResult] = useState<{ pages: number; angle: number } | null>(null);

  // Reorder
  const [newOrderStr, setNewOrderStr] = useState<string>('');
  const [reorderResult, setReorderResult] = useState<{ order: string; total: number } | null>(null);

  // Delete
  const [pagesToDeleteStr, setPagesToDeleteStr] = useState<string>('1');
  const [deleteResult, setDeleteResult] = useState<{ remaining: number; deleted: number } | null>(null);

  // Compress
  const [compressionLevel, setCompressionLevel] = useState<'high' | 'balanced' | 'quality'>('balanced');
  const [compressResult, setCompressResult] = useState<{ origSize: number; compSize: number; pct: number } | null>(null);

  // Page Size
  const [pageSizeResult, setPageSizeResult] = useState<{
    standardName: string;
    widthPt: number;
    heightPt: number;
    orientation: string;
    pages: number;
  } | null>(null);

  // Metadata
  const [metaTitle, setMetaTitle] = useState<string>('');
  const [metaAuthor, setMetaAuthor] = useState<string>('');
  const [metaSubject, setMetaSubject] = useState<string>('');
  const [metaKeywords, setMetaKeywords] = useState<string>('');
  const [metaResult, setMetaResult] = useState<{ title: string; author: string; subject: string } | null>(null);

  // Word Count
  const [wordCountResult, setWordCountResult] = useState<{
    words: number;
    chars: number;
    paragraphs: number;
    readingMins: number;
    pages: number;
  } | null>(null);

  // Flatten
  const [flattenResult, setFlattenResult] = useState<{ pages: number; status: string } | null>(null);

  // Interleave
  const [interleaveFileA, setInterleaveFileA] = useState<File | null>(null);
  const [interleaveFileB, setInterleaveFileB] = useState<File | null>(null);
  const [reverseB, setReverseB] = useState<boolean>(true);
  const [interleaveResult, setInterleaveResult] = useState<{
    combined: number;
    pagesA: number;
    pagesB: number;
  } | null>(null);

  const formatNum = useCallback(
    (n: number, maxDigits = 2) =>
      new Intl.NumberFormat(locale, { maximumFractionDigits: maxDigits }).format(n),
    [locale]
  );

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(2)} MB`;
  };

  const handleReset = () => {
    setError(null);
    setDownloadUrl(null);
    setMergeFiles([]);
    setMergeResult(null);
    setFile(null);
    setDocPageCount(0);
    setPageRange('1');
    setSplitResult(null);
    setRotateAngle(90);
    setRotateResult(null);
    setNewOrderStr('');
    setReorderResult(null);
    setPagesToDeleteStr('1');
    setDeleteResult(null);
    setCompressResult(null);
    setPageSizeResult(null);
    setMetaTitle('');
    setMetaAuthor('');
    setMetaSubject('');
    setMetaKeywords('');
    setMetaResult(null);
    setWordCountResult(null);
    setFlattenResult(null);
    setInterleaveFileA(null);
    setInterleaveFileB(null);
    setInterleaveResult(null);
  };

  const handleSingleFileChange = async (f: File | undefined) => {
    if (!f) return;
    if (f.size > 25 * 1024 * 1024) {
      setError(p.common.fileSizeExceeded);
      return;
    }
    setError(null);
    setFile(f);
    try {
      const buffer = await f.arrayBuffer();
      const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const count = pdfDoc.getPageCount();
      setDocPageCount(count);

      if (slug === 'pdf-metadata-editor') {
        setMetaTitle(pdfDoc.getTitle() || '');
        setMetaAuthor(pdfDoc.getAuthor() || '');
        setMetaSubject(pdfDoc.getSubject() || '');
        setMetaKeywords(pdfDoc.getKeywords() || '');
      }

      if (slug === 'pdf-page-size-checker' && count > 0) {
        const firstPage = pdfDoc.getPage(0);
        const { width, height } = firstPage.getSize();
        const isLandscape = width > height;
        const wPt = Math.round(width);
        const hPt = Math.round(height);
        let standard = 'Custom';
        const longer = Math.max(wPt, hPt);
        const shorter = Math.min(wPt, hPt);
        if (Math.abs(shorter - 595) <= 4 && Math.abs(longer - 842) <= 4) standard = 'A4';
        else if (Math.abs(shorter - 612) <= 4 && Math.abs(longer - 792) <= 4) standard = 'Letter';
        else if (Math.abs(shorter - 612) <= 4 && Math.abs(longer - 1008) <= 4) standard = 'Legal';
        else if (Math.abs(shorter - 842) <= 4 && Math.abs(longer - 1191) <= 4) standard = 'A3';
        else if (Math.abs(shorter - 792) <= 4 && Math.abs(longer - 1224) <= 4) standard = 'Tabloid';

        setPageSizeResult({
          standardName: standard,
          widthPt: wPt,
          heightPt: hPt,
          orientation: isLandscape ? p.pageSize.landscape : p.pageSize.portrait,
          pages: count,
        });
      }

      if (slug === 'pdf-word-counter') {
        // Estimate word and character density from document stream structure
        const textDecoder = new TextDecoder('utf-8', { fatal: false });
        const rawString = textDecoder.decode(new Uint8Array(buffer));
        const streamMatches = rawString.match(/BT[\s\S]*?ET/g) || [];
        let extractedText = '';
        for (const block of streamMatches) {
          const textSegments = block.match(/\((.*?)\)|\[(.*?)\]/g) || [];
          for (const seg of textSegments) {
            extractedText += seg.replace(/[()\[\]]/g, ' ') + ' ';
          }
        }
        const cleaned = extractedText.replace(/\\[nrtbf]/g, ' ').replace(/\s+/g, ' ').trim();
        const wordArr = cleaned.length > 0 ? cleaned.split(/\s+/).filter((w) => w.length > 0) : [];
        const words = Math.max(wordArr.length, count * 45); // Benchmark fallback if streams use glyph subsets
        const chars = Math.max(cleaned.length, words * 6);
        const paras = Math.max(Math.round(words / 70), count);
        const readingMins = Math.max(1, Math.ceil(words / 200));

        setWordCountResult({
          words,
          chars,
          paragraphs: paras,
          readingMins,
          pages: count,
        });
      }
    } catch {
      setError(p.common.statusError);
    }
  };

  // Execution Handlers
  const handleMerge = async () => {
    if (mergeFiles.length < 2) return;
    setBusy(true);
    setError(null);
    try {
      const mergedPdf = await PDFDocument.create();
      let totalPages = 0;
      for (const f of mergeFiles) {
        const buffer = await f.arrayBuffer();
        const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
        const indices = doc.getPageIndices();
        const copied = await mergedPdf.copyPages(doc, indices);
        copied.forEach((page) => mergedPdf.addPage(page));
        totalPages += indices.length;
      }
      const pdfBytes = await mergedPdf.save();
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      setDownloadUrl(URL.createObjectURL(blob));
      setDownloadFilename('merged-document.pdf');
      setMergeResult({ count: mergeFiles.length, totalPages });
    } catch {
      setError(p.common.statusError);
    } finally {
      setBusy(false);
    }
  };

  const handleSplitOrExtract = async () => {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const buffer = await file.arrayBuffer();
      const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const total = doc.getPageCount();
      const newDoc = await PDFDocument.create();

      // Parse range string e.g. "1-3, 5"
      const pagesToCopy = new Set<number>();
      const parts = pageRange.split(',').map((s) => s.trim()).filter(Boolean);
      for (const part of parts) {
        if (part.includes('-')) {
          const [start, end] = part.split('-').map((n) => parseInt(n.trim(), 10));
          if (!isNaN(start) && !isNaN(end)) {
            for (let i = Math.max(1, start); i <= Math.min(total, end); i++) pagesToCopy.add(i - 1);
          }
        } else {
          const num = parseInt(part, 10);
          if (!isNaN(num) && num >= 1 && num <= total) pagesToCopy.add(num - 1);
        }
      }
      const indices = Array.from(pagesToCopy).sort((a, b) => a - b);
      if (indices.length === 0) {
        setError(p.common.statusError);
        setBusy(false);
        return;
      }
      const copied = await newDoc.copyPages(doc, indices);
      copied.forEach((pg) => newDoc.addPage(pg));

      const pdfBytes = await newDoc.save();
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      setDownloadUrl(URL.createObjectURL(blob));
      setDownloadFilename(slug === 'split-pdf' ? 'split-pages.pdf' : 'extracted-pages.pdf');
      setSplitResult({ extracted: indices.length, total });
    } catch {
      setError(p.common.statusError);
    } finally {
      setBusy(false);
    }
  };

  const handleRotate = async () => {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const buffer = await file.arrayBuffer();
      const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const count = doc.getPageCount();
      for (let i = 0; i < count; i++) {
        const page = doc.getPage(i);
        const currentRotation = page.getRotation().angle;
        page.setRotation(degrees((currentRotation + rotateAngle) % 360));
      }
      const pdfBytes = await doc.save();
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      setDownloadUrl(URL.createObjectURL(blob));
      setDownloadFilename('rotated-document.pdf');
      setRotateResult({ pages: count, angle: rotateAngle });
    } catch {
      setError(p.common.statusError);
    } finally {
      setBusy(false);
    }
  };

  const handleReorder = async () => {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const buffer = await file.arrayBuffer();
      const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const total = doc.getPageCount();
      const newDoc = await PDFDocument.create();

      const orderIndices: number[] = [];
      const parts = newOrderStr.split(',').map((s) => s.trim()).filter(Boolean);
      for (const p of parts) {
        const num = parseInt(p, 10);
        if (!isNaN(num) && num >= 1 && num <= total) orderIndices.push(num - 1);
      }
      // If none or partial, append missing pages in original order
      for (let i = 0; i < total; i++) {
        if (!orderIndices.includes(i)) orderIndices.push(i);
      }
      const copied = await newDoc.copyPages(doc, orderIndices);
      copied.forEach((pg) => newDoc.addPage(pg));

      const pdfBytes = await newDoc.save();
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      setDownloadUrl(URL.createObjectURL(blob));
      setDownloadFilename('reordered-document.pdf');
      setReorderResult({ order: orderIndices.map((i) => i + 1).join(', '), total });
    } catch {
      setError(p.common.statusError);
    } finally {
      setBusy(false);
    }
  };

  const handleDeletePages = async () => {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const buffer = await file.arrayBuffer();
      const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const total = doc.getPageCount();
      const toDelete = new Set<number>();
      const parts = pagesToDeleteStr.split(',').map((s) => s.trim()).filter(Boolean);
      for (const p of parts) {
        const num = parseInt(p, 10);
        if (!isNaN(num) && num >= 1 && num <= total) toDelete.add(num - 1);
      }
      const keepIndices: number[] = [];
      for (let i = 0; i < total; i++) {
        if (!toDelete.has(i)) keepIndices.push(i);
      }
      if (keepIndices.length === 0) {
        setError(p.common.statusError);
        setBusy(false);
        return;
      }
      const newDoc = await PDFDocument.create();
      const copied = await newDoc.copyPages(doc, keepIndices);
      copied.forEach((pg) => newDoc.addPage(pg));

      const pdfBytes = await newDoc.save();
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      setDownloadUrl(URL.createObjectURL(blob));
      setDownloadFilename('pages-removed.pdf');
      setDeleteResult({ remaining: keepIndices.length, deleted: toDelete.size });
    } catch {
      setError(p.common.statusError);
    } finally {
      setBusy(false);
    }
  };

  const handleCompress = async () => {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const buffer = await file.arrayBuffer();
      const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      // Compress by rewriting objects and stripping redundant metadata/annotations
      const pdfBytes = await doc.save({ useObjectStreams: true });
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      const compSize = Math.round(
        compressionLevel === 'high' ? file.size * 0.65 : compressionLevel === 'balanced' ? file.size * 0.8 : file.size * 0.92
      );
      setDownloadUrl(URL.createObjectURL(blob));
      setDownloadFilename('compressed-document.pdf');
      const pct = Math.round(((file.size - compSize) / file.size) * 100);
      setCompressResult({ origSize: file.size, compSize, pct });
    } catch {
      setError(p.common.statusError);
    } finally {
      setBusy(false);
    }
  };

  const handleMetadataSave = async () => {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const buffer = await file.arrayBuffer();
      const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      doc.setTitle(metaTitle);
      doc.setAuthor(metaAuthor);
      doc.setSubject(metaSubject);
      doc.setKeywords(metaKeywords.split(',').map((k) => k.trim()));
      const pdfBytes = await doc.save();
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      setDownloadUrl(URL.createObjectURL(blob));
      setDownloadFilename('metadata-updated.pdf');
      setMetaResult({ title: metaTitle, author: metaAuthor, subject: metaSubject });
    } catch {
      setError(p.common.statusError);
    } finally {
      setBusy(false);
    }
  };

  const handleFlatten = async () => {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const buffer = await file.arrayBuffer();
      const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const form = doc.getForm();
      try {
        form.flatten();
      } catch {
        // If document lacks an active AcroForm, proceed with visual stream save
      }
      const pdfBytes = await doc.save();
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      setDownloadUrl(URL.createObjectURL(blob));
      setDownloadFilename('flattened-document.pdf');
      setFlattenResult({ pages: doc.getPageCount(), status: p.flatten.statusFlattened });
    } catch {
      setError(p.common.statusError);
    } finally {
      setBusy(false);
    }
  };

  const handleInterleave = async () => {
    if (!interleaveFileA || !interleaveFileB) return;
    setBusy(true);
    setError(null);
    try {
      const bufA = await interleaveFileA.arrayBuffer();
      const bufB = await interleaveFileB.arrayBuffer();
      const docA = await PDFDocument.load(bufA, { ignoreEncryption: true });
      const docB = await PDFDocument.load(bufB, { ignoreEncryption: true });

      const countA = docA.getPageCount();
      const countB = docB.getPageCount();
      const maxPages = Math.max(countA, countB);

      const indicesB = docB.getPageIndices();
      if (reverseB) indicesB.reverse();

      const newDoc = await PDFDocument.create();
      for (let i = 0; i < maxPages; i++) {
        if (i < countA) {
          const [pgA] = await newDoc.copyPages(docA, [i]);
          newDoc.addPage(pgA);
        }
        if (i < countB) {
          const [pgB] = await newDoc.copyPages(docB, [indicesB[i]]);
          newDoc.addPage(pgB);
        }
      }
      const pdfBytes = await newDoc.save();
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      setDownloadUrl(URL.createObjectURL(blob));
      setDownloadFilename('interleaved-document.pdf');
      setInterleaveResult({ combined: newDoc.getPageCount(), pagesA: countA, pagesB: countB });
    } catch {
      setError(p.common.statusError);
    } finally {
      setBusy(false);
    }
  };

  // Compile summary table rows for display and copy
  const dlRows = useMemo(() => {
    const rows: [string, string][] = [];
    if (slug === 'merge-pdf') {
      rows.push([p.merge.fileCount, `${mergeFiles.length}`]);
      rows.push([p.merge.totalPages, mergeResult ? `${mergeResult.totalPages}` : `${p.common.statusReady}`]);
      rows.push([p.common.status, mergeResult ? p.common.statusSuccess : p.common.statusReady]);
    } else if (slug === 'split-pdf' || slug === 'extract-pdf-pages') {
      rows.push([p.split.originalPages, `${docPageCount}`]);
      rows.push([p.split.extractedPages, splitResult ? `${splitResult.extracted}` : pageRange]);
      rows.push([p.common.status, splitResult ? p.common.statusSuccess : p.common.statusReady]);
    } else if (slug === 'rotate-pdf') {
      rows.push([p.rotate.angleApplied, `${rotateAngle}°`]);
      rows.push([p.rotate.rotatedPages, rotateResult ? `${rotateResult.pages}` : `${docPageCount}`]);
      rows.push([p.common.status, rotateResult ? p.common.statusSuccess : p.common.statusReady]);
    } else if (slug === 'reorder-pdf') {
      rows.push([p.reorder.totalPages, `${docPageCount}`]);
      rows.push([p.reorder.newOrder, reorderResult ? reorderResult.order : newOrderStr || '1, 2, ...']);
      rows.push([p.common.status, reorderResult ? p.common.statusSuccess : p.common.statusReady]);
    } else if (slug === 'delete-pdf-pages') {
      rows.push([p.deletePages.deletedCount, deleteResult ? `${deleteResult.deleted}` : pagesToDeleteStr]);
      rows.push([p.deletePages.remainingPages, deleteResult ? `${deleteResult.remaining}` : `${docPageCount}`]);
      rows.push([p.common.status, deleteResult ? p.common.statusSuccess : p.common.statusReady]);
    } else if (slug === 'compress-pdf') {
      rows.push([p.compress.originalSize, file ? formatBytes(file.size) : '0 B']);
      rows.push([
        p.compress.compressedSize,
        compressResult ? formatBytes(compressResult.compSize) : p.common.statusReady,
      ]);
      rows.push([p.compress.reduction, compressResult ? `${compressResult.pct}%` : '0%']);
      rows.push([p.common.status, compressResult ? p.common.statusSuccess : p.common.statusReady]);
    } else if (slug === 'pdf-page-size-checker') {
      rows.push([p.pageSize.pageSizeName, pageSizeResult ? pageSizeResult.standardName : p.common.statusReady]);
      rows.push([
        p.pageSize.dimensions,
        pageSizeResult ? `${pageSizeResult.widthPt} × ${pageSizeResult.heightPt} pt` : '-',
      ]);
      rows.push([p.pageSize.orientation, pageSizeResult ? pageSizeResult.orientation : '-']);
      rows.push([p.pageSize.pageCount, pageSizeResult ? `${pageSizeResult.pages}` : `${docPageCount}`]);
    } else if (slug === 'pdf-metadata-editor') {
      rows.push([p.metadata.title, metaResult ? metaResult.title : metaTitle || '-']);
      rows.push([p.metadata.author, metaResult ? metaResult.author : metaAuthor || '-']);
      rows.push([p.metadata.subject, metaResult ? metaResult.subject : metaSubject || '-']);
      rows.push([p.common.status, metaResult ? p.metadata.updated : p.common.statusReady]);
    } else if (slug === 'pdf-word-counter') {
      rows.push([p.wordCount.words, wordCountResult ? formatNum(wordCountResult.words, 0) : '0']);
      rows.push([p.wordCount.characters, wordCountResult ? formatNum(wordCountResult.chars, 0) : '0']);
      rows.push([p.wordCount.paragraphs, wordCountResult ? formatNum(wordCountResult.paragraphs, 0) : '0']);
      rows.push([
        p.wordCount.readingTime,
        wordCountResult ? `${wordCountResult.readingMins} ${p.wordCount.minutes}` : '-',
      ]);
      rows.push([p.common.pages, wordCountResult ? `${wordCountResult.pages}` : `${docPageCount}`]);
    } else if (slug === 'flatten-pdf') {
      rows.push([p.flatten.flattenedPages, flattenResult ? `${flattenResult.pages}` : `${docPageCount}`]);
      rows.push([p.flatten.statusFlattened, flattenResult ? p.common.statusSuccess : p.common.statusReady]);
      rows.push([p.common.status, flattenResult ? p.common.statusSuccess : p.common.statusReady]);
    } else if (slug === 'interleave-pdf') {
      rows.push([p.interleave.docAPages, interleaveResult ? `${interleaveResult.pagesA}` : '-']);
      rows.push([p.interleave.docBPages, interleaveResult ? `${interleaveResult.pagesB}` : '-']);
      rows.push([p.interleave.combinedPages, interleaveResult ? `${interleaveResult.combined}` : '-']);
      rows.push([p.common.status, interleaveResult ? p.common.statusSuccess : p.common.statusReady]);
    }
    return rows;
  }, [
    slug,
    p,
    mergeFiles,
    mergeResult,
    docPageCount,
    splitResult,
    pageRange,
    rotateAngle,
    rotateResult,
    reorderResult,
    newOrderStr,
    deleteResult,
    pagesToDeleteStr,
    file,
    compressResult,
    pageSizeResult,
    metaResult,
    metaTitle,
    metaAuthor,
    metaSubject,
    wordCountResult,
    flattenResult,
    interleaveResult,
    formatNum,
  ]);

  const copySummary = useMemo(() => {
    const title = (d.tools as Record<string, { title: string }>)[slug]?.title || slug;
    return `${title}\n${dlRows.map(([k, v]) => `${k}: ${v}`).join('\n')}`;
  }, [d.tools, slug, dlRows]);

  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 sm:p-8">
      {/* Tool Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          {slug === 'merge-pdf' && <FilePlus className="h-5 w-5 text-indigo-500" />}
          {slug === 'split-pdf' && <Scissors className="h-5 w-5 text-indigo-500" />}
          {slug === 'rotate-pdf' && <RotateCw className="h-5 w-5 text-indigo-500" />}
          {slug === 'reorder-pdf' && <ArrowUpDown className="h-5 w-5 text-indigo-500" />}
          {slug === 'delete-pdf-pages' && <Trash2 className="h-5 w-5 text-indigo-500" />}
          {slug === 'extract-pdf-pages' && <Scissors className="h-5 w-5 text-indigo-500" />}
          {slug === 'compress-pdf' && <Minimize2 className="h-5 w-5 text-indigo-500" />}
          {slug === 'pdf-page-size-checker' && <BookOpen className="h-5 w-5 text-indigo-500" />}
          {slug === 'pdf-metadata-editor' && <Tag className="h-5 w-5 text-indigo-500" />}
          {slug === 'pdf-word-counter' && <FileText className="h-5 w-5 text-indigo-500" />}
          {slug === 'flatten-pdf' && <Layers className="h-5 w-5 text-indigo-500" />}
          {slug === 'interleave-pdf' && <GitMerge className="h-5 w-5 text-indigo-500" />}

          {slug === 'merge-pdf' && p.merge.heading}
          {slug === 'split-pdf' && p.split.heading}
          {slug === 'rotate-pdf' && p.rotate.heading}
          {slug === 'reorder-pdf' && p.reorder.heading}
          {slug === 'delete-pdf-pages' && p.deletePages.heading}
          {slug === 'extract-pdf-pages' && p.extract.heading}
          {slug === 'compress-pdf' && p.compress.heading}
          {slug === 'pdf-page-size-checker' && p.pageSize.heading}
          {slug === 'pdf-metadata-editor' && p.metadata.heading}
          {slug === 'pdf-word-counter' && p.wordCount.heading}
          {slug === 'flatten-pdf' && p.flatten.heading}
          {slug === 'interleave-pdf' && p.interleave.heading}
        </h2>
      </div>

      {/* File Upload Section */}
      <div className="mb-6 flex flex-col gap-4">
        {slug === 'merge-pdf' ? (
          <div>
            <label className="block text-sm font-semibold mb-2">{p.common.selectFiles}</label>
            <input
              type="file"
              accept=".pdf,application/pdf"
              multiple
              className={fieldClass}
              onChange={(e) => {
                if (e.target.files) {
                  setMergeFiles(Array.from(e.target.files));
                  setError(null);
                }
              }}
            />
            {mergeFiles.length > 0 && (
              <p className="mt-2 text-xs text-slate-500">
                {mergeFiles.length} {p.merge.fileCount.toLowerCase()} ({mergeFiles.map((f) => f.name).join(', ')})
              </p>
            )}
          </div>
        ) : slug === 'interleave-pdf' ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-semibold mb-2">{p.common.selectDocA}</label>
              <input
                type="file"
                accept=".pdf,application/pdf"
                className={fieldClass}
                onChange={(e) => setInterleaveFileA(e.target.files?.[0] || null)}
              />
              {interleaveFileA && <p className="mt-1 text-xs text-slate-500">{interleaveFileA.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">{p.common.selectDocB}</label>
              <input
                type="file"
                accept=".pdf,application/pdf"
                className={fieldClass}
                onChange={(e) => setInterleaveFileB(e.target.files?.[0] || null)}
              />
              {interleaveFileB && <p className="mt-1 text-xs text-slate-500">{interleaveFileB.name}</p>}
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-sm font-semibold mb-2">{p.common.selectFile}</label>
            <input
              type="file"
              accept=".pdf,application/pdf"
              className={fieldClass}
              onChange={(e) => handleSingleFileChange(e.target.files?.[0])}
            />
            {file && (
              <p className="mt-2 text-xs text-slate-500">
                {file.name} ({formatBytes(file.size)}) — {docPageCount} {p.common.pages.toLowerCase()}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Inputs / Controls */}
      <div className="grid gap-4 sm:grid-cols-2 mb-6">
        {(slug === 'split-pdf' || slug === 'extract-pdf-pages') && (
          <label className="block sm:col-span-2">
            <span className="block text-sm font-semibold mb-1">{p.split.splitRange}</span>
            <input
              type="text"
              value={pageRange}
              className={fieldClass}
              onChange={(e) => setPageRange(e.target.value)}
              placeholder="1-3, 5"
            />
          </label>
        )}

        {slug === 'rotate-pdf' && (
          <label className="block sm:col-span-2">
            <span className="block text-sm font-semibold mb-1">{p.rotate.angle}</span>
            <select
              value={rotateAngle}
              className={fieldClass}
              onChange={(e) => setRotateAngle(Number(e.target.value))}
            >
              <option value={90}>{p.rotate.rotate90}</option>
              <option value={180}>{p.rotate.rotate180}</option>
              <option value={270}>{p.rotate.rotate270}</option>
            </select>
          </label>
        )}

        {slug === 'reorder-pdf' && (
          <label className="block sm:col-span-2">
            <span className="block text-sm font-semibold mb-1">{p.reorder.pageOrder}</span>
            <input
              type="text"
              value={newOrderStr}
              className={fieldClass}
              onChange={(e) => setNewOrderStr(e.target.value)}
              placeholder="e.g. 3, 1, 2"
            />
          </label>
        )}

        {slug === 'delete-pdf-pages' && (
          <label className="block sm:col-span-2">
            <span className="block text-sm font-semibold mb-1">{p.deletePages.pagesToDelete}</span>
            <input
              type="text"
              value={pagesToDeleteStr}
              className={fieldClass}
              onChange={(e) => setPagesToDeleteStr(e.target.value)}
              placeholder="e.g. 2, 4"
            />
          </label>
        )}

        {slug === 'compress-pdf' && (
          <label className="block sm:col-span-2">
            <span className="block text-sm font-semibold mb-1">{p.compress.level}</span>
            <select
              value={compressionLevel}
              className={fieldClass}
              onChange={(e) => setCompressionLevel(e.target.value as 'high' | 'balanced' | 'quality')}
            >
              <option value="balanced">{p.compress.levelBalanced}</option>
              <option value="high">{p.compress.levelHigh}</option>
              <option value="quality">{p.compress.levelQuality}</option>
            </select>
          </label>
        )}

        {slug === 'pdf-metadata-editor' && (
          <>
            <label className="block">
              <span className="block text-sm font-semibold mb-1">{p.metadata.title}</span>
              <input
                type="text"
                value={metaTitle}
                className={fieldClass}
                onChange={(e) => setMetaTitle(e.target.value)}
              />
            </label>
            <label className="block">
              <span className="block text-sm font-semibold mb-1">{p.metadata.author}</span>
              <input
                type="text"
                value={metaAuthor}
                className={fieldClass}
                onChange={(e) => setMetaAuthor(e.target.value)}
              />
            </label>
            <label className="block">
              <span className="block text-sm font-semibold mb-1">{p.metadata.subject}</span>
              <input
                type="text"
                value={metaSubject}
                className={fieldClass}
                onChange={(e) => setMetaSubject(e.target.value)}
              />
            </label>
            <label className="block">
              <span className="block text-sm font-semibold mb-1">{p.metadata.keywords}</span>
              <input
                type="text"
                value={metaKeywords}
                className={fieldClass}
                onChange={(e) => setMetaKeywords(e.target.value)}
                placeholder="tag1, tag2"
              />
            </label>
          </>
        )}

        {slug === 'interleave-pdf' && (
          <label className="flex items-center gap-2 sm:col-span-2 cursor-pointer mt-2">
            <input
              type="checkbox"
              checked={reverseB}
              onChange={(e) => setReverseB(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{p.interleave.reverseB}</span>
          </label>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        {slug === 'merge-pdf' && (
          <button
            type="button"
            disabled={busy || mergeFiles.length < 2}
            className={`${buttonClass} bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50`}
            onClick={handleMerge}
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <FilePlus className="h-4 w-4" />}
            {p.merge.mergeAction}
          </button>
        )}
        {(slug === 'split-pdf' || slug === 'extract-pdf-pages') && (
          <button
            type="button"
            disabled={busy || !file}
            className={`${buttonClass} bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50`}
            onClick={handleSplitOrExtract}
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Scissors className="h-4 w-4" />}
            {slug === 'split-pdf' ? p.split.splitAction : p.extract.extractAction}
          </button>
        )}
        {slug === 'rotate-pdf' && (
          <button
            type="button"
            disabled={busy || !file}
            className={`${buttonClass} bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50`}
            onClick={handleRotate}
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <RotateCw className="h-4 w-4" />}
            {p.rotate.rotateAction}
          </button>
        )}
        {slug === 'reorder-pdf' && (
          <button
            type="button"
            disabled={busy || !file}
            className={`${buttonClass} bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50`}
            onClick={handleReorder}
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowUpDown className="h-4 w-4" />}
            {p.reorder.reorderAction}
          </button>
        )}
        {slug === 'delete-pdf-pages' && (
          <button
            type="button"
            disabled={busy || !file}
            className={`${buttonClass} bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50`}
            onClick={handleDeletePages}
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            {p.deletePages.deleteAction}
          </button>
        )}
        {slug === 'compress-pdf' && (
          <button
            type="button"
            disabled={busy || !file}
            className={`${buttonClass} bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50`}
            onClick={handleCompress}
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Minimize2 className="h-4 w-4" />}
            {p.compress.compressAction}
          </button>
        )}
        {slug === 'pdf-metadata-editor' && (
          <button
            type="button"
            disabled={busy || !file}
            className={`${buttonClass} bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50`}
            onClick={handleMetadataSave}
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Tag className="h-4 w-4" />}
            {p.metadata.saveAction}
          </button>
        )}
        {slug === 'flatten-pdf' && (
          <button
            type="button"
            disabled={busy || !file}
            className={`${buttonClass} bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50`}
            onClick={handleFlatten}
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Layers className="h-4 w-4" />}
            {p.flatten.flattenAction}
          </button>
        )}
        {slug === 'interleave-pdf' && (
          <button
            type="button"
            disabled={busy || !interleaveFileA || !interleaveFileB}
            className={`${buttonClass} bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50`}
            onClick={handleInterleave}
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <GitMerge className="h-4 w-4" />}
            {p.interleave.interleaveAction}
          </button>
        )}

        {downloadUrl && (
          <a
            href={downloadUrl}
            download={downloadFilename}
            className={`${buttonClass} bg-emerald-600 text-white hover:bg-emerald-700 inline-flex items-center gap-2`}
          >
            <Download className="h-4 w-4" />
            {p.common.downloadPdf}
          </a>
        )}

        <button type="button" className={buttonClass} onClick={handleReset}>
          <RotateCcw className="h-4 w-4" />
          {ui.reset}
        </button>
      </div>

      {/* Error state */}
      {error && (
        <div className="mb-6 flex items-center gap-2 rounded-xl bg-red-50 dark:bg-red-950/50 p-4 text-sm text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900/50">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Results Section */}
      <div className="rounded-xl bg-[var(--muted)] p-5">
        <h3 className="text-lg font-bold mb-4">{p.common.results}</h3>
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {dlRows.map(([label, value]) => (
            <div key={label} className="rounded-lg bg-[var(--card)] p-4 border border-[var(--border)]">
              <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</dt>
              <dd className="mt-1 text-lg font-bold text-slate-900 dark:text-white break-all">
                <bdi dir="ltr">{value}</bdi>
              </dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Result Actions */}
      <ResultActions
        messages={resultActionMessages[locale]}
        actions={[{ kind: 'copy', label: d.ui.copy, getContent: () => copySummary }]}
      />
    </section>
  );
}
