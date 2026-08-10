'use client';

import { useState, useRef } from 'react';
import Link from 'next/navigation';
import { FileText, ArrowLeft, Upload, File, X, ShieldCheck, Download, Loader2, RefreshCw } from 'lucide-react';
import { PDFDocument, degrees } from 'pdf-lib';
import { tools } from '@/data/registry';

export default function RotatePDFTool() {
  // Default meta if not found

  const meta = tools.find(t => t.slug === 'rotate-pdf');
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
  const [rotations, setRotations] = useState<number[]>([]); // Array tracking orientation degree multipliers per page index
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
        // Initialize all pages at 0 degrees additional rotation
        setRotations(new Array(count).fill(0));
      } catch (err) {
        alert("Could not parse file bytes. Ensure document is unencrypted.");
        setFile(null);
      }
    }
  };

  const rotateIndividualPage = (index: number) => {
    setRotations(prev => {
      const next = [...prev];
      next[index] = (next[index] + 90) % 360;
      return next;
    });
  };

  const rotateAllGlobal = (deg: number) => {
    setRotations(new Array(pageCount).fill(deg));
  };

  const processRotation = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const fileBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(fileBuffer);
      const pages = pdf.getPages();

      pages.forEach((page, index) => {
        const currentRotation = page.getRotation().angle;
        const additionalRotation = rotations[index];
        page.setRotation(degrees((currentRotation + additionalRotation) % 360));
      });

      const rotatedBytes = await pdf.save();
      const blob = new Blob([rotatedBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `Navorika_Rotated_${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Rotation failure:", error);
      alert("Failed to modify page dictionaries.");
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
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Select PDF File to Rotate</h3>
              <p className="text-sm text-slate-500 mt-2">Instant layout orientation adjustments</p>
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
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 mb-8">
              <div className="flex items-center gap-3 overflow-hidden">
                <FileText className="h-5 w-5 text-red-500 flex-shrink-0" />
                <div>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 truncate block">{file.name}</span>
                  <span className="text-xs text-slate-400 font-bold block">{pageCount} Pages loaded</span>
                </div>
              </div>
              <button onClick={() => setFile(null)} className="p-2 text-slate-400 hover:text-red-500 transition-colors rounded-lg">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Macro Global Control Station */}
            <div className="mb-8 p-4 bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 rounded-2xl">
              <span className="block text-xs font-bold tracking-wider uppercase text-slate-400 mb-3">Rotate Entire Document</span>
              <div className="flex flex-wrap gap-3">
                <button onClick={() => rotateAllGlobal(90)} className="px-4 py-2 text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-indigo-500 flex items-center gap-1.5"><RefreshCw className="h-3 w-3" /> +90° Clockwise</button>
                <button onClick={() => rotateAllGlobal(180)} className="px-4 py-2 text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-indigo-500 flex items-center gap-1.5"><RefreshCw className="h-3 w-3" /> 180° Flip</button>
                <button onClick={() => rotateAllGlobal(270)} className="px-4 py-2 text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-indigo-500 flex items-center gap-1.5"><RefreshCw className="h-3 w-3" /> -90° Counter</button>
              </div>
            </div>

            {/* Micro Layout Grid Matrix View */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-h-80 overflow-y-auto p-2 border border-slate-100 dark:border-slate-800 rounded-2xl mb-8">
              {rotations.map((rotationAngle, index) => (
                <div key={index} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 text-center flex flex-col items-center justify-between gap-3">
                  <span className="text-xs font-bold text-slate-400">Page {index + 1}</span>
                  <div 
                    style={{ transform: `rotate(${rotationAngle}deg)` }} 
                    className="h-16 w-12 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded flex items-center justify-center transition-transform duration-200"
                  >
                    <FileText className="h-6 w-6 text-slate-400" />
                  </div>
                  <button 
                    onClick={() => rotateIndividualPage(index)}
                    className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-500/5 border border-indigo-500/10 hover:bg-indigo-500/10"
                  >
                    <RefreshCw className="h-3 w-3" /> +90°
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-end border-t border-slate-100 dark:border-slate-800 pt-6">
              <button 
                onClick={processRotation}
                disabled={isProcessing}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md"
              >
                {isProcessing ? <Loader2 className="h-5 w-5 animate-spin" /> : <Download className="h-5 w-5" />}
                {isProcessing ? 'Applying Orientations...' : 'Save & Download'}
              </button>
            </div>
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
