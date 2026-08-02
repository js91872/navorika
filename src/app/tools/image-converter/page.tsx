'use client';

import { useState, useRef } from 'react';
import { ArrowLeft, Image as ImageIcon, ShieldCheck, RefreshCw, Upload, X, ArrowRight, Loader2 } from 'lucide-react';
import { tools } from '@/data/registry';
import { PDFDocument } from 'pdf-lib';
import heic2any from 'heic2any';

// HEIC is added as an input format, but excluded from outputs (browsers cannot encode TO heic easily offline)
const FROM_FORMATS = ['JPG', 'PNG', 'WEBP', 'SVG', 'HEIC'];
const TO_FORMATS = ['JPG', 'PNG', 'WEBP', 'SVG', 'PDF'];

export default function OmniImageConverterTool() {
  const meta = tools.find(t => t.slug === 'image-converter');
  // Default meta if not found
  const toolMeta = meta || {
    heroTitle: "Image Converter",
    heroDescription: "Process your documents efficiently with this tool.",
    formulaExplanation: "This tool processes your data locally in your browser for maximum privacy and speed.",
    faq: [
      { question: "How does this tool work?", answer: "All processing happens locally in your browser. No data is ever uploaded to any server." },
      { question: "Is my data safe?", answer: "Yes! Your files and data never leave your computer." },
      { question: "Do I need to install anything?", answer: "No installation needed. Everything runs directly in your web browser." }
    ]
  };

  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [fromFormat, setFromFormat] = useState('JPG');
  const [toFormat, setToFormat] = useState('PNG');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      
      // Auto-detect input extension mapping
      const ext = selected.name.split('.').pop()?.toUpperCase();
      if (ext === 'JPEG') setFromFormat('JPG');
      else if (FROM_FORMATS.includes(ext || '')) setFromFormat(ext || 'JPG');
    }
  };

  const executeConversion = async () => {
    if (!file) return;
    setIsProcessing(true);

    try {
      let activeFile = file;

      // ==========================================
      // HEIC INTERCEPTION & DECODING PROTOCOL
      // ==========================================
      if (fromFormat === 'HEIC' || activeFile.name.toLowerCase().endsWith('.heic')) {
        const convertedBlob = await heic2any({
          blob: activeFile,
          toType: "image/jpeg",
          quality: 0.95
        });
        
        // heic2any can return an array if the HEIC contains a burst/animation. Grab the first frame.
        const singleBlob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
        activeFile = new File([singleBlob], activeFile.name.replace(/\.heic$/i, '.jpg'), { type: 'image/jpeg' });
      }

      const imageBytes = await activeFile.arrayBuffer();
      
      // Target A: PDF Document Compilation Wrappers
      if (toFormat === 'PDF') {
        const pdfDoc = await PDFDocument.create();
        let embeddedImage;

        if (fromFormat === 'JPG' || fromFormat === 'HEIC' || activeFile.type.includes('jpeg')) {
          embeddedImage = await pdfDoc.embedJpg(imageBytes);
        } else if (fromFormat === 'PNG') {
          embeddedImage = await pdfDoc.embedPng(imageBytes);
        } else {
          // Canvas fallback for SVG/WEBP to PDF
          const img = await loadImageProxy(URL.createObjectURL(activeFile));
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          canvas.getContext('2d')?.drawImage(img, 0, 0);
          const canvasBytes = await (await fetch(canvas.toDataURL('image/jpeg'))).arrayBuffer();
          embeddedImage = await pdfDoc.embedJpg(canvasBytes);
        }

        const page = pdfDoc.addPage([embeddedImage.width, embeddedImage.height]);
        page.drawImage(embeddedImage, { x: 0, y: 0, width: embeddedImage.width, height: embeddedImage.height });
        downloadBlob(new Blob([await pdfDoc.save()], { type: 'application/pdf' }), `${file.name.split('.')[0]}.pdf`);
      }
      
      // Target B: Mock Vector Path Tracer Matrix
      else if (toFormat === 'SVG') {
        const url = URL.createObjectURL(activeFile);
        const img = await loadImageProxy(url);
        const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="${img.width}" height="${img.height}"><image href="${url}" width="${img.width}" height="${img.height}"/></svg>`;
        downloadBlob(new Blob([svgString], { type: 'image/svg+xml' }), `${file.name.split('.')[0]}.svg`);
      }
      
      // Target C: Standard Canvas Matrix Operations (JPG, PNG, WEBP)
      else {
        const img = await loadImageProxy(URL.createObjectURL(activeFile));
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');

        let mimeType = 'image/png';
        if (toFormat === 'JPG') {
          mimeType = 'image/jpeg';
          if (ctx) { ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0, 0, canvas.width, canvas.height); }
        } else if (toFormat === 'WEBP') {
          mimeType = 'image/webp';
        }

        ctx?.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) downloadBlob(blob, `${file.name.split('.')[0]}.${toFormat.toLowerCase()}`);
        }, mimeType, 0.95);
      }
    } catch (err) {
      console.error(err);
      alert("Format mapping exception. Please ensure the file is a valid image.");
    }
    setIsProcessing(false);
  };

  const loadImageProxy = (url: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    });
  };

  const downloadBlob = (blob: Blob, name: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Navorika_${name}`;
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!meta) return null;

  return (
    <main className="max-w-4xl mx-auto px-6 py-12 lg:px-8">
      <a href="/categories/image-tools" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-purple-600 transition mb-8">
        <ArrowLeft className="h-4 w-4" /> Back to Image Tools
      </a>
      
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-bold uppercase tracking-wider mb-4 border border-purple-500/20">
          <ShieldCheck className="h-4 w-4" /> Omni Transformation Engine
        </div>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">{toolMeta.heroTitle}</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">{toolMeta.heroDescription}</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden p-8 space-y-6">
        
        {/* Dynamic Matrix Option Selector Fields */}
        <div className="flex items-center justify-center gap-6 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
          <div className="flex flex-col gap-1 w-full max-w-[160px]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Convert From</span>
            <select value={fromFormat} onChange={(e) => setFromFormat(e.target.value)} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-2 rounded-xl font-bold outline-none text-sm text-slate-700 dark:text-slate-300">
              {FROM_FORMATS.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>

          <div className="p-2 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-500 mt-4"><ArrowRight className="h-4 w-4"/></div>

          <div className="flex flex-col gap-1 w-full max-w-[160px]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Convert To</span>
            <select value={toFormat} onChange={(e) => setToFormat(e.target.value)} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-2 rounded-xl font-bold outline-none text-sm text-slate-700 dark:text-slate-300">
              {TO_FORMATS.filter(f => f !== fromFormat).map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
        </div>

        {!file ? (
          <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-purple-300 dark:border-purple-500/30 rounded-2xl p-12 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-purple-50 dark:hover:bg-purple-900/5 transition-colors">
            <Upload className="h-10 w-10 text-purple-500 mb-4" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Select File</h3>
            <p className="text-xs text-slate-400 mt-2 font-mono">Supports JPG, PNG, WEBP, SVG, and HEIC</p>
            <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3 overflow-hidden">
                <ImageIcon className="h-5 w-5 text-purple-500 flex-shrink-0" />
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 truncate">{file.name}</span>
              </div>
              <button onClick={() => setFile(null)} className="p-2 text-slate-400 hover:text-red-500 transition-colors"><X className="h-4 w-4" /></button>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
              <button onClick={executeConversion} disabled={isProcessing} className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-bold transition shadow-md">
                {isProcessing ? <Loader2 className="h-5 w-5 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                {isProcessing ? 'Processing Format...' : 'Convert & Download'}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
