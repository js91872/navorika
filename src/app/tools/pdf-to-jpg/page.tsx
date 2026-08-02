'use client';

import { useState, useRef } from 'react';
import { FileText, ArrowLeft, Upload, X, ShieldCheck, Download, Loader2, Image as ImageIcon } from 'lucide-react';
import { tools } from '@/data/registry';
import * as pdfjsLib from 'pdfjs-dist';

// Define standard local CDN web worker to avoid bundle bloating issues
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export default function PDFToJPGTool() {
  // Default meta if not found

  const meta = tools.find(t => t.slug === 'pdf-to-jpg');
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
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (selected.type !== 'application/pdf') return;

      try {
        setFile(selected);
        const fileBuffer = await selected.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({ data: fileBuffer });
        const pdf = await loadingTask.promise;
        setPageCount(pdf.numPages);
      } catch (err) {
        console.error(err);
        alert("Failed to count document parameters. Verify file attributes.");
        setFile(null);
      }
    }
  };

  const processRasterization = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const fileBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: fileBuffer });
      const pdf = await loadingTask.promise;

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2.0 }); // Render at 2x crisp scale grid resolution

        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d');

        if (ctx) {
          // Fill pure white background mapping bounds
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          const renderContext = {
            canvasContext: ctx,
            viewport: viewport,
          };
          
          await page.render(renderContext).promise;

          // Convert context grid to download link node
          const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
          const a = document.createElement('a');
          a.href = dataUrl;
          const cleanName = file.name.split('.')[0];
          a.download = `${cleanName}_Page_${i}.jpg`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }
      }
    } catch (error) {
      console.error("Rasterization error:", error);
      alert("Failed to securely render structural pages to graphic assets.");
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
          <ShieldCheck className="h-4 w-4" /> Local Pixel Rendering Node
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
              <p className="text-sm text-slate-500 mt-2">Convert all page boxes into separate graphics formats</p>
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
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 mb-6">
              <div className="flex items-center gap-3 overflow-hidden">
                <FileText className="h-5 w-5 text-red-500 flex-shrink-0" />
                <div>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 truncate block">{file.name}</span>
                  <span className="text-xs text-slate-400 font-bold block">{pageCount} Pages will be extracted as images</span>
                </div>
              </div>
              <button onClick={() => setFile(null)} className="p-2 text-slate-400 hover:text-red-500 transition-colors rounded-lg">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex justify-end pt-4">
              <button 
                onClick={processRasterization}
                disabled={isProcessing}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md"
              >
                {isProcessing ? <Loader2 className="h-5 w-5 animate-spin" /> : <ImageIcon className="h-5 w-5" />}
                {isProcessing ? 'Rasterizing Pages locally...' : 'Convert to JPG Pack'}
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
