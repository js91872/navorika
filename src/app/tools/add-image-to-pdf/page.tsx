'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Download, FileImage, FileText, Loader2, ShieldCheck, Upload, X } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import { decodeWebpToPng } from '@/lib/images/browser';

type Position = 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
const supportedImages = new Set(['image/jpeg', 'image/png', 'image/webp']);
const margin = 24;

function imageCoordinates(position: Position, pageWidth: number, pageHeight: number, width: number, height: number) {
  const horizontal = position.endsWith('left') ? margin : position.endsWith('right') ? pageWidth - width - margin : (pageWidth - width) / 2;
  const vertical = position.startsWith('top') ? pageHeight - height - margin : position.startsWith('bottom') ? margin : (pageHeight - height) / 2;
  return { x: Math.max(0, horizontal), y: Math.max(0, vertical) };
}

export default function AddImageToPdfPage() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [targetPage, setTargetPage] = useState(1);
  const [widthPercent, setWidthPercent] = useState(30);
  const [position, setPosition] = useState<Position>('center');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const selectPdf = async (file: File | undefined) => {
    if (!file || file.type !== 'application/pdf') {
      setError('Please select a PDF file.');
      return;
    }
    try {
      const pdf = await PDFDocument.load(await file.arrayBuffer(), { updateMetadata: false });
      setPdfFile(file);
      setPageCount(pdf.getPageCount());
      setTargetPage(1);
      setError('');
    } catch {
      setPdfFile(null);
      setPageCount(0);
      setError('This PDF could not be opened. It may be damaged or password-protected.');
    }
  };

  const selectImage = (file: File | undefined) => {
    if (!file || !supportedImages.has(file.type)) {
      setError('Please select a JPG, PNG, or WebP image.');
      return;
    }
    setImageFile(file);
    setError('');
  };

  const addImage = async () => {
    if (!pdfFile || !imageFile) return;
    setIsProcessing(true);
    setError('');
    try {
      const pdf = await PDFDocument.load(await pdfFile.arrayBuffer());
      const imageBytes = imageFile.type === 'image/webp' ? await decodeWebpToPng(imageFile) : await imageFile.arrayBuffer();
      const image = imageFile.type === 'image/jpeg' ? await pdf.embedJpg(imageBytes) : await pdf.embedPng(imageBytes);
      const page = pdf.getPages()[targetPage - 1];
      const { width: pageWidth, height: pageHeight } = page.getSize();
      const requestedWidth = pageWidth * (widthPercent / 100);
      const requestedHeight = requestedWidth * (image.height / image.width);
      const heightLimit = pageHeight - margin * 2;
      const scale = requestedHeight > heightLimit ? heightLimit / requestedHeight : 1;
      const width = requestedWidth * scale;
      const height = requestedHeight * scale;
      const { x, y } = imageCoordinates(position, pageWidth, pageHeight, width, height);
      page.drawImage(image, { x, y, width, height });

      const bytes = await pdf.save({ useObjectStreams: true });
      const blob = new Blob([bytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `image_added_${pdfFile.name}`;
      anchor.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 0);
    } catch {
      setError('The image could not be added. Check both files and try a smaller image.');
    } finally {
      setIsProcessing(false);
    }
  };

  return <main className="max-w-4xl mx-auto px-6 py-12 lg:px-8">
    <Link href="/categories/pdf-tools" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-600 transition mb-8"><ArrowLeft className="h-4 w-4" /> Back to PDF Tools</Link>
    <div className="text-center mb-10">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4 border border-emerald-500/20"><ShieldCheck className="h-4 w-4" /> Local Processing Only</div>
      <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">Add Image to PDF</h1>
      <p className="text-lg text-slate-600 dark:text-slate-400">Place a JPG, PNG, or WebP image on one selected PDF page.</p>
    </div>

    <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden mb-16">
      <div className="p-8 space-y-6">
        <div>
          <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">1. PDF document</p>
          {!pdfFile ? <button type="button" onClick={() => pdfInputRef.current?.click()} className="w-full p-7 border-2 border-dashed border-indigo-300 dark:border-indigo-500/30 rounded-2xl flex items-center justify-center gap-3 hover:bg-indigo-50 dark:hover:bg-indigo-500/5"><Upload className="h-6 w-6 text-indigo-500" /><span className="font-bold">Choose PDF</span></button> : <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60"><FileText className="h-7 w-7 text-indigo-500" /><div className="flex-1 min-w-0"><p className="font-bold truncate">{pdfFile.name}</p><p className="text-xs text-slate-500">{pageCount} pages</p></div><button type="button" onClick={() => { setPdfFile(null); setPageCount(0); }} aria-label="Remove PDF" className="p-2"><X className="h-5 w-5" /></button></div>}
          <input ref={pdfInputRef} type="file" accept="application/pdf" className="hidden" onChange={event => void selectPdf(event.target.files?.[0])} />
        </div>

        <div>
          <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">2. Image</p>
          {!imageFile ? <button type="button" onClick={() => imageInputRef.current?.click()} className="w-full p-7 border-2 border-dashed border-indigo-300 dark:border-indigo-500/30 rounded-2xl flex items-center justify-center gap-3 hover:bg-indigo-50 dark:hover:bg-indigo-500/5"><FileImage className="h-6 w-6 text-indigo-500" /><span className="font-bold">Choose JPG, PNG, or WebP</span></button> : <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60"><FileImage className="h-7 w-7 text-indigo-500" /><p className="font-bold flex-1 min-w-0 truncate">{imageFile.name}</p><button type="button" onClick={() => setImageFile(null)} aria-label="Remove image" className="p-2"><X className="h-5 w-5" /></button></div>}
          <input ref={imageInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={event => selectImage(event.target.files?.[0])} />
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Target page<input type="number" min={1} max={Math.max(1, pageCount)} value={targetPage} disabled={!pdfFile} onChange={event => setTargetPage(Math.min(Math.max(1, Number(event.target.value)), Math.max(1, pageCount)))} className="mt-2 w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" /></label>
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Image width<select value={widthPercent} onChange={event => setWidthPercent(Number(event.target.value))} className="mt-2 w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"><option value={15}>15% of page</option><option value={30}>30% of page</option><option value={50}>50% of page</option><option value={75}>75% of page</option></select></label>
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Position<select value={position} onChange={event => setPosition(event.target.value as Position)} className="mt-2 w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"><option value="center">Center</option><option value="top-left">Top left</option><option value="top-right">Top right</option><option value="bottom-left">Bottom left</option><option value="bottom-right">Bottom right</option></select></label>
        </div>

        {error && <p role="alert" className="text-sm font-medium text-red-600 dark:text-red-400">{error}</p>}
        <button type="button" onClick={addImage} disabled={!pdfFile || !imageFile || isProcessing} className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">{isProcessing ? <><Loader2 className="h-5 w-5 animate-spin" /> Adding image...</> : <><Download className="h-5 w-5" /> Add Image & Download</>}</button>
      </div>
    </section>
  </main>;
}
