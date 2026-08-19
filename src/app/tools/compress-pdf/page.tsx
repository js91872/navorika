'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { AlertTriangle, ArrowLeft, Download, FileText, Loader2, ShieldCheck, Upload, X } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

type CompressionLevel = 'quality' | 'balanced' | 'small';
const settings: Record<CompressionLevel, { label: string; quality: number; scale: number }> = {
  quality: { label: 'Higher quality', quality: 0.85, scale: 1.4 },
  balanced: { label: 'Balanced', quality: 0.7, scale: 1.1 },
  small: { label: 'Smaller file', quality: 0.55, scale: 0.8 },
};

async function loadPdfJs() {
  const pdfjs = await import('pdfjs-dist');
  pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();
  return pdfjs;
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function CompressPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [level, setLevel] = useState<CompressionLevel>('balanced');
  const [resultUrl, setResultUrl] = useState('');
  const [resultSize, setResultSize] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => () => { if (resultUrl) URL.revokeObjectURL(resultUrl); }, [resultUrl]);

  const clearResult = () => {
    setResultUrl(current => {
      if (current) URL.revokeObjectURL(current);
      return '';
    });
    setResultSize(0);
  };

  const selectFile = async (selected: File | undefined) => {
    if (!selected || selected.type !== 'application/pdf') {
      setError('Please select a PDF file.');
      return;
    }
    setIsProcessing(true);
    clearResult();
    try {
      const pdfjs = await loadPdfJs();
      const task = pdfjs.getDocument({ data: new Uint8Array(await selected.arrayBuffer()) });
      const pdf = await task.promise;
      setFile(selected);
      setPageCount(pdf.numPages);
      setError('');
      await task.destroy();
    } catch {
      setFile(null);
      setPageCount(0);
      setError('This PDF could not be opened. It may be damaged or password-protected.');
    } finally {
      setIsProcessing(false);
    }
  };

  const compress = async () => {
    if (!file) return;
    setIsProcessing(true);
    setError('');
    clearResult();
    try {
      const pdfjs = await loadPdfJs();
      const task = pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) });
      const source = await task.promise;
      const output = await PDFDocument.create();
      const { scale, quality } = settings[level];

      for (let pageNumber = 1; pageNumber <= source.numPages; pageNumber += 1) {
        const sourcePage = await source.getPage(pageNumber);
        const pageSize = sourcePage.getViewport({ scale: 1 });
        const renderViewport = sourcePage.getViewport({ scale });
        const canvas = document.createElement('canvas');
        canvas.width = Math.ceil(renderViewport.width);
        canvas.height = Math.ceil(renderViewport.height);
        const context = canvas.getContext('2d', { alpha: false });
        if (!context) throw new Error('Canvas is unavailable.');
        await sourcePage.render({ canvas, canvasContext: context, viewport: renderViewport, background: '#ffffff' }).promise;
        const jpeg = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/jpeg', quality));
        if (!jpeg) throw new Error('JPEG encoding failed.');
        const image = await output.embedJpg(await jpeg.arrayBuffer());
        const page = output.addPage([pageSize.width, pageSize.height]);
        page.drawImage(image, { x: 0, y: 0, width: pageSize.width, height: pageSize.height });
      }

      const bytes = await output.save({ useObjectStreams: true });
      const blob = new Blob([bytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      setResultSize(blob.size);
      setResultUrl(URL.createObjectURL(blob));
      await task.destroy();
    } catch {
      setError('The PDF could not be compressed. Try the smaller-file setting or another readable PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  const reduction = file && resultSize ? Math.round((1 - resultSize / file.size) * 100) : 0;

  return <main className="max-w-4xl mx-auto px-6 py-12 lg:px-8">
    <Link href="/categories/pdf-tools" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-600 transition mb-8"><ArrowLeft className="h-4 w-4" /> Back to PDF Tools</Link>
    <div className="text-center mb-10"><div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4 border border-emerald-500/20"><ShieldCheck className="h-4 w-4" /> Local Processing Only</div><h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">Compress PDF by Rasterizing Pages</h1><p className="text-lg text-slate-600 dark:text-slate-400">Rebuild PDF pages as compressed JPEG images for smaller image-heavy documents.</p></div>
    <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden mb-16"><div className="p-8">
      {!file ? <button type="button" onClick={() => inputRef.current?.click()} disabled={isProcessing} className="w-full border-2 border-dashed border-indigo-300 dark:border-indigo-500/30 rounded-2xl p-12 flex flex-col items-center justify-center text-center hover:bg-indigo-50 dark:hover:bg-indigo-500/5 disabled:opacity-50"><Upload className="h-10 w-10 text-indigo-500 mb-4" /><span className="text-xl font-bold">Choose PDF</span><span className="text-sm text-slate-500 mt-2">Best suited to scanned or image-heavy PDFs</span></button> : <>
        <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60"><FileText className="h-7 w-7 text-indigo-500" /><div className="flex-1 min-w-0"><p className="font-bold truncate">{file.name}</p><p className="text-xs text-slate-500">{pageCount} pages - {formatBytes(file.size)}</p></div><button type="button" onClick={() => { setFile(null); setPageCount(0); clearResult(); }} aria-label="Remove PDF" className="p-2"><X className="h-5 w-5" /></button></div>
        <div className="mt-6"><p className="text-sm font-bold mb-2">Compression setting</p><div className="grid sm:grid-cols-3 gap-3">{(Object.keys(settings) as CompressionLevel[]).map(option => <button type="button" key={option} onClick={() => { setLevel(option); clearResult(); }} className={`p-3 rounded-xl border-2 font-semibold ${level === option ? 'border-indigo-500 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' : 'border-slate-200 dark:border-slate-700'}`}>{settings[option].label}</button>)}</div></div>
        <div className="mt-6 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 flex items-start gap-3"><AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" /><p className="text-sm text-amber-800 dark:text-amber-300">This is lossy raster compression. It removes selectable text, links, forms, annotations, vector editability, layers, and digital signatures. Keep the original.</p></div>
        <button type="button" onClick={compress} disabled={isProcessing} className="mt-6 w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50">{isProcessing ? <><Loader2 className="h-5 w-5 animate-spin" /> Compressing {pageCount} pages...</> : 'Compress PDF'}</button>
        {resultUrl && <div className={`mt-6 p-4 rounded-xl border ${reduction > 0 ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800' : 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800'}`}><p className="font-bold">Original: {formatBytes(file.size)} - Output: {formatBytes(resultSize)}</p><p className="text-sm mt-1">{reduction > 0 ? `${reduction}% smaller` : `${Math.abs(reduction)}% larger. This source does not benefit from the selected raster setting.`}</p><a href={resultUrl} download={`compressed_${file.name}`} className="mt-4 w-full py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl flex items-center justify-center gap-2"><Download className="h-5 w-5" /> Download Result</a></div>}
      </>}
      <input ref={inputRef} type="file" accept="application/pdf" className="hidden" onChange={event => void selectFile(event.target.files?.[0])} />
      {error && <p role="alert" className="mt-4 text-sm font-medium text-red-600 dark:text-red-400">{error}</p>}
    </div></section>
  </main>;
}
