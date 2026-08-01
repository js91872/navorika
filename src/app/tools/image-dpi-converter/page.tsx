'use client';

import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, ShieldCheck, Upload, X, Printer } from 'lucide-react';
import { tools } from '@/data/registry';

export default function ImageDpiConverterTool() {
  const meta = tools.find(t => t.slug === 'image-dpi-converter');
  const [file, setFile] = useState<File | null>(null);
  const [targetDPI, setTargetDPI] = useState(300);
  const [printWidthInches, setPrintWidthInches] = useState(8.5);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processDpiConversion = () => {
    if (!file) return;
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ratio = img.height / img.width;
      
      // Calculate new pixels based on physical inches * desired DPI
      canvas.width = Math.round(printWidthInches * targetDPI);
      canvas.height = Math.round(canvas.width * ratio);
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Navorika_${targetDPI}DPI_${file.name}`;
            document.body.appendChild(a);
            a.click();
            URL.revokeObjectURL(url);
          }
        }, file.type, 1.0);
      }
    };
    img.src = URL.createObjectURL(file);
  };

  if (!meta) return null;

  return (
    <main className="max-w-4xl mx-auto px-6 py-12 lg:px-8">
      <a href="/categories/image-tools" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-purple-600 transition mb-8">
        <ArrowLeft className="h-4 w-4" /> Back to Image Tools
      </a>
      <div className="text-center mb-10"><h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">{meta.heroTitle}</h1></div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl p-8 space-y-6">
        {!file ? (
          <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-purple-300 rounded-2xl p-12 text-center cursor-pointer">
            <Upload className="h-10 w-10 text-purple-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold">Upload Image for Print Prep</h3>
            <input type="file" className="hidden" ref={fileInputRef} onChange={(e) => setFile(e.target.files?.[0] || null)} />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center"><span className="font-semibold">{file.name}</span><button onClick={()=>setFile(null)}><X className="h-4 w-4"/></button></div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase">Target DPI (Print Quality)</label>
                <select value={targetDPI} onChange={e => setTargetDPI(Number(e.target.value))} className="w-full mt-2 p-3 border rounded-xl bg-slate-50 dark:bg-slate-950">
                  <option value="72">72 DPI (Web)</option>
                  <option value="150">150 DPI (Draft Print)</option>
                  <option value="300">300 DPI (High Quality Print)</option>
                  <option value="600">600 DPI (Archival)</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold uppercase">Target Physical Width (Inches)</label>
                <input type="number" step="0.5" value={printWidthInches} onChange={e => setPrintWidthInches(Number(e.target.value))} className="w-full mt-2 p-3 border rounded-xl bg-slate-50 dark:bg-slate-950" />
              </div>
            </div>
            <button onClick={processDpiConversion} className="w-full bg-purple-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2"><Printer className="h-5 w-5"/> Generate Print-Ready Canvas</button>
          </div>
        )}
      </div>
    </main>
  );
}
