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

  return (
    <div className="pb-16 pt-8 text-[#18181b] dark:text-[#f4f4f5]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/categories/pdf-tools" className="inline-flex items-center gap-2 text-sm font-semibold text-[#5b5b63] dark:text-[#a1a1aa] hover:text-[#e5322d] dark:hover:text-[#ff6b68] transition mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to PDF Tools
        </Link>
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold mb-3 border border-emerald-500/20">
            <ShieldCheck className="h-3.5 w-3.5" /> Runs in your browser — files stay on your device
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#18181b] dark:text-white tracking-tight mb-2">Compress PDF Online</h1>
          <p className="text-base text-[#5b5b63] dark:text-[#a1a1aa] max-w-2xl leading-relaxed">Reduce the size of scanned or image-heavy PDFs in your browser, then compare file sizes before downloading.</p>
        </div>

        <section className="bg-white dark:bg-[#18181b] rounded-xl border border-[#e4e4e8] dark:border-[#27272a] shadow-xs overflow-hidden mb-12">
          <div className="p-6 sm:p-8">
            {!file ? (
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={isProcessing}
                className="w-full border-2 border-dashed border-[#e4e4e8] dark:border-[#27272a] hover:border-[#e5322d] dark:hover:border-[#e5322d] rounded-xl p-10 flex flex-col items-center justify-center text-center hover:bg-[#fff1f1]/30 dark:hover:bg-[#e5322d]/5 transition-colors disabled:opacity-50"
              >
                <div className="grid size-12 place-items-center rounded-xl bg-[#fff1f1] dark:bg-[#e5322d]/10 text-[#e5322d] mb-3">
                  <Upload className="h-6 w-6" />
                </div>
                <span className="text-base font-bold text-[#18181b] dark:text-white">Choose PDF File</span>
                <span className="text-xs text-[#5b5b63] dark:text-[#a1a1aa] mt-1">Best suited to scanned or image-heavy PDFs</span>
              </button>
            ) : (
              <>
                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#f7f7f8] dark:bg-[#202023] border border-[#e4e4e8] dark:border-[#27272a]">
                  <FileText className="h-6 w-6 text-[#e5322d] shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate text-[#18181b] dark:text-white">{file.name}</p>
                    <p className="text-xs text-[#5b5b63] dark:text-[#a1a1aa]">{pageCount} pages · {formatBytes(file.size)}</p>
                  </div>
                  <button type="button" onClick={() => { setFile(null); setPageCount(0); clearResult(); }} aria-label="Remove PDF" className="p-1.5 text-[#5b5b63] hover:text-[#e5322d] transition-colors rounded-lg">
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#5b5b63] dark:text-[#a1a1aa] mb-2">Compression level</p>
                  <div className="grid sm:grid-cols-3 gap-2.5">
                    {(Object.keys(settings) as CompressionLevel[]).map(option => (
                      <button
                        type="button"
                        key={option}
                        onClick={() => { setLevel(option); clearResult(); }}
                        className={`p-3 rounded-xl border text-sm font-semibold transition-all ${level === option ? 'border-[#e5322d] bg-[#fff1f1] dark:bg-[#e5322d]/15 text-[#e5322d]' : 'border-[#e4e4e8] dark:border-[#27272a] text-[#18181b] dark:text-white hover:border-[#e5322d]/40'}`}
                      >
                        {settings[option].label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-5 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-2.5">
                  <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-[#5b5b63] dark:text-[#a1a1aa] leading-relaxed">Lossy raster compression rasterizes pages to shrink file size. Text becomes part of images and forms/signatures are flattened. Always keep your original.</p>
                </div>

                <button
                  type="button"
                  onClick={compress}
                  disabled={isProcessing}
                  className="mt-5 w-full py-3 bg-[#e5322d] hover:bg-[#c71f1e] text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50 shadow-xs"
                >
                  {isProcessing ? <><Loader2 className="h-4 w-4 animate-spin" /> Compressing {pageCount} pages...</> : 'Compress PDF'}
                </button>

                {resultUrl && (
                  <div className={`mt-5 p-4 rounded-xl border ${reduction > 0 ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-amber-500/10 border-amber-500/20'}`}>
                    <p className="font-bold text-sm text-[#18181b] dark:text-white">Original: {formatBytes(file.size)} → Output: {formatBytes(resultSize)}</p>
                    <p className="text-xs text-[#5b5b63] dark:text-[#a1a1aa] mt-1">{reduction > 0 ? `${reduction}% smaller` : `${Math.abs(reduction)}% larger. This document does not benefit from raster compression.`}</p>
                    <a
                      href={resultUrl}
                      download={`compressed_${file.name}`}
                      className="mt-3.5 w-full py-2.5 bg-[#18181b] hover:bg-black dark:bg-white dark:hover:bg-slate-100 text-white dark:text-[#18181b] font-semibold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 transition-colors shadow-xs"
                    >
                      <Download className="h-4 w-4" /> Download Compressed PDF
                    </a>
                  </div>
                )}
              </>
            )}
            <input ref={inputRef} type="file" accept="application/pdf" className="hidden" onChange={event => void selectFile(event.target.files?.[0])} />
            {error && <p role="alert" className="mt-3 text-xs font-medium text-[#e5322d]">{error}</p>}
          </div>
        </section>
      </div>
    </div>
  );
}
