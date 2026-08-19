'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowDown, ArrowLeft, ArrowUp, Download, FileImage, Loader2, ShieldCheck, Upload, X } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import { decodeWebpToPng } from '@/lib/images/browser';

type Props = { accept: string; description: string; title: string };
const supportedTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);

export default function ImageToPdfTool({ accept, description, title }: Props) {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = (selected: FileList | null) => {
    if (!selected) return;
    const images = Array.from(selected);
    if (images.some(file => !supportedTypes.has(file.type))) {
      setError('Use JPG, PNG, or WebP images only.');
      return;
    }
    setFiles(current => [...current, ...images]);
    setError('');
    if (inputRef.current) inputRef.current.value = '';
  };

  const moveFile = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= files.length) return;
    setFiles(current => {
      const updated = [...current];
      [updated[index], updated[target]] = [updated[target], updated[index]];
      return updated;
    });
  };

  const createPdf = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    setError('');
    try {
      const pdf = await PDFDocument.create();
      for (const file of files) {
        const bytes = file.type === 'image/webp' ? await decodeWebpToPng(file) : await file.arrayBuffer();
        const image = file.type === 'image/jpeg' ? await pdf.embedJpg(bytes) : await pdf.embedPng(bytes);
        const page = pdf.addPage([image.width, image.height]);
        page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
      }
      const bytes = await pdf.save({ useObjectStreams: true });
      const blob = new Blob([bytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = files.length === 1 ? `${files[0].name.replace(/\.[^.]+$/, '')}.pdf` : 'images.pdf';
      anchor.click();
      URL.revokeObjectURL(url);
    } catch {
      setError('The PDF could not be created. An image may be damaged, too large, or use unsupported encoding.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main className="max-w-4xl mx-auto px-6 py-12 lg:px-8">
      <Link href="/categories/pdf-tools" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-600 transition mb-8"><ArrowLeft className="h-4 w-4" /> Back to PDF Tools</Link>
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4 border border-emerald-500/20"><ShieldCheck className="h-4 w-4" /> Local Processing Only</div>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">{title}</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">{description}</p>
      </div>
      <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden mb-16">
        <div className="p-8">
          <button type="button" onClick={() => inputRef.current?.click()} className="w-full border-2 border-dashed border-indigo-300 dark:border-indigo-500/30 rounded-2xl p-10 flex flex-col items-center justify-center text-center hover:bg-indigo-50 dark:hover:bg-indigo-500/5 transition-colors">
            <Upload className="h-10 w-10 text-indigo-500 mb-4" /><span className="text-xl font-bold text-slate-900 dark:text-white">Choose images</span><span className="text-sm text-slate-500 mt-2">Each image becomes one PDF page</span>
          </button>
          <input ref={inputRef} type="file" accept={accept} multiple className="hidden" onChange={event => addFiles(event.target.files)} />
          {files.length > 0 && <div className="mt-6 space-y-3">
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">PDF page order</p>
            {files.map((file, index) => <div key={`${file.name}-${file.lastModified}-${index}`} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <FileImage className="h-6 w-6 text-indigo-500 shrink-0" /><div className="min-w-0 flex-1"><p className="font-semibold text-slate-900 dark:text-white truncate">{index + 1}. {file.name}</p><p className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB</p></div>
              <button type="button" onClick={() => moveFile(index, -1)} disabled={index === 0} aria-label={`Move ${file.name} earlier`} className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-30"><ArrowUp className="h-4 w-4" /></button>
              <button type="button" onClick={() => moveFile(index, 1)} disabled={index === files.length - 1} aria-label={`Move ${file.name} later`} className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-30"><ArrowDown className="h-4 w-4" /></button>
              <button type="button" onClick={() => setFiles(current => current.filter((_, fileIndex) => fileIndex !== index))} aria-label={`Remove ${file.name}`} className="p-2 rounded-lg border border-slate-200 dark:border-slate-700"><X className="h-4 w-4" /></button>
            </div>)}
          </div>}
          {error && <p role="alert" className="mt-4 text-sm font-medium text-red-600 dark:text-red-400">{error}</p>}
          <button type="button" onClick={createPdf} disabled={files.length === 0 || isProcessing} className="mt-6 w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
            {isProcessing ? <><Loader2 className="h-5 w-5 animate-spin" /> Creating PDF...</> : <><Download className="h-5 w-5" /> Create & Download PDF</>}
          </button>
        </div>
      </section>
    </main>
  );
}
