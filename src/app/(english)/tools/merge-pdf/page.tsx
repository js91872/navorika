'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { FileText, ArrowLeft, Upload, File, X, ShieldCheck, Download, Loader2 } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import { tools } from '@/data/registry';

export default function MergePDFTool() {
  const meta = tools.find(t => t.slug === 'merge-pdf');
  const toolMeta = meta || {
    heroTitle: 'Merge PDF Files Online',
    heroDescription: 'Combine multiple PDF documents into a single organized file directly in your browser.',
    formulaExplanation: 'This tool merges PDF documents locally in your browser without uploading them to a server.',
    faq: [
      { question: 'How does this tool work?', answer: 'All processing happens locally in your browser. No files are uploaded to any server.' },
      { question: 'Is my data safe?', answer: 'Yes. Your files never leave your device.' },
      { question: 'Do I need to install anything?', answer: 'No installation required. Everything runs directly in your web browser.' }
    ]
  };
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selected = Array.from(e.target.files).filter(f => f.type === 'application/pdf');
      setFiles(prev => [...prev, ...selected]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const processMerge = async () => {
    if (files.length < 2) return;
    setIsProcessing(true);
    try {
      const mergedPdf = await PDFDocument.create();
      
      for (const file of files) {
        const fileBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(fileBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedPdfFile = await mergedPdf.save();
      const blob = new Blob([mergedPdfFile.buffer as ArrayBuffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `Navorika_Merged_${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Merge failed:", error);
      alert("Failed to merge documents. Ensure they are valid PDFs and not password protected.");
    }
    setIsProcessing(false);
  };

  if (!meta) return null;

  return (
    <div className="pb-16 pt-8 text-[#18181b] dark:text-[#f4f4f5]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/categories/pdf-tools" className="inline-flex items-center gap-2 text-sm font-semibold text-[#5b5b63] dark:text-[#a1a1aa] hover:text-[#e5322d] dark:hover:text-[#ff6b68] transition mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to PDF Tools
        </Link>

        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold mb-3 border border-emerald-500/20">
            <ShieldCheck className="h-3.5 w-3.5" /> Runs in your browser — files stay on your device
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#18181b] dark:text-white tracking-tight mb-2">{toolMeta.heroTitle || 'Merge PDF Files Online'}</h1>
          <p className="text-base text-[#5b5b63] dark:text-[#a1a1aa] max-w-2xl leading-relaxed">{toolMeta.heroDescription || 'Combine multiple PDF documents into a single file quickly and privately.'}</p>
        </div>

        {/* App Workspace */}
        <div className="bg-white dark:bg-[#18181b] rounded-xl border border-[#e4e4e8] dark:border-[#27272a] shadow-xs overflow-hidden mb-12">
          
          {/* Upload Zone */}
          <div className="p-6 sm:p-8 border-b border-[#e4e4e8] dark:border-[#27272a] bg-[#f7f7f8]/50 dark:bg-[#18181b]">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-[#e4e4e8] dark:border-[#27272a] hover:border-[#e5322d] dark:hover:border-[#e5322d] rounded-xl p-10 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-[#fff1f1]/30 dark:hover:bg-[#e5322d]/5 transition-colors"
            >
              <div className="grid size-12 place-items-center rounded-xl bg-[#fff1f1] dark:bg-[#e5322d]/10 text-[#e5322d] mb-3">
                <Upload className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-[#18181b] dark:text-white">Select PDF Files</h3>
              <p className="text-xs text-[#5b5b63] dark:text-[#a1a1aa] mt-1">or drag and drop them here (select 2 or more)</p>
              <input 
                type="file" 
                multiple 
                accept="application/pdf" 
                className="hidden" 
                ref={fileInputRef}
                onChange={handleFileChange}
              />
            </div>
          </div>

          {/* File Queue */}
          {files.length > 0 && (
            <div className="p-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#5b5b63] dark:text-[#a1a1aa] mb-3">Files in Queue ({files.length})</h4>
              <div className="space-y-2.5 mb-6">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3.5 rounded-xl bg-[#f7f7f8] dark:bg-[#202023] border border-[#e4e4e8] dark:border-[#27272a]">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <File className="h-5 w-5 text-[#e5322d] shrink-0" />
                      <span className="text-sm font-semibold text-[#18181b] dark:text-white truncate">{file.name}</span>
                    </div>
                    <button onClick={() => removeFile(index)} className="p-1.5 text-[#5b5b63] hover:text-[#e5322d] transition-colors rounded-lg">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex justify-end">
                <button 
                  onClick={processMerge}
                  disabled={files.length < 2 || isProcessing}
                  className="flex items-center gap-2 bg-[#e5322d] hover:bg-[#c71f1e] disabled:bg-slate-200 dark:disabled:bg-zinc-800 disabled:text-slate-400 dark:disabled:text-zinc-600 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-xs"
                >
                  {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                  {isProcessing ? 'Merging Documents...' : 'Merge & Download'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
