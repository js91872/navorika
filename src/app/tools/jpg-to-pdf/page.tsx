'use client';

import { useState, useRef } from 'react';
import { FileText, ArrowLeft, Upload, X, ShieldCheck, Download, Loader2, Image as ImageIcon } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import { tools } from '@/data/registry';

export default function JPGToPDFTool() {
  // Default meta if not found

  const meta = tools.find(t => t.slug === 'jpg-to-pdf');
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
  const [images, setImages] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selected = Array.from(e.target.files).filter(f => f.type.startsWith('image/'));
      setImages(prev => [...prev, ...selected]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const processConversion = async () => {
    if (images.length === 0) return;
    setIsProcessing(true);
    try {
      const pdfDoc = await PDFDocument.create();

      for (const imgFile of images) {
        const imgBuffer = await imgFile.arrayBuffer();
        let embeddedImg;

        if (imgFile.type === 'image/png') {
          embeddedImg = await pdfDoc.embedPng(imgBuffer);
        } else {
          // Fallback handle for JPEG/JPG formats
          embeddedImg = await pdfDoc.embedJpg(imgBuffer);
        }

        const dims = embeddedImg.scale(1);
        const page = pdfDoc.addPage([dims.width, dims.height]);
        page.drawImage(embeddedImg, {
          x: 0,
          y: 0,
          width: dims.width,
          height: dims.height,
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes.buffer.buffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `Navorika_ImageDoc_${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Image migration failed:", error);
      alert("Failed to transcode graphic assets into target PDF frame boxes.");
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
          <ShieldCheck className="h-4 w-4" /> Pure Client-Side Frame Generation
        </div>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">{toolMeta.heroTitle}</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">{toolMeta.heroDescription}</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden mb-16">
        <div className="p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-indigo-300 dark:border-indigo-500/30 rounded-2xl p-12 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-500/5 transition-colors"
          >
            <Upload className="h-10 w-10 text-indigo-500 mb-4" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Select Graphics Files</h3>
            <p className="text-sm text-slate-500 mt-2">Upload JPG or PNG frames natively</p>
            <input 
              type="file" 
              multiple 
              accept="image/jpeg,image/jpg,image/png" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleFileChange}
            />
          </div>
        </div>

        {images.length > 0 && (
          <div className="p-6">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Queued Frames ({images.length})</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
              {images.map((img, index) => (
                <div key={index} className="relative group rounded-xl border border-slate-200 dark:border-slate-800 p-3 bg-slate-50 dark:bg-slate-800/40 flex items-center gap-2">
                  <ImageIcon className="h-4 w-4 text-purple-500 flex-shrink-0" />
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 truncate w-full">{img.name}</span>
                  <button onClick={() => removeImage(index)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <button 
                onClick={processConversion}
                disabled={isProcessing}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md"
              >
                {isProcessing ? <Loader2 className="h-5 w-5 animate-spin" /> : <Download className="h-5 w-5" />}
                {isProcessing ? 'Generating PDF...' : 'Compile Images to PDF'}
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
