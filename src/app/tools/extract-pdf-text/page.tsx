'use client';

import { useState, useRef } from 'react';
import { FileText, ArrowLeft, Upload, X, ShieldCheck, Download, Loader2, AlignLeft } from 'lucide-react';
import { tools } from '@/data/registry';
import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export default function PristineTextExtractorTool() {
  const meta = tools.find(t => t.slug === 'extract-pdf-text');
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedTextPreview, setExtractedTextPreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (selected.type === 'application/pdf') {
        setFile(selected);
        setExtractedTextPreview('');
      } else {
        alert("Please upload a valid PDF file.");
      }
    }
  };

  const processTextExtraction = async () => {
    if (!file) return;
    setIsProcessing(true);
    
    try {
      const fileBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: fileBuffer });
      const pdf = await loadingTask.promise;
      
      let fullText = `--- Extracted via Navorika Engine ---\nFile: ${file.name}\nPages: ${pdf.numPages}\n-----------------------------------\n\n`;

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        
        // Items contain the string and the transform matrix (x, y coordinates)
        const items = textContent.items as any[];
        
        // Group items by approximate Y coordinate to reconstruct lines
        // PDF coordinates start from bottom-left
        const lines: { [y: number]: any[] } = {};
        
        items.forEach(item => {
          // Round Y to nearest integer to group slight misalignments on the same line
          const y = Math.round(item.transform[5]);
          if (!lines[y]) lines[y] = [];
          lines[y].push(item);
        });

        // Sort Y coordinates descending (top to bottom of page)
        const sortedY = Object.keys(lines).map(Number).sort((a, b) => b - a);
        
        fullText += `[--- PAGE ${i} ---]\n`;
        
        sortedY.forEach(y => {
          // Sort items on this line by X coordinate (left to right)
          const lineItems = lines[y].sort((a, b) => a.transform[4] - b.transform[4]);
          const lineString = lineItems.map(item => item.str).join(' ');
          // Only add non-empty lines to reduce layout noise
          if (lineString.trim().length > 0) {
            fullText += lineString + '\n';
          }
        });
        
        fullText += '\n';
      }

      setExtractedTextPreview(fullText);

      // Trigger standard text file download
      const blob = new Blob([fullText], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Navorika_Extracted_${file.name.split('.')[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error(error);
      alert("Failed to parse font streams. The document may be an image scan lacking vector text.");
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
          <ShieldCheck className="h-4 w-4" /> Vector Stream Parsing
        </div>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">{meta.heroTitle}</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">{meta.heroDescription}</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden mb-16">
        {!file ? (
          <div className="p-8">
            <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-indigo-300 dark:border-indigo-500/30 rounded-2xl p-12 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-500/5 transition-colors">
              <Upload className="h-10 w-10 text-indigo-500 mb-4" />
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Select PDF Document</h3>
              <p className="text-sm text-slate-500 mt-2">Extract pure text strings instantly</p>
              <input type="file" accept="application/pdf" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
            </div>
          </div>
        ) : (
          <div className="p-8 flex flex-col h-full">
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 mb-6">
              <div className="flex items-center gap-3 overflow-hidden">
                <FileText className="h-5 w-5 text-red-500 flex-shrink-0" />
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 truncate">{file.name}</span>
              </div>
              <button onClick={() => { setFile(null); setExtractedTextPreview(''); }} className="p-2 text-slate-400 hover:text-red-500 transition-colors"><X className="h-4 w-4" /></button>
            </div>

            {extractedTextPreview ? (
              <div className="mb-6 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-950 h-96 relative flex flex-col">
                <div className="bg-slate-100 dark:bg-slate-900 px-4 py-2 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Preview Layout</span>
                  <span className="text-xs font-bold text-emerald-500">Extraction Complete</span>
                </div>
                <textarea 
                  readOnly 
                  value={extractedTextPreview}
                  className="w-full h-full p-4 text-xs font-mono text-slate-700 dark:text-slate-300 bg-transparent outline-none resize-none"
                />
              </div>
            ) : (
              <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                <button onClick={processTextExtraction} disabled={isProcessing} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition shadow-md">
                  {isProcessing ? <Loader2 className="h-5 w-5 animate-spin" /> : <AlignLeft className="h-5 w-5" />}
                  {isProcessing ? 'Parsing Layout...' : 'Extract Text & Download'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
