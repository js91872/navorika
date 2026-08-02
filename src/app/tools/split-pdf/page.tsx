'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { FileText, ArrowLeft, Upload, File, X, ShieldCheck, Download, Loader2, Scissors } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import { tools } from '@/data/registry';

export default function SplitPDFTool() {
  // Default meta if not found

  const meta = tools.find(t => t.slug === 'split-pdf');
  // Default meta if not found - defined AFTER finding meta
  const toolMeta = meta || {
    heroTitle: 'Tool',
    heroDescription: 'Process your documents efficiently.',
    formulaExplanation: 'This tool processes your documents locally in your browser.',
    faq: [
      { question: 'How does this tool work?', answer: 'All processing happens locally in your browser. No data is ever uploaded to any server.' },
      { question: 'Is my data safe?', answer: 'Yes! Your files and data never leave your computer.' },
      { question: 'Do I need to install anything?', answer: 'No installation needed. Everything runs directly in your web browser.' }
    ]
  };
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [pageRange, setPageRange] = useState<string>('');
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
        setPageCount(pdf.getPageCount());
        setPageRange(`1-${pdf.getPageCount()}`);
      } catch (err) {
        alert("Could not read PDF structure. It might be encrypted.");
        setFile(null);
      }
    }
  };

  const processSplit = async () => {
    if (!file || !pageRange) return;
    setIsProcessing(true);
    try {
      const fileBuffer = await file.arrayBuffer();
      const srcPdf = await PDFDocument.load(fileBuffer);
      const splitPdf = await PDFDocument.create();

      // Parse range input (e.g. 1-3 or 2)
      const pagesToExtract: number[] = [];
      if (pageRange.includes('-')) {
        const [start, end] = pageRange.split('-').map(Number);
        for (let i = start; i <= end; i++) {
          if (i >= 1 && i <= pageCount) pagesToExtract.push(i - 1);
        }
      } else {
        const pageNum = Number(pageRange);
        if (pageNum >= 1 && pageNum <= pageCount) pagesToExtract.push(pageNum - 1);
      }

      if (pagesToExtract.length === 0) {
        alert("Invalid page selection range.");
        setIsProcessing(false);
        return;
      }

      const copiedPages = await splitPdf.copyPages(srcPdf, pagesToExtract);
      copiedPages.forEach((page) => splitPdf.addPage(page));

      const splitPdfFile = await splitPdf.save();
      const blob = new Blob([splitPdfFile], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `Navorika_Split_${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Split failed:", error);
      alert("Failed to extract pages. Verify selection criteria.");
    }
    setIsProcessing(false);
  };

  if (!meta) return null;

  return (
    <main className="max-w-4xl mx-auto px-6 py-12 lg:px-8">
      <Link href="/categories/pdf-tools" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-600 transition mb-8">
        <ArrowLeft className="h-4 w-4" /> Back to PDF Tools
      </Link>

      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4 border border-emerald-500/20">
          <ShieldCheck className="h-4 w-4" /> Local Processing Only
        </div>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">{toolMeta.heroTitle}</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">{toolMeta.heroDescription}</p>
      </div>

      {/* App Workspace */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden mb-16">
        
        {/* Drop Zone */}
        {!file ? (
          <div className="p-8">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-indigo-300 dark:border-indigo-500/30 rounded-2xl p-12 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-500/5 transition-colors"
            >
              <Upload className="h-10 w-10 text-indigo-500 mb-4" />
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Select PDF File to Split</h3>
              <p className="text-sm text-slate-500 mt-2">Max pages unlimited — completely dynamic parsing</p>
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
          /* Parameter Configuration Hub */
          <div className="p-8">
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 mb-6">
              <div className="flex items-center gap-3 overflow-hidden">
                <FileText className="h-5 w-5 text-red-500 flex-shrink-0" />
                <div>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 truncate block">{file.name}</span>
                  <span className="text-xs text-slate-400 font-bold block">{pageCount} Pages detected</span>
                </div>
              </div>
              <button onClick={() => setFile(null)} className="p-2 text-slate-400 hover:text-red-500 transition-colors rounded-lg">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="max-w-md mb-8">
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Specify Page Range Extraction
              </label>
              <div className="flex gap-3">
                <input 
                  type="text" 
                  value={pageRange}
                  onChange={(e) => setPageRange(e.target.value)}
                  placeholder="e.g. 1-3 or 5"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-indigo-500 font-semibold"
                />
              </div>
              <p className="text-xs text-slate-400 mt-1">Format: Enter a single number or dash notation bounds.</p>
            </div>

            <div className="flex justify-end border-t border-slate-100 dark:border-slate-800 pt-6">
              <button 
                onClick={processSplit}
                disabled={isProcessing}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md"
              >
                {isProcessing ? <Loader2 className="h-5 w-5 animate-spin" /> : <Scissors className="h-5 w-5" />}
                {isProcessing ? 'Extracting Pages...' : 'Split & Download'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* SEO Information Infrastructure */}
      <div className="prose prose-slate dark:prose-invert max-w-none">
        <h2 className="text-2xl font-bold mb-4">How it Works</h2>
        <p>{toolMeta.formulaExplanation}</p>
        <h3 className="text-xl font-bold mt-8 mb-4">Frequently Asked Questions</h3>
        <div className="space-y-4">
          {toolMeta.faq && toolMeta.faq.map((item, i) => (
            <div key={i} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <h4 className="font-bold text-slate-900 dark:text-white mb-2">{item.question}</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 m-0">{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
