'use client';

import { useState, useRef } from 'react';
import { FileText, ArrowLeft, Upload, X, ShieldCheck, Download, Loader2, Stamp } from 'lucide-react';
import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib';
import { tools } from '@/data/registry';

export default function AddWatermarkTool() {
  const meta = tools.find(t => t.slug === 'add-watermark');
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

  const processWatermark = async () => {
    if (!file || !watermarkText.trim()) return;
    setIsProcessing(true);
    try {
      const fileBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(fileBuffer);
      
      // Embed bold font for maximum visibility
      const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const pages = pdfDoc.getPages();

      pages.forEach((page) => {
        const { width, height } = page.getSize();
        
        // Dynamic font sizing based on page width to ensure it scales nicely
        const fontSize = width > 500 ? 64 : 42;
        const textWidth = font.widthOfTextAtSize(watermarkText, fontSize);
        const textHeight = font.heightAtSize(fontSize);

        // Center coordinates mapping (Accounting for 45-degree rotation offset)
        const centerX = width / 2;
        const centerY = height / 2;

        page.drawText(watermarkText, {
          x: centerX - (textWidth / 2) * Math.cos(Math.PI / 4) + (textHeight / 2) * Math.sin(Math.PI / 4),
          y: centerY - (textWidth / 2) * Math.sin(Math.PI / 4) - (textHeight / 2) * Math.cos(Math.PI / 4),
          size: fontSize,
          font: font,
          color: rgb(0.8, 0.2, 0.2), // Light Red tint
          opacity: 0.25, // Semi-transparent overlay
          rotate: degrees(45), // Diagonal stamp
        });
      });

      const watermarkedBytes = await pdfDoc.save();
      const blob = new Blob([watermarkedBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `Navorika_Watermark_${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Watermark failed:", error);
      alert("Failed to overlay watermark text onto the document stream.");
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
        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">{meta.heroTitle}</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">{meta.heroDescription}</p>
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
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 mb-8">
              <div className="flex items-center gap-3 overflow-hidden">
                <FileText className="h-5 w-5 text-red-500 flex-shrink-0" />
                <div>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 truncate block">{file.name}</span>
                  <span className="text-xs text-slate-400 font-bold block">{pageCount} Pages to watermark</span>
                </div>
              </div>
              <button onClick={() => setFile(null)} className="p-2 text-slate-400 hover:text-red-500 transition-colors rounded-lg">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="max-w-md mb-8">
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Watermark Text Overlay
              </label>
              <div className="relative">
                <Stamp className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input 
                  type="text" 
                  value={watermarkText}
                  onChange={(e) => setWatermarkText(e.target.value)}
                  placeholder="e.g. DRAFT or CONFIDENTIAL"
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-indigo-500 font-semibold uppercase tracking-widest text-slate-900 dark:text-white"
                />
              </div>
              <p className="text-xs text-slate-400 mt-2">Text will be stamped diagonally across the center in semi-transparent red.</p>
            </div>

            <div className="flex justify-end border-t border-slate-100 dark:border-slate-800 pt-6">
              <button 
                onClick={processWatermark}
                disabled={isProcessing || !watermarkText.trim()}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md"
              >
                {isProcessing ? <Loader2 className="h-5 w-5 animate-spin" /> : <Stamp className="h-5 w-5" />}
                {isProcessing ? 'Stamping Document...' : 'Apply Watermark & Download'}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="prose prose-slate dark:prose-invert max-w-none">
        <h2 className="text-2xl font-bold mb-4">How it Works</h2>
        <p>{meta.formulaExplanation}</p>
        <h3 className="text-xl font-bold mt-8 mb-4">Frequently Asked Questions</h3>
        <div className="space-y-4">
          {meta.faq.map((item, i) => (
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
