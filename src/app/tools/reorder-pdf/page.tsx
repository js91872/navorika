'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { ArrowDown, ArrowLeft, ArrowUp, Loader2, FileText, ShieldCheck, Upload, X, MoveVertical } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

export default function ReorderPDFTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pageOrder, setPageOrder] = useState<number[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (selected.type !== 'application/pdf') {
        setError('Please select a PDF file.');
        return;
      }

      try {
        const fileBuffer = await selected.arrayBuffer();
        const pdf = await PDFDocument.load(fileBuffer);
        setFile(selected);
        setPageOrder(Array.from({ length: pdf.getPageCount() }, (_, i) => i));
        setError('');
      } catch {
        setFile(null);
        setPageOrder([]);
        setError('This PDF could not be opened. It may be damaged or password-protected.');
      }
    }
  };

  const movePage = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= pageOrder.length) return;
    setPageOrder(current => {
      const updated = [...current];
      [updated[index], updated[target]] = [updated[target], updated[index]];
      return updated;
    });
  };

  const handleProcess = async () => {
    if (!file) return;
    setIsProcessing(true);
    setError('');

    try {
      const fileBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(fileBuffer);
      const newPdf = await PDFDocument.create();
      
      // Copy pages in new order (or original order if not reordered)
      const order = pageOrder.length > 0 ? pageOrder : Array.from({ length: pdf.getPageCount() }, (_, i) => i);
      for (const originalIndex of order) {
        const [page] = await newPdf.copyPages(pdf, [originalIndex]);
        newPdf.addPage(page);
      }

      const finalBytes = await newPdf.save();
      const blob = new Blob([finalBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `reordered_${file.name}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setError('The reordered PDF could not be created. Try another readable, unencrypted PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main className="max-w-4xl mx-auto px-6 py-12 lg:px-8">
      <Link href="/categories/pdf-tools" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-600 transition mb-8">
        <ArrowLeft className="h-4 w-4" /> Back to PDF Tools
      </Link>

      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4 border border-emerald-500/20">
          <ShieldCheck className="h-4 w-4" /> Local Processing Only
        </div>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">Reorder PDF Pages</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">Reorder pages in your PDF documents.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden mb-16">
        {!file ? (
          <div className="p-8">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-indigo-300 dark:border-indigo-500/30 rounded-2xl p-12 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-500/5 transition-colors"
            >
              <Upload className="h-10 w-10 text-indigo-500 mb-4" />
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Select PDF Document</h3>
              <p className="text-sm text-slate-500 mt-2">Choose a PDF, then move pages into the order you need</p>
              <input 
                type="file" 
                accept="application/pdf" 
                className="hidden" 
                ref={fileInputRef}
                onChange={handleFileChange}
              />
            </div>
          </div>
        ) : (
          <div className="p-8">
            <div className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-800/30 rounded-xl mb-6">
              <FileText className="h-8 w-8 text-indigo-500 shrink-0" />
              <div className="flex-1">
                <p className="font-bold text-slate-900 dark:text-white">{file.name}</p>
                <p className="text-sm text-slate-500">{(file.size / 1024).toFixed(1)} KB • {pageOrder.length} pages</p>
              </div>
              <button 
                onClick={() => { setFile(null); setPageOrder([]); setError(''); }}
                aria-label="Remove selected PDF"
                className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
              >
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>

            {pageOrder.length > 0 && (
              <div className="mb-6">
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-4">
                  Page order: {pageOrder.map(p => p + 1).join(' → ')}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {pageOrder.map((page, index) => (
                    <div
                      key={page}
                      className="p-3 border-2 border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800"
                    >
                      <p className="text-center text-sm font-bold text-slate-900 dark:text-white mb-2">Page {page + 1}</p>
                      <div className="flex justify-center gap-2">
                        <button type="button" onClick={() => movePage(index, -1)} disabled={index === 0} aria-label={`Move page ${page + 1} earlier`} className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 disabled:opacity-30 hover:border-indigo-400">
                          <ArrowUp className="h-4 w-4" />
                        </button>
                        <button type="button" onClick={() => movePage(index, 1)} disabled={index === pageOrder.length - 1} aria-label={`Move page ${page + 1} later`} className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 disabled:opacity-30 hover:border-indigo-400">
                          <ArrowDown className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {error && <p role="alert" className="mb-4 text-sm font-medium text-red-600 dark:text-red-400">{error}</p>}

            <button
              onClick={handleProcess}
              disabled={isProcessing || pageOrder.length === 0}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <MoveVertical className="h-5 w-5" />
                  Reorder & Download
                </>
              )}
            </button>
          </div>
        )}
      </div>

    </main>
  );
}
