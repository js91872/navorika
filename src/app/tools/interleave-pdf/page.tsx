'use client';

import { useState, useRef } from 'react';
import { FileText, ArrowLeft, Upload, X, ShieldCheck, Download, Loader2, GitMerge } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import { tools } from '@/data/registry';

export default function InterleavePDFTool() {
  const meta = tools.find(t => t.slug === 'interleave-pdf');
  // Default meta if not found
  const toolMeta = meta || {
    heroTitle: "Interleave Pdf",
    heroDescription: "Process your PDF documents efficiently.",
    formulaExplanation: "This tool processes your PDF documents locally in your browser for maximum privacy and security.",
    faq: [
      { question: "How does this tool work?", answer: "All processing happens locally in your browser. No data is ever uploaded to any server." },
      { question: "Is my data safe?", answer: "Yes! Your files and data never leave your computer." },
      { question: "Do I need to install anything?", answer: "No installation needed. Everything runs directly in your web browser." }
    ]
  };

  const [fileA, setFileA] = useState<File | null>(null); // Odd Pages
  const [fileB, setFileB] = useState<File | null>(null); // Even Pages
  const [isProcessing, setIsProcessing] = useState(false);
  
  const fileRefA = useRef<HTMLInputElement>(null);
  const fileRefB = useRef<HTMLInputElement>(null);

  const processInterleave = async () => {
    if (!fileA || !fileB) return;
    setIsProcessing(true);
    try {
      const bufferA = await fileA.arrayBuffer();
      const bufferB = await fileB.arrayBuffer();
      
      const pdfA = await PDFDocument.load(bufferA);
      const pdfB = await PDFDocument.load(bufferB);
      const mergedPdf = await PDFDocument.create();

      const countA = pdfA.getPageCount();
      const countB = pdfB.getPageCount();
      const maxPages = Math.max(countA, countB);

      // Loop through arrays and weave dynamically
      for (let i = 0; i < maxPages; i++) {
        if (i < countA) {
          const [pageA] = await mergedPdf.copyPages(pdfA, [i]);
          mergedPdf.addPage(pageA);
        }
        if (i < countB) {
          const [pageB] = await mergedPdf.copyPages(pdfB, [i]);
          mergedPdf.addPage(pageB);
        }
      }

      const finalBytes = await mergedPdf.save();
      const blob = new Blob([finalBytes.buffer.buffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `Navorika_Interleaved_${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert("Failed to weave binary arrays.");
    }
    setIsProcessing(false);
  };

  if (!meta) return null;

  return (
    <main className="max-w-4xl mx-auto px-6 py-12 lg:px-8">
      <a href="/categories/pdf-tools" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-600 transition mb-8">
        <ArrowLeft className="h-4 w-4" /> Back to PDF Tools
      </a>
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4 border border-emerald-500/20">
          <ShieldCheck className="h-4 w-4" /> Array Weaving Engine
        </div>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">{toolMeta.heroTitle}</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">{toolMeta.heroDescription}</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden mb-16 p-8">
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          
          {/* File A Upload - Odd Pages */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">File 1 (Odd Pages)</label>
            {!fileA ? (
              <div onClick={() => fileRefA.current?.click()} className="border-2 border-dashed border-indigo-300 dark:border-indigo-500/30 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-500/5 transition-colors">
                <Upload className="h-6 w-6 text-indigo-500 mb-2" />
                <span className="text-sm font-bold text-slate-900 dark:text-white">Select File 1</span>
                <input type="file" accept="application/pdf" className="hidden" ref={fileRefA} onChange={(e) => e.target.files && setFileA(e.target.files[0])} />
              </div>
            ) : (
              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <span className="text-sm font-semibold truncate block w-48">{fileA.name}</span>
                <button onClick={() => setFileA(null)} className="p-2 text-slate-400 hover:text-red-500"><X className="h-4 w-4" /></button>
              </div>
            )}
          </div>

          {/* File B Upload - Even Pages */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">File 2 (Even Pages)</label>
            {!fileB ? (
              <div onClick={() => fileRefB.current?.click()} className="border-2 border-dashed border-indigo-300 dark:border-indigo-500/30 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-500/5 transition-colors">
                <Upload className="h-6 w-6 text-indigo-500 mb-2" />
                <span className="text-sm font-bold text-slate-900 dark:text-white">Select File 2</span>
                <input type="file" accept="application/pdf" className="hidden" ref={fileRefB} onChange={(e) => e.target.files && setFileB(e.target.files[0])} />
              </div>
            ) : (
              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <span className="text-sm font-semibold truncate block w-48">{fileB.name}</span>
                <button onClick={() => setFileB(null)} className="p-2 text-slate-400 hover:text-red-500"><X className="h-4 w-4" /></button>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end border-t border-slate-100 dark:border-slate-800 pt-6">
          <button onClick={processInterleave} disabled={isProcessing || !fileA || !fileB} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-bold transition shadow-md">
            {isProcessing ? <Loader2 className="h-5 w-5 animate-spin" /> : <GitMerge className="h-5 w-5" />}
            {isProcessing ? 'Weaving Arrays...' : 'Interleave Documents'}
          </button>
        </div>
      </div>
    </main>
  );
}
