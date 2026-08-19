'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Upload, Download, Loader2, FileText, ShieldCheck, X, Hash } from 'lucide-react';
import { PDFDocument, rgb } from 'pdf-lib';
import { tools } from '@/data/registry';

export default function AddPageNumbersTool() {
  const meta = tools.find(t => t.slug === 'add-page-numbers');
  
  const toolMeta = meta || {
    heroTitle: 'Add Page Numbers to PDF',
    heroDescription: 'Add page numbers to your PDF documents with customizable position and format.',
    formulaExplanation: 'This tool adds page numbers to every page of your PDF document with customizable position, format, and starting number.',
    faq: [
      { question: 'Can I customize the position of page numbers?', answer: 'Yes, you can choose from top-left, top-right, bottom-left, bottom-right, or center positions.' },
      { question: 'Can I start numbering from a specific page?', answer: 'Yes, you can set the starting page number and starting number value.' },
      { question: 'Is my document secure?', answer: 'Yes! All processing happens locally in your browser. Your files are never uploaded to any server.' }
    ]
  };

  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [startNumber, setStartNumber] = useState<number>(1);
  const [position, setPosition] = useState<string>('bottom-center');
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

  const handleProcess = async () => {
    if (!file) return;
    
    setIsProcessing(true);
    try {
      const fileBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(fileBuffer);
      const pages = pdf.getPages();
      
      const color = rgb(0.2, 0.2, 0.8);
      
      pages.forEach((page, index) => {
        const { width, height } = page.getSize();
        const pageNumber = startNumber + index;
        const text = `${pageNumber}`;
        
        let x = width / 2;
        let y = height / 2;
        
        switch (position) {
          case 'top-left':
            x = 50;
            y = height - 50;
            break;
          case 'top-center':
            x = width / 2;
            y = height - 50;
            break;
          case 'top-right':
            x = width - 50;
            y = height - 50;
            break;
          case 'bottom-left':
            x = 50;
            y = 50;
            break;
          case 'bottom-center':
            x = width / 2;
            y = 50;
            break;
          case 'bottom-right':
            x = width - 50;
            y = 50;
            break;
          default:
            x = width / 2;
            y = 50;
        }
        
        page.drawText(text, {
          x: x - 10,
          y: y - 10,
          size: 16,
          color: color,
          opacity: 1,
        });
      });

      const finalBytes = await pdf.save();
      const blob = new Blob([finalBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `numbered_${file.name}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert("Failed to add page numbers to the document.");
    }
    setIsProcessing(false);
  };

  return (
    <main className="max-w-4xl mx-auto px-6 py-12 lg:px-8">
      <Link href="/categories/pdf-tools" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-600 transition mb-8">
        <ArrowLeft className="h-4 w-4" /> Back to PDF Tools
      </Link>

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
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Select PDF Document</h3>
              <p className="text-sm text-slate-500 mt-2">Add page numbers to your PDF</p>
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
            <div className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-800/30 rounded-xl mb-6">
              <FileText className="h-8 w-8 text-indigo-500 shrink-0" />
              <div className="flex-1">
                <p className="font-bold text-slate-900 dark:text-white">{file.name}</p>
                <p className="text-sm text-slate-500">{(file.size / 1024).toFixed(1)} KB • {pageCount} pages</p>
              </div>
              <button 
                onClick={() => { setFile(null); setPageCount(0); }}
                className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
              >
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Start Number
                </label>
                <input
                  type="number"
                  value={startNumber}
                  onChange={(e) => setStartNumber(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium outline-none focus:border-indigo-500"
                  min={1}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Position
                </label>
                <select
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium outline-none focus:border-indigo-500"
                >
                  <option value="top-left">Top Left</option>
                  <option value="top-center">Top Center</option>
                  <option value="top-right">Top Right</option>
                  <option value="bottom-left">Bottom Left</option>
                  <option value="bottom-center">Bottom Center</option>
                  <option value="bottom-right">Bottom Right</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleProcess}
              disabled={isProcessing}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Hash className="h-5 w-5" />
                  Add Page Numbers & Download
                </>
              )}
            </button>
          </div>
        )}
      </div>

    </main>
  );
}
