'use client';

import { useState, useRef } from 'react';
import { FileText, ArrowLeft, Upload, X, ShieldCheck, Download, Loader2, CheckSquare, Square } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import { tools } from '@/data/registry';

export default function ExtractPDFPagesTool() {
  const meta = tools.find(t => t.slug === 'extract-pdf-pages');
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [selectedPages, setSelectedPages] = useState<boolean[]>([]); 
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (selected.type !== 'application/pdf') return;
      try {
        setFile(selected);
        const fileBuffer = await selected.arrayBuffer();
        const pdf = await PDFDocument.load(fileBuffer, { updateMetadata: false });
        const count = pdf.getPageCount();
        setPageCount(count);
        setSelectedPages(new Array(count).fill(false)); // Start with none selected
      } catch (err) {
        alert("Failed to map file indices.");
        setFile(null);
      }
    }
  };

  const togglePageSelection = (index: number) => {
    setSelectedPages(prev => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  const processExtraction = async () => {
    if (!file) return;
    
    const extractCount = selectedPages.filter(Boolean).length;
    if (extractCount === 0) {
      alert("Please select at least one page to extract.");
      return;
    }

    setIsProcessing(true);
    try {
      const fileBuffer = await file.arrayBuffer();
      const srcPdf = await PDFDocument.load(fileBuffer);
      const extractedPdf = await PDFDocument.create();

      const indicesToExtract: number[] = [];
      for (let i = 0; i < pageCount; i++) {
        if (selectedPages[i]) indicesToExtract.push(i);
      }

      const copiedPages = await extractedPdf.copyPages(srcPdf, indicesToExtract);
      copiedPages.forEach((page) => extractedPdf.addPage(page));

      const finalBytes = await extractedPdf.save();
      const blob = new Blob([finalBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `Navorika_Extracted_${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert("Extraction processing failed.");
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
          <ShieldCheck className="h-4 w-4" /> Visual Extraction Matrix
        </div>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">{meta.heroTitle}</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">{meta.heroDescription}</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden mb-16">
        {!file ? (
          <div className="p-8">
            <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-indigo-300 dark:border-indigo-500/30 rounded-2xl p-12 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-500/5 transition-colors">
              <Upload className="h-10 w-10 text-indigo-500 mb-4" />
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Select Document</h3>
              <input type="file" accept="application/pdf" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
            </div>
          </div>
        ) : (
          <div className="p-8">
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 mb-8">
              <div className="flex items-center gap-3 overflow-hidden">
                <FileText className="h-5 w-5 text-red-500 flex-shrink-0" />
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 truncate">{file.name}</span>
              </div>
              <button onClick={() => setFile(null)} className="p-2 text-slate-400 hover:text-red-500 transition-colors rounded-lg"><X className="h-4 w-4" /></button>
            </div>

            <span className="block text-xs font-bold tracking-wider uppercase text-slate-400 mb-4">
              Select Pages to Extract ({selectedPages.filter(Boolean).length} marked)
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-h-80 overflow-y-auto p-2 border border-slate-100 dark:border-slate-800 rounded-2xl mb-8">
              {selectedPages.map((isSelected, index) => (
                <button 
                  key={index}
                  onClick={() => togglePageSelection(index)}
                  className={`p-4 rounded-xl border text-left flex flex-col justify-between gap-4 transition-all ${
                    isSelected ? 'border-indigo-500 bg-indigo-500/5 dark:bg-indigo-500/10' : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs font-bold text-slate-400">Page {index + 1}</span>
                    {isSelected ? <CheckSquare className="h-4 w-4 text-indigo-500" /> : <Square className="h-4 w-4 text-slate-300" />}
                  </div>
                  <div className={`h-12 w-9 rounded border flex items-center justify-center self-center ${
                    isSelected ? 'border-indigo-300 bg-indigo-100/50 text-indigo-400' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800'
                  }`}>
                    <FileText className="h-4 w-4" />
                  </div>
                </button>
              ))}
            </div>

            <div className="flex justify-end border-t border-slate-100 dark:border-slate-800 pt-6">
              <button onClick={processExtraction} disabled={isProcessing || selectedPages.filter(Boolean).length === 0} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-bold transition shadow-md">
                {isProcessing ? <Loader2 className="h-5 w-5 animate-spin" /> : <Download className="h-5 w-5" />}
                {isProcessing ? 'Isolating Pages...' : 'Extract & Download'}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
