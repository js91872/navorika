'use client';

import { useState, useRef } from 'react';
import { ArrowLeft, Image as ImageIcon, ShieldCheck, Crop, Upload, X } from 'lucide-react';
import { tools } from '@/data/registry';

export default function CropImageTool() {
  const meta = tools.find(t => t.slug === 'crop-image');
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Crop window configuration constraints (Offsets in Pixels)
  const [cropX, setCropX] = useState(50);
  const [cropY, setCropY] = useState(50);
  const [cropW, setCropW] = useState(300);
  const [cropH, setCropH] = useState(300);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
    }
  };

  const processCrop = () => {
    if (!file) return;
    setIsProcessing(true);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = cropW;
      canvas.height = cropH;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        // Spatial coordinate extraction mapping matrix
        ctx.drawImage(img, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Navorika_Cropped_${Date.now()}_${file.name}`;
            document.body.appendChild(a);
            a.click();
            URL.revokeObjectURL(url);
          }
          setIsProcessing(false);
        }, file.type);
      }
    };
    img.src = previewUrl;
  };

  if (!meta) return null;

  return (
    <main className="max-w-4xl mx-auto px-6 py-12 lg:px-8">
      <a href="/categories/image-tools" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-purple-600 transition mb-8">
        <ArrowLeft className="h-4 w-4" /> Back to Image Tools
      </a>

      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-bold uppercase tracking-wider mb-4 border border-purple-500/20">
          <ShieldCheck className="h-4 w-4" /> Canvas Offset Cutter
        </div>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">{meta.heroTitle}</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">{meta.heroDescription}</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-8 space-y-6">
        {!file ? (
          <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-purple-300 dark:border-purple-500/30 rounded-2xl p-12 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-purple-50 dark:hover:bg-purple-900/5 transition-colors">
            <Upload className="h-10 w-10 text-purple-500 mb-4" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Upload Asset to Crop</h3>
            <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3 overflow-hidden">
                <ImageIcon className="h-5 w-5 text-purple-500 flex-shrink-0" />
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 truncate">{file.name}</span>
              </div>
              <button onClick={() => { setFile(null); setPreviewUrl(''); }} className="p-2 text-slate-400 hover:text-red-500 transition-colors"><X className="h-4 w-4" /></button>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 grid sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">X Offset (px)</label>
                <input type="number" value={cropX} onChange={(e) => setCropX(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Y Offset (px)</label>
                <input type="number" value={cropY} onChange={(e) => setCropY(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Width (px)</label>
                <input type="number" value={cropW} onChange={(e) => setCropW(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Height (px)</label>
                <input type="number" value={cropH} onChange={(e) => setCropH(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-sm" />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
              <button onClick={processCrop} disabled={isProcessing} className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-bold transition shadow-md">
                <Crop className="h-4 w-4" />
                {isProcessing ? 'Cropping...' : 'Crop & Download'}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
