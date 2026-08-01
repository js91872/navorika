'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { FileText, ArrowLeft, Upload, File, X, ShieldCheck, Download, Loader2 } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import { tools } from '@/data/registry';

export default function MergePDFTool() {
  const meta = tools.find(t => t.slug === 'merge-pdf');
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selected = Array.from(e.target.files).filter(f => f.type === 'application/pdf');
      setFiles(prev => [...prev, ...selected]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const processMerge = async () => {
    if (files.length < 2) return;
    setIsProcessing(true);
    try {
      const mergedPdf = await PDFDocument.create();
      
      for (const file of files) {
        const fileBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(fileBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedPdfFile = await mergedPdf.save();
      const blob = new Blob([mergedPdfFile], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `Navorika_Merged_${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Merge failed:", error);
      alert("Failed to merge documents. Ensure they are valid PDFs and not password protected.");
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
        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">{meta.heroTitle}</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">{meta.heroDescription}</p>
      </div>

      {/* App Workspace */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden mb-16">
        
        {/* Upload Zone */}
        <div className="p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-indigo-300 dark:border-indigo-500/30 rounded-2xl p-12 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-500/5 transition-colors"
          >
            <Upload className="h-10 w-10 text-indigo-500 mb-4" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Select PDF Files</h3>
            <p className="text-sm text-slate-500 mt-2">or drag and drop them here</p>
            <input 
              type="file" 
              multiple 
              accept="application/pdf" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleFileChange}
            />
          </div>
        </div>

        {/* File Queue */}
        {files.length > 0 && (
          <div className="p-6">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Files in Queue ({files.length})</h4>
            <div className="space-y-3 mb-6">
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <File className="h-5 w-5 text-red-500 flex-shrink-0" />
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 truncate">{file.name}</span>
                  </div>
                  <button onClick={() => removeFile(index)} className="p-2 text-slate-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <button 
                onClick={processMerge}
                disabled={files.length < 2 || isProcessing}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-800 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md"
              >
                {isProcessing ? <Loader2 className="h-5 w-5 animate-spin" /> : <Download className="h-5 w-5" />}
                {isProcessing ? 'Merging Documents...' : 'Merge & Download'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* SEO & FAQ Data */}
      <div className="prose prose-slate dark:prose-invert max-w-none">
        <h2 className="text-2xl font-bold mb-4">How it Works</h2>
        <p>{meta.formulaExplanation}</p>
        <h3 className="text-xl font-bold mt-8 mb-4">Frequently Asked Questions</h3>
        <div className="space-y-4">
          {meta.faq.map((item, i) => (
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
