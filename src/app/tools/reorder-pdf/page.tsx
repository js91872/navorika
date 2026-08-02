'use client';

import { useState, useRef, useEffect } from 'react';
import { FileText, ArrowLeft, Upload, X, ShieldCheck, Download, Loader2, GripHorizontal } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import { tools } from '@/data/registry';
import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface PageThumb {
  originalIndex: number;
  dataUrl: string;
}

export default function ReorderPDFTool() {
  const meta = tools.find(t => t.slug === 'reorder-pdf');
  // Default meta if not found
  const toolMeta = meta || {
    heroTitle: "Reorder Pdf",
    heroDescription: "Process your PDF documents efficiently.",
    formulaExplanation: "This tool processes your PDF documents locally in your browser for maximum privacy and security.",
    faq: [
      { question: "How does this tool work?", answer: "All processing happens locally in your browser. No data is ever uploaded to any server." },
      { question: "Is my data safe?", answer: "Yes! Your files and data never leave your computer." },
      { question: "Do I need to install anything?", answer: "No installation needed. Everything runs directly in your web browser." }
    ]
  };

  const [file, setFile] = useState<File | null>(null);
  const [thumbs, setThumbs] = useState<PageThumb[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoadingThumbs, setIsLoadingThumbs] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (selected.type !== 'application/pdf') return;
      
      setFile(selected);
      setIsLoadingThumbs(true);
      setThumbs([]);

      try {
        const fileBuffer = await selected.arrayBuffer();
        
        // 1. Load document via PDF.js to render visual grid blocks
        const loadingTask = pdfjsLib.getDocument({ data: fileBuffer.slice(0) });
        const pdf = await loadingTask.promise;
        const generatedThumbs: PageThumb[] = [];

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 0.3 }); // Small crisp thumbnail scale
          
          const canvas = document.createElement('canvas');
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          const ctx = canvas.getContext('2d');
          
          if (ctx) {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            await page.render({ canvasContext: ctx, viewport: viewport }).promise;
            
            generatedThumbs.push({
              originalIndex: i - 1,
              dataUrl: canvas.toDataURL('image/jpeg', 0.7)
            });
          }
        }
        setThumbs(generatedThumbs);
      } catch (err) {
        console.error(err);
        alert("Failed to render visual document layout previews.");
        setFile(null);
      }
      setIsLoadingThumbs(false);
    }
  };

  // Drag and Drop Array State Handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    dragItem.current = index;
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnter = (e: React.DragEvent, index: number) => {
    dragOverItem.current = index;
  };

  const handleDragEnd = () => {
    if (dragItem.current !== null && dragOverItem.current !== null) {
      const newThumbs = [...thumbs];
      const draggedContent = newThumbs.splice(dragItem.current, 1)[0];
      newThumbs.splice(dragOverItem.current, 0, draggedContent);
      setThumbs(newThumbs);
    }
    dragItem.current = null;
    dragOverItem.current = null;
  };

  const processReorder = async () => {
    if (!file || thumbs.length === 0) return;
    setIsProcessing(true);
    try {
      const fileBuffer = await file.arrayBuffer();
      const srcPdf = await PDFDocument.load(fileBuffer);
      const reorderedPdf = await PDFDocument.create();

      // Extract the updated sequence of original page indices
      const targetOrderIndices = thumbs.map(t => t.originalIndex);

      // Copy pages natively in the new custom array pattern mapping
      const copiedPages = await reorderedPdf.copyPages(srcPdf, targetOrderIndices);
      copiedPages.forEach((page) => reorderedPdf.addPage(page));

      const finalBytes = await reorderedPdf.save();
      const blob = new Blob([finalBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `Navorika_Rearranged_${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert("Failed to recompile modified structural page indexes.");
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
          <ShieldCheck className="h-4 w-4" /> Visual Page Order Editor
        </div>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">{toolMeta.heroTitle}</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">{toolMeta.heroDescription}</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden mb-16">
        {!file ? (
          <div className="p-8">
            <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-indigo-300 dark:border-indigo-500/30 rounded-2xl p-12 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-500/5 transition-colors">
              <Upload className="h-10 w-10 text-indigo-500 mb-4" />
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Select PDF File</h3>
              <p className="text-sm text-slate-500 mt-2">Drag and arrange slide sequences visually</p>
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
              <button onClick={() => { setFile(null); setThumbs([]); }} className="p-2 text-slate-400 hover:text-red-500 transition-colors rounded-lg"><X className="h-4 w-4" /></button>
            </div>

            {isLoadingThumbs ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
                <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">Rasterizing Page Previews...</p>
              </div>
            ) : (
              <div>
                <p className="text-xs text-slate-400 mb-4 uppercase tracking-wider font-bold">Drag cards to reorder document layout blocks:</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-h-[450px] overflow-y-auto p-4 border border-slate-100 dark:border-slate-800 rounded-2xl mb-8 bg-slate-50/50 dark:bg-slate-900/50">
                  {thumbs.map((thumb, index) => (
                    <div 
                      key={thumb.originalIndex}
                      draggable
                      onDragStart={(e) => handleDragStart(e, index)}
                      onDragEnter={(e) => handleDragEnter(e, index)}
                      onDragEnd={handleDragEnd}
                      onDragOver={(e) => e.preventDefault()}
                      className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex flex-col items-center gap-2 cursor-grab active:cursor-grabbing hover:border-indigo-500 hover:shadow-lg transition-all group"
                    >
                      <div className="flex justify-between items-center w-full px-1 text-slate-400">
                        <span className="text-[10px] font-black bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded text-slate-600 dark:text-slate-300">Pos {index + 1}</span>
                        <GripHorizontal className="h-3.5 w-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
                      </div>
                      
                      {/* High-Fidelity Rendered Page Frame */}
                      <div className="h-32 w-full border border-slate-200 dark:border-slate-700 bg-white shadow-sm rounded overflow-hidden flex items-center justify-center p-1">
                        <img src={thumb.dataUrl} alt={`Page preview`} className="max-h-full max-w-full object-contain pointer-events-none rounded-sm" />
                      </div>
                      
                      <span className="text-[10px] font-bold tracking-wider text-slate-400 mt-1">Original Page {thumb.originalIndex + 1}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end border-t border-slate-100 dark:border-slate-800 pt-6">
              <button 
                onClick={processReorder} 
                disabled={isProcessing || thumbs.length === 0} 
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition shadow-md"
              >
                {isProcessing ? <Loader2 className="h-5 w-5 animate-spin" /> : <Download className="h-5 w-5" />}
                {isProcessing ? 'Re-assembling Byte Streams...' : 'Save Changes & Download'}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
