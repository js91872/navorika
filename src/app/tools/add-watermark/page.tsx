'use client';

import { useState, useRef } from 'react';
import { FileText, ArrowLeft, Upload, X, ShieldCheck, Download, Loader2, Stamp } from 'lucide-react';
import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib';
import { tools } from '@/data/registry';

export default function AddWatermarkTool() {
  const meta = tools.find(t => t.slug === 'add-watermark');
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
  const [watermarkText, setWatermarkText] = useState<string>('CONFIDENTIAL');
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
      } catch (err) {
        alert("Failed to parse file. Ensure it is not encrypted with a password.");
        setFile(null);
      }
    }
  };

  const handleProcess = async () => {
    if (!file) return;
    
    setIsProcessing(true);
    try {
      const fileBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(fileBuffer);
      const pages = pdf.getPages();
      
      pages.forEach(page => {
        const { width, height } = page.getSize();
        page.drawText(watermarkText, {
          x: width / 2 - 50,
          y: height / 2,
          size: 40,
          color: rgb(0.8, 0.2, 0.2),
          opacity: 0.3,
          rotate: degrees(-45),
        });
      });

      const pdfBytes = await pdf.save();
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `watermarked_${file.name}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert("Failed to overlay watermark text onto the document stream.");
    }
    setIsProcessing(false);
  };

  // Default meta if not found

  return (
    <main className="max-w-4xl mx-auto px-6 py-12 lg:px-8">
      <a href="/categories/pdf-tools" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-600 transition mb-8">
        <ArrowLeft className="h-4 w-4" /> Back to PDF Tools
      </a>

      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4 border border-emerald-500/20">
          <ShieldCheck className="h-4 w-4" /> Local Processing Only
        </div>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">{toolMeta.heroTitle}</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">{toolMeta.heroDescription}</p>
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
              <p className="text-sm text-slate-500 mt-2">Securely overlay text across all pages</p>
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
                <p className="text-sm text-slate-500">{(file.size / 1024).toFixed(1)} KB • {pageCount} pages</p>
              </div>
              <button 
                onClick={() => { setFile(null); setPageCount(0); }}
                className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
              >
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                Watermark Text
              </label>
              <input
                type="text"
                value={watermarkText}
                onChange={(e) => setWatermarkText(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium outline-none focus:border-indigo-500"
                placeholder="Enter watermark text..."
              />
            </div>

            <button
              onClick={handleProcess}
              disabled={!watermarkText.trim() || isProcessing}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Stamp className="h-5 w-5" />
                  Add Watermark & Download
                </>
              )}
            </button>
          </div>
        )}
      </div>

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
