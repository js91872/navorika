'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { FileText, ArrowLeft, Upload, X, ShieldCheck, Download, Loader2, RefreshCw } from 'lucide-react';
import { PDFDocument, degrees } from 'pdf-lib';
import { tools } from '@/data/registry';

export default function RotatePDFTool() {
  const meta = tools.find(t => t.slug === 'rotate-pdf');
  const toolMeta = meta || {
    heroTitle: 'Rotate PDF Online',
    heroDescription: 'Rotate individual pages or entire PDF documents directly in your browser.',
    formulaExplanation: 'This tool updates the rotation tags inside your PDF document without uploading it to any server.',
    faq: [
      { question: 'How does this tool work?', answer: 'All processing happens locally in your browser. No files are uploaded to any server.' },
      { question: 'Is my data safe?', answer: 'Yes. Your files never leave your device.' },
      { question: 'Do I need to install anything?', answer: 'No installation required. Everything runs directly in your web browser.' }
    ]
  };
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [rotations, setRotations] = useState<number[]>([]);
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
        const count = pdf.getPageCount();
        setPageCount(count);
        setRotations(new Array(count).fill(0));
      } catch {
        alert("Could not parse file bytes. Ensure document is unencrypted.");
        setFile(null);
      }
    }
  };

  const rotateIndividualPage = (index: number) => {
    setRotations(prev => {
      const next = [...prev];
      next[index] = (next[index] + 90) % 360;
      return next;
    });
  };

  const rotateAllGlobal = (deg: number) => {
    setRotations(new Array(pageCount).fill(deg));
  };

  const processRotation = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const fileBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(fileBuffer);
      const pages = pdf.getPages();

      pages.forEach((page, index) => {
        const currentRotation = page.getRotation().angle;
        const additionalRotation = rotations[index];
        page.setRotation(degrees((currentRotation + additionalRotation) % 360));
      });

      const rotatedBytes = await pdf.save();
      const blob = new Blob([rotatedBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `Navorika_Rotated_${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Rotation failure:", error);
      alert("Failed to modify page dictionaries.");
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
          <h1 className="text-3xl sm:text-4xl font-black text-[#18181b] dark:text-white tracking-tight mb-2">{toolMeta.heroTitle || 'Rotate PDF Online'}</h1>
          <p className="text-base text-[#5b5b63] dark:text-[#a1a1aa] max-w-2xl leading-relaxed">{toolMeta.heroDescription || 'Rotate individual pages or entire documents with immediate preview.'}</p>
        </div>

        <div className="bg-white dark:bg-[#18181b] rounded-xl border border-[#e4e4e8] dark:border-[#27272a] shadow-xs overflow-hidden mb-12">
          {!file ? (
            <div className="p-6 sm:p-8">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-[#e4e4e8] dark:border-[#27272a] hover:border-[#e5322d] dark:hover:border-[#e5322d] rounded-xl p-10 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-[#fff1f1]/30 dark:hover:bg-[#e5322d]/5 transition-colors"
              >
                <div className="grid size-12 place-items-center rounded-xl bg-[#fff1f1] dark:bg-[#e5322d]/10 text-[#e5322d] mb-3">
                  <Upload className="h-6 w-6" />
                </div>
                <h3 className="text-base font-bold text-[#18181b] dark:text-white">Select PDF File to Rotate</h3>
                <p className="text-xs text-[#5b5b63] dark:text-[#a1a1aa] mt-1">Instant layout orientation adjustments</p>
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
            <div className="p-6 sm:p-8">
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#f7f7f8] dark:bg-[#202023] border border-[#e4e4e8] dark:border-[#27272a] mb-6">
                <div className="flex items-center gap-3 overflow-hidden">
                  <FileText className="h-6 w-6 text-[#e5322d] shrink-0" />
                  <div>
                    <span className="text-sm font-semibold text-[#18181b] dark:text-white truncate block">{file.name}</span>
                    <span className="text-xs text-[#5b5b63] dark:text-[#a1a1aa] block">{pageCount} pages loaded</span>
                  </div>
                </div>
                <button onClick={() => setFile(null)} className="p-1.5 text-[#5b5b63] hover:text-[#e5322d] transition-colors rounded-lg">
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Macro Global Control Station */}
              <div className="mb-6 p-4 bg-[#f7f7f8] dark:bg-[#202023] border border-[#e4e4e8] dark:border-[#27272a] rounded-xl">
                <span className="block text-xs font-bold uppercase tracking-wider text-[#5b5b63] dark:text-[#a1a1aa] mb-2.5">Rotate Entire Document</span>
                <div className="flex flex-wrap gap-2.5">
                  <button onClick={() => rotateAllGlobal(90)} className="px-3.5 py-1.5 text-xs font-semibold bg-white dark:bg-[#18181b] border border-[#e4e4e8] dark:border-[#27272a] rounded-lg hover:border-[#e5322d] flex items-center gap-1.5 transition-colors shadow-xs"><RefreshCw className="h-3 w-3 text-[#e5322d]" /> +90° Clockwise</button>
                  <button onClick={() => rotateAllGlobal(180)} className="px-3.5 py-1.5 text-xs font-semibold bg-white dark:bg-[#18181b] border border-[#e4e4e8] dark:border-[#27272a] rounded-lg hover:border-[#e5322d] flex items-center gap-1.5 transition-colors shadow-xs"><RefreshCw className="h-3 w-3 text-[#e5322d]" /> 180° Flip</button>
                  <button onClick={() => rotateAllGlobal(270)} className="px-3.5 py-1.5 text-xs font-semibold bg-white dark:bg-[#18181b] border border-[#e4e4e8] dark:border-[#27272a] rounded-lg hover:border-[#e5322d] flex items-center gap-1.5 transition-colors shadow-xs"><RefreshCw className="h-3 w-3 text-[#e5322d]" /> -90° Counter</button>
                </div>
              </div>

              {/* Micro Layout Grid Matrix View */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-80 overflow-y-auto p-2 border border-[#e4e4e8] dark:border-[#27272a] rounded-xl mb-6">
                {rotations.map((rotationAngle, index) => (
                  <div key={index} className="p-3.5 rounded-xl border border-[#e4e4e8] dark:border-[#27272a] bg-white dark:bg-[#18181b] text-center flex flex-col items-center justify-between gap-2.5 shadow-xs">
                    <span className="text-xs font-semibold text-[#5b5b63] dark:text-[#a1a1aa]">Page {index + 1}</span>
                    <div 
                      style={{ transform: `rotate(${rotationAngle}deg)` }} 
                      className="h-16 w-12 bg-[#f7f7f8] dark:bg-[#202023] border border-[#e4e4e8] dark:border-[#27272a] rounded flex items-center justify-center transition-transform duration-200"
                    >
                      <FileText className="h-6 w-6 text-[#5b5b63] dark:text-[#a1a1aa]" />
                    </div>
                    <button 
                      onClick={() => rotateIndividualPage(index)}
                      className="text-[11px] font-semibold text-[#e5322d] flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#fff1f1] dark:bg-[#e5322d]/10 border border-[#fecaca] dark:border-[#e5322d]/20 hover:bg-[#ffe4e4] transition-colors"
                    >
                      <RefreshCw className="h-3 w-3" /> +90°
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex justify-end border-t border-[#e4e4e8] dark:border-[#27272a] pt-5">
                <button 
                  onClick={processRotation}
                  disabled={isProcessing}
                  className="flex items-center gap-2 bg-[#e5322d] hover:bg-[#c71f1e] text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-xs disabled:opacity-50"
                >
                  {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                  {isProcessing ? 'Applying Orientations...' : 'Save & Download'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
