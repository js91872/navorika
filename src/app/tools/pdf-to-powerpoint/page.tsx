'use client';

import { useState, useRef } from 'react';
import { FileText, ArrowLeft, Upload, X, ShieldCheck, Download, Loader2, Presentation } from 'lucide-react';
import { tools } from '@/data/registry';
import pptxgen from 'pptxgenjs';
import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export default function PDFToPowerPointTool() {
  const meta = tools.find(t => t.slug === 'pdf-to-powerpoint');
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const processPDFToPPTX = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const fileBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: fileBuffer });
      const pdf = await loadingTask.promise;
      
      const pptx = new pptxgen();
      pptx.layout = 'LAYOUT_16x9';

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2.0 });

        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d');

        if (ctx) {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          await page.render({ canvasContext: ctx, viewport: viewport }).promise;

          const imgDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          const slide = pptx.addSlide();
          
          // Inject canvas rendering data frame as presentation background layout
          slide.addImage({ data: imgDataUrl, x: 0, y: 0, w: '100%', h: '100%' });
        }
      }

      await pptx.writeFile({ fileName: `${file.name.split('.')[0]}_NavorikaPresentation.pptx` });
    } catch (err) {
      console.error(err);
      alert("Error compiling high-fidelity raster presentation mapping objects.");
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
          <ShieldCheck className="h-4 w-4" /> Raster Frame Mapping Mode
        </div>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">{meta.heroTitle}</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">{meta.heroDescription}</p>
      </div>
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden mb-16">
        {!file ? (
          <div className="p-8">
            <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-indigo-300 dark:border-indigo-500/30 rounded-2xl p-12 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-500/5 transition-colors">
              <Upload className="h-10 w-10 text-indigo-500 mb-4" />
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Select Target PDF Document</h3>
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
              <button onClick={() => setFile(null)} className="p-2 text-slate-400 hover:text-red-500 transition-colors"><X className="h-4 w-4" /></button>
            </div>
            <div className="flex justify-end pt-4">
              <button onClick={processPDFToPPTX} disabled={isProcessing} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition shadow-md">
                {isProcessing ? <Loader2 className="h-5 w-5 animate-spin" /> : <Presentation className="h-5 w-5" />}
                {isProcessing ? 'Generating Slides...' : 'Convert to PowerPoint'}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
