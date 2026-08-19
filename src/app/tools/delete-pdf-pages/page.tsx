'use client';

import { useState, useRef } from 'react';
import { FileText, ArrowLeft, Upload, X, ShieldCheck, Download, Loader2, Trash2, CheckSquare, Square } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import { tools } from '@/data/registry';

export default function DeletePDFPagesTool() {
  // Default meta if not found

  const meta = tools.find(t => t.slug === 'delete-pdf-pages');
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
  const [selectedPages, setSelectedPages] = useState<boolean[]>([]); // Array tracking indices to delete (true = delete)
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
        // Initialize all pages as NOT selected for deletion (false)
        setSelectedPages(new Array(count).fill(false));
      } catch (err) {
        alert("Failed to compile file indices. Document might be security locked.");
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

  const processDeletion = async () => {
    if (!file) return;
    
    const deleteCount = selectedPages.filter(Boolean).length;
    if (deleteCount === pageCount) {
      alert("Cannot delete all pages. The resulting document must contain at least 1 page.");
      return;
    }
    if (deleteCount === 0) {
      alert("Please select at least one page to remove.");
      return;
    }

    setIsProcessing(true);
    try {
      const fileBuffer = await file.arrayBuffer();
      const srcPdf = await PDFDocument.load(fileBuffer);
      const cleanPdf = await PDFDocument.create();

      // Collect all page indices that were NOT marked for deletion
      const indicesToKeep: number[] = [];
      for (let i = 0; i < pageCount; i++) {
        if (!selectedPages[i]) {
          indicesToKeep.push(i);
        }
      }

      const copiedPages = await cleanPdf.copyPages(srcPdf, indicesToKeep);
      copiedPages.forEach((page) => cleanPdf.addPage(page));

      const finalBytes = await cleanPdf.save();
      const blob = new Blob([finalBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `Navorika_Optimized_${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Purge operations failed:", error);
      alert("Failed to process document restructuring layout arrays.");
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
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Select PDF File</h3>
              <p className="text-sm text-slate-500 mt-2">Prune layout components instantly</p>
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

            <span className="block text-xs font-bold tracking-wider uppercase text-slate-400 mb-4">
              Select Pages to Permanently Delete ({selectedPages.filter(Boolean).length} marked)
            </span>

            {/* Selection Array Container */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-h-80 overflow-y-auto p-2 border border-slate-100 dark:border-slate-800 rounded-2xl mb-8">
              {selectedPages.map((isMarkedForDeletion, index) => (
                <button 
                  key={index}
                  onClick={() => togglePageSelection(index)}
                  className={`p-4 rounded-xl border text-left flex flex-col justify-between gap-4 transition-all ${
                    isMarkedForDeletion 
                      ? 'border-red-500/40 bg-red-500/5 dark:bg-red-500/10' 
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs font-bold text-slate-400">Page {index + 1}</span>
                    {isMarkedForDeletion ? (
                      <CheckSquare className="h-4 w-4 text-red-500" />
                    ) : (
                      <Square className="h-4 w-4 text-slate-300 dark:text-slate-700" />
                    )}
                  </div>
                  <div className={`h-12 w-9 rounded border flex items-center justify-center self-center ${
                    isMarkedForDeletion ? 'border-red-300 bg-red-100/50 text-red-400' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800'
                  }`}>
                    <FileText className="h-4 w-4" />
                  </div>
                  <span className={`text-[10px] font-bold uppercase self-center ${isMarkedForDeletion ? 'text-red-500' : 'text-slate-400'}`}>
                    {isMarkedForDeletion ? 'Delete' : 'Keep'}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex justify-end border-t border-slate-100 dark:border-slate-800 pt-6">
              <button 
                onClick={processDeletion}
                disabled={isProcessing || selectedPages.filter(Boolean).length === 0}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md"
              >
                {isProcessing ? <Loader2 className="h-5 w-5 animate-spin" /> : <Trash2 className="h-5 w-5" />}
                {isProcessing ? 'Removing Pages...' : 'Purge Pages & Download'}
              </button>
            </div>
          </div>
        )}
      </div>

    </main>
  );
}
