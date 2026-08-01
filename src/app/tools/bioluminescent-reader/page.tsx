'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { ArrowLeft, Upload, X, ShieldCheck, ChevronLeft, ChevronRight, Moon, Sun } from 'lucide-react';
import { tools } from '@/data/registry';
import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export default function BioluminescentReaderTool() {
  const meta = tools.find(t => t.slug === 'bioluminescent-reader');
  const [file, setFile] = useState<File | null>(null);
  const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(true); // Default to on for impact
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (selected.type !== 'application/pdf') return;
      
      setFile(selected);
      try {
        const fileBuffer = await selected.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({ data: fileBuffer });
        const pdf = await loadingTask.promise;
        setPdfDoc(pdf);
        setNumPages(pdf.numPages);
        setCurrentPage(1);
      } catch (err) {
        alert("Failed to initialize rendering engine.");
        setFile(null);
      }
    }
  };

  const renderPage = useCallback(async () => {
    if (!pdfDoc || !canvasRef.current) return;
    
    const page = await pdfDoc.getPage(currentPage);
    // Render at a high scale for crisp reading quality
    const viewport = page.getViewport({ scale: 2.0 });
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      
      // Paint white background (vital for the inversion math to work properly on transparent PDFs)
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const renderContext = {
        canvasContext: ctx,
        viewport: viewport,
      };
      await page.render(renderContext).promise;
    }
  }, [pdfDoc, currentPage]);

  useEffect(() => {
    if (pdfDoc) {
      renderPage();
    }
  }, [pdfDoc, currentPage, renderPage]);

  const closeViewer = () => {
    setFile(null);
    setPdfDoc(null);
    setCurrentPage(1);
  };

  if (!meta) return null;

  // Immersive full-screen takeover mode when reading
  if (file) {
    return (
      <div className={`fixed inset-0 z-50 flex flex-col transition-colors duration-500 ${isDarkMode ? 'bg-[#0a0f16]' : 'bg-slate-100'}`}>
        
        {/* Top Control Bar */}
        <div className={`h-16 flex items-center justify-between px-6 border-b transition-colors duration-500 ${isDarkMode ? 'bg-[#0f1722] border-cyan-900/30' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="flex items-center gap-4">
            <button onClick={closeViewer} className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}>
              <X className="h-5 w-5" />
            </button>
            <span className={`text-sm font-semibold truncate w-48 sm:w-auto ${isDarkMode ? 'text-cyan-400' : 'text-slate-700'}`}>{file.name}</span>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)} 
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-md ${
                isDarkMode 
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 shadow-[0_0_15px_rgba(34,211,238,0.2)]' 
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              {isDarkMode ? 'Standard View' : 'Bioluminescence'}
            </button>
          </div>
        </div>

        {/* Immersive Viewer Area */}
        <div className="flex-1 overflow-auto p-4 md:p-8 flex justify-center items-start">
          <div className="relative">
            <canvas 
              ref={canvasRef} 
              className={`max-w-full h-auto transition-all duration-700 ease-in-out ${
                isDarkMode 
                  ? 'filter invert hue-rotate-180 contrast-125 brightness-90 shadow-[0_0_40px_rgba(34,211,238,0.15)] rounded' 
                  : 'shadow-2xl rounded bg-white'
              }`}
            />
          </div>
        </div>

        {/* Bottom Pagination Dock */}
        <div className={`h-20 flex items-center justify-center gap-8 border-t transition-colors duration-500 ${isDarkMode ? 'bg-[#0f1722]/80 backdrop-blur-md border-cyan-900/30' : 'bg-white/80 backdrop-blur-md border-slate-200'}`}>
          <button 
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage <= 1}
            className={`p-3 rounded-full transition-all ${
              isDarkMode 
                ? 'text-cyan-400 hover:bg-cyan-500/10 disabled:opacity-30 disabled:hover:bg-transparent' 
                : 'text-slate-700 hover:bg-slate-100 disabled:opacity-30'
            }`}
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          
          <span className={`font-mono text-lg font-bold tracking-widest ${isDarkMode ? 'text-cyan-400' : 'text-slate-700'}`}>
            {currentPage} <span className="opacity-50">/</span> {numPages}
          </span>

          <button 
            onClick={() => setCurrentPage(prev => Math.min(numPages, prev + 1))}
            disabled={currentPage >= numPages}
            className={`p-3 rounded-full transition-all ${
              isDarkMode 
                ? 'text-cyan-400 hover:bg-cyan-500/10 disabled:opacity-30 disabled:hover:bg-transparent' 
                : 'text-slate-700 hover:bg-slate-100 disabled:opacity-30'
            }`}
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      </div>
    );
  }

  // Standard Entry Dashboard
  return (
    <main className="max-w-4xl mx-auto px-6 py-12 lg:px-8">
      <a href="/categories/pdf-tools" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-600 transition mb-8">
        <ArrowLeft className="h-4 w-4" /> Back to PDF Tools
      </a>
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-bold uppercase tracking-wider mb-4 border border-cyan-500/20">
          <ShieldCheck className="h-4 w-4" /> Local WebGL Matrix Render
        </div>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">{meta.heroTitle}</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">{meta.heroDescription}</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden mb-16">
        <div className="p-8">
          <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-cyan-300 dark:border-cyan-500/30 rounded-2xl p-16 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-cyan-50 dark:hover:bg-cyan-900/10 transition-colors group">
            <Moon className="h-12 w-12 text-cyan-500 mb-6 group-hover:scale-110 transition-transform duration-300 drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Open Document in Bioluminescent Mode</h3>
            <p className="text-sm text-slate-500">Immersive, zero-eye-strain reading environment.</p>
            <input type="file" accept="application/pdf" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
          </div>
        </div>
      </div>
    </main>
  );
}
