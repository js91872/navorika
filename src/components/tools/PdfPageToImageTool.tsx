'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Download, FileText, ImageIcon, Loader2, ShieldCheck, Upload, X } from 'lucide-react';

type ImageFormat = 'jpeg' | 'png';
type Props = { description: string; fixedFormat?: ImageFormat; title: string };

async function loadPdfJs() {
  const pdfjs = await import('pdfjs-dist');
  pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();
  return pdfjs;
}

export default function PdfPageToImageTool({ description, fixedFormat, title }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.5);
  const [format, setFormat] = useState<ImageFormat>(fixedFormat ?? 'png');
  const [quality, setQuality] = useState(0.92);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl); }, [previewUrl]);

  const clearPreview = () => {
    setPreviewUrl(current => {
      if (current) URL.revokeObjectURL(current);
      return '';
    });
  };

  const selectPdf = async (selected: File | undefined) => {
    if (!selected || selected.type !== 'application/pdf') {
      setError('Please select a PDF file.');
      return;
    }
    setIsProcessing(true);
    clearPreview();
    try {
      const pdfjs = await loadPdfJs();
      const task = pdfjs.getDocument({ data: new Uint8Array(await selected.arrayBuffer()) });
      const pdf = await task.promise;
      setFile(selected);
      setPageCount(pdf.numPages);
      setPageNumber(1);
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

  const renderPage = async () => {
    if (!file) return;
    setIsProcessing(true);
    setError('');
    clearPreview();
    try {
      const pdfjs = await loadPdfJs();
      const task = pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) });
      const pdf = await task.promise;
      const page = await pdf.getPage(pageNumber);
      const viewport = page.getViewport({ scale });
      const canvas = document.createElement('canvas');
      canvas.width = Math.ceil(viewport.width);
      canvas.height = Math.ceil(viewport.height);
      const context = canvas.getContext('2d', { alpha: false });
      if (!context) throw new Error('Canvas is unavailable.');
      await page.render({ canvas, canvasContext: context, viewport, background: '#ffffff' }).promise;
      const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';
      const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, mimeType, format === 'jpeg' ? quality : undefined));
      if (!blob) throw new Error('Image encoding failed.');
      setPreviewUrl(URL.createObjectURL(blob));
      await task.destroy();
    } catch {
      setError('This page could not be rendered. Try a lower resolution or another readable PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  const download = () => {
    if (!file || !previewUrl) return;
    const anchor = document.createElement('a');
    anchor.href = previewUrl;
    anchor.download = `${file.name.replace(/\.pdf$/i, '')}_page_${pageNumber}.${format === 'jpeg' ? 'jpg' : 'png'}`;
    anchor.click();
  };

  return <main className="max-w-4xl mx-auto px-6 py-12 lg:px-8">
    <Link href="/categories/pdf-tools" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-600 transition mb-8"><ArrowLeft className="h-4 w-4" /> Back to PDF Tools</Link>
    <div className="text-center mb-10">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4 border border-emerald-500/20"><ShieldCheck className="h-4 w-4" /> Local Processing Only</div>
      <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">{title}</h1><p className="text-lg text-slate-600 dark:text-slate-400">{description}</p>
    </div>
    <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden mb-16">
      <div className="p-8">
        {!file ? <button type="button" onClick={() => fileInputRef.current?.click()} disabled={isProcessing} className="w-full border-2 border-dashed border-indigo-300 dark:border-indigo-500/30 rounded-2xl p-12 flex flex-col items-center justify-center text-center hover:bg-indigo-50 dark:hover:bg-indigo-500/5 disabled:opacity-50"><Upload className="h-10 w-10 text-indigo-500 mb-4" /><span className="text-xl font-bold">Choose PDF</span><span className="text-sm text-slate-500 mt-2">Select one page to render as an image</span></button> : <>
          <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 mb-6"><FileText className="h-7 w-7 text-indigo-500" /><div className="flex-1 min-w-0"><p className="font-bold truncate">{file.name}</p><p className="text-xs text-slate-500">{pageCount} pages</p></div><button type="button" onClick={() => { setFile(null); setPageCount(0); clearPreview(); }} aria-label="Remove PDF" className="p-2"><X className="h-5 w-5" /></button></div>
          <div className={`grid gap-4 ${fixedFormat ? 'sm:grid-cols-3' : 'sm:grid-cols-4'}`}>
            <label className="text-sm font-bold">Page<input type="number" min={1} max={pageCount} value={pageNumber} onChange={event => { setPageNumber(Math.min(Math.max(1, Number(event.target.value)), pageCount)); clearPreview(); }} className="mt-2 w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" /></label>
            <label className="text-sm font-bold">Resolution<select value={scale} onChange={event => { setScale(Number(event.target.value)); clearPreview(); }} className="mt-2 w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"><option value={1}>Standard (1x)</option><option value={1.5}>High (1.5x)</option><option value={2}>Very high (2x)</option></select></label>
            {!fixedFormat && <label className="text-sm font-bold">Format<select value={format} onChange={event => { setFormat(event.target.value as ImageFormat); clearPreview(); }} className="mt-2 w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"><option value="png">PNG</option><option value="jpeg">JPG</option></select></label>}
            {format === 'jpeg' && <label className="text-sm font-bold">JPG quality<select value={quality} onChange={event => { setQuality(Number(event.target.value)); clearPreview(); }} className="mt-2 w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"><option value={0.8}>80%</option><option value={0.92}>92%</option><option value={1}>100%</option></select></label>}
          </div>
          <button type="button" onClick={renderPage} disabled={isProcessing} className="mt-6 w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50">{isProcessing ? <><Loader2 className="h-5 w-5 animate-spin" /> Rendering...</> : <><ImageIcon className="h-5 w-5" /> Render Page</>}</button>
          {previewUrl && <div className="mt-6"><p className="font-bold mb-3">Image preview</p><div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-950 p-3"><img src={previewUrl} alt={`Rendered preview of PDF page ${pageNumber}`} className="max-h-[34rem] mx-auto object-contain" /></div><button type="button" onClick={download} className="mt-4 w-full py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl flex items-center justify-center gap-2"><Download className="h-5 w-5" /> Download {format === 'jpeg' ? 'JPG' : 'PNG'}</button></div>}
        </>}
        <input ref={fileInputRef} type="file" accept="application/pdf" className="hidden" onChange={event => void selectPdf(event.target.files?.[0])} />
        {error && <p role="alert" className="mt-4 text-sm font-medium text-red-600 dark:text-red-400">{error}</p>}
      </div>
    </section>
  </main>;
}
