'use client';

import { useState, useRef } from 'react';
import { FileText, ArrowLeft, Upload, X, ShieldCheck, Download, Loader2, GripHorizontal } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import { tools } from '@/data/registry';

export default function ReorderPDFTool() {
  const meta = tools.find(t => t.slug === 'reorder-pdf');
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<number[]>([]); // Tracks original indices
  const [isProcessing, setIsProcessing] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (selected.type !== 'application/pdf') return;
      try {
        setFile(selected);
        const fileBuffer = await selected.arrayBuffer();
        const pdf = await PDFDocument.load(fileBuffer, { updateMetadata: false });
        const count = pdf.getPageCount();
        setPages(Array.from({ length: count }, (_, i) => i)); // Init [0, 1, 2, ...]
      } catch (err) {
        alert("Failed to compile file indices.");
        setFile(null);
      }
    }
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    dragItem.current = index;
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnter = (e: React.DragEvent, index: number) => {
    dragOverItem.current = index;
  };

  const handleDragEnd = () => {
    if (dragItem.current !== null && dragOverItem.current !== null) {
      const newPages = [...pages];
      const draggedContent = newPages.splice(dragItem.current, 1)[0];
      newPages.splice(dragOverItem.current, 0, draggedContent);
      setPages(newPages);
    }
    dragItem.current = null;
    dragOverItem.current = null;
  };

  const processReorder = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const fileBuffer = await file.arrayBuffer();
      const srcPdf = await PDFDocument.load(fileBuffer);
      const reorderedPdf = await PDFDocument.create();

      const copiedPages = await reorderedPdf.copyPages(srcPdf, pages);
      copiedPages.forEach((page) => reorderedPdf.addPage(page));

      const finalBytes = await reorderedPdf.save();
      const blob = new Blob([finalBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `Navorika_Reordered_${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert("Failed to rebuild document structure array.");
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
          <ShieldCheck className="h-4 w-4" /> Interactive Array Mapping
        </div>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">{meta.heroTitle}</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">{meta.heroDescription}</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden mb-16">
        {!file ? (
          <div className="p-8">
            <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-indigo-300 dark:border-indigo-500/30 rounded-2xl p-12 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-500/5 transition-colors">
              <Upload className="h-10 w-10 text-indigo-500 mb-4" />
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Select PDF File</h3>
              <p className="text-sm text-slate-500 mt-2">Visually arrange sequence metrics instantly</p>
              <input type="file" accept="application/pdf" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
            </div>
          </div>
        ) : (
          <div className="p-8">
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 mb-6">
              <div className="flex items-center gap-3 overflow-hidden">
                <FileText className="h-5 w-5 text-red-500 flex-shrink-0" />
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 truncate">{file.name}</span>
              </div>
              <button onClick={() => setFile(null)} className="p-2 text-slate-400 hover:text-red-500 transition-colors rounded-lg"><X className="h-4 w-4" /></button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-h-96 overflow-y-auto p-4 border border-slate-100 dark:border-slate-800 rounded-2xl mb-8 bg-slate-50/50 dark:bg-slate-900/50">
              {pages.map((originalIndex, currentIndex) => (
                <div 
                  key={`${originalIndex}-${currentIndex}`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, currentIndex)}
                  onDragEnter={(e) => handleDragEnter(e, currentIndex)}
                  onDragEnd={handleDragEnd}
                  onDragOver={(e) => e.preventDefault()}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex flex-col items-center gap-2 cursor-grab active:cursor-grabbing hover:border-indigo-500 hover:shadow-md transition-all"
                >
                  <GripHorizontal className="h-4 w-4 text-slate-400 mb-2" />
                  <div className="h-16 w-12 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 rounded flex items-center justify-center">
                    <span className="text-xs font-bold text-slate-400">{originalIndex + 1}</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mt-2">Orig Page {originalIndex + 1}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-end border-t border-slate-100 dark:border-slate-800 pt-6">
              <button onClick={processReorder} disabled={isProcessing} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition shadow-md">
                {isProcessing ? <Loader2 className="h-5 w-5 animate-spin" /> : <Download className="h-5 w-5" />}
                {isProcessing ? 'Re-compiling Stream Nodes...' : 'Apply Sequence & Download'}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
