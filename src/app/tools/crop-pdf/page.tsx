'use client';

import { useState, useRef } from 'react';
import { FileText, ArrowLeft, Upload, X, ShieldCheck, Download, Loader2, Crop } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import { tools } from '@/data/registry';

export default function CropPDFTool() {
  const meta = tools.find(t => t.slug === 'crop-pdf');
  // Default meta if not found
  const toolMeta = meta || {
    heroTitle: "Crop Pdf",
    heroDescription: "Process your PDF documents efficiently.",
    formulaExplanation: "This tool processes your PDF documents locally in your browser for maximum privacy and security.",
    faq: [
      { question: "How does this tool work?", answer: "All processing happens locally in your browser. No data is ever uploaded to any server." },
      { question: "Is my data safe?", answer: "Yes! Your files and data never leave your computer." },
      { question: "Do I need to install anything?", answer: "No installation needed. Everything runs directly in your web browser." }
    ]
  };

  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Margin trimmings in Points (1 pt = 1/72 inch)
  const [top, setTop] = useState(36);
  const [bottom, setBottom] = useState(36);
  const [left, setLeft] = useState(36);
  const [right, setRight] = useState(36);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const processCrop = async () => {
    if (!file) return;
    setIsProcessing(true);
    
    try {
      const fileBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(fileBuffer);
      const pages = pdfDoc.getPages();

      pages.forEach((page) => {
        const { x, y, width, height } = page.getCropBox();
        
        // Define new bounding coordinates
        page.setCropBox(
          x + left, 
          y + bottom, 
          width - left - right, 
          height - top - bottom
        );
      });

      const finalBytes = await pdfDoc.save();
      const blob = new Blob([finalBytes.buffer.buffer.buffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `Navorika_Cropped_${file.name}`;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert("Failed to adjust bounding box array boundaries.");
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
          <ShieldCheck className="h-4 w-4" /> MediaBox Matrix Editor
        </div>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">{toolMeta.heroTitle}</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">{toolMeta.heroDescription}</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden mb-16">
        {!file ? (
          <div className="p-8">
            <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-indigo-300 dark:border-indigo-500/30 rounded-2xl p-12 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-500/5 transition-colors">
              <Upload className="h-10 w-10 text-indigo-500 mb-4" />
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Select PDF Document</h3>
              <input type="file" accept="application/pdf" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
            </div>
          </div>
        ) : (
          <div className="p-8">
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 mb-8">
              <div className="flex items-center gap-3 overflow-hidden">
                <FileText className="h-5 w-5 text-red-500 flex-shrink-0" />
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 truncate">{file.name}</span>
              </div>
              <button onClick={() => setFile(null)} className="p-2 text-slate-400 hover:text-red-500 transition-colors"><X className="h-4 w-4" /></button>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 mb-8">
              <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-4 text-center">Trim Margins (Points)</h4>
              
              <div className="max-w-xs mx-auto space-y-4">
                <div className="flex items-center gap-4">
                  <label className="text-xs font-bold text-slate-500 uppercase w-16">Top</label>
                  <input type="number" min={0} value={top} onChange={(e) => setTop(Number(e.target.value))} className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none" />
                </div>
                <div className="flex items-center gap-4">
                  <label className="text-xs font-bold text-slate-500 uppercase w-16">Bottom</label>
                  <input type="number" min={0} value={bottom} onChange={(e) => setBottom(Number(e.target.value))} className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none" />
                </div>
                <div className="flex items-center gap-4">
                  <label className="text-xs font-bold text-slate-500 uppercase w-16">Left</label>
                  <input type="number" min={0} value={left} onChange={(e) => setLeft(Number(e.target.value))} className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none" />
                </div>
                <div className="flex items-center gap-4">
                  <label className="text-xs font-bold text-slate-500 uppercase w-16">Right</label>
                  <input type="number" min={0} value={right} onChange={(e) => setRight(Number(e.target.value))} className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none" />
                </div>
              </div>
            </div>

            <div className="flex justify-end border-t border-slate-100 dark:border-slate-800 pt-6">
              <button onClick={processCrop} disabled={isProcessing} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition shadow-md">
                {isProcessing ? <Loader2 className="h-5 w-5 animate-spin" /> : <Crop className="h-5 w-5" />}
                {isProcessing ? 'Modifying Coordinates...' : 'Crop Margins & Download'}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
