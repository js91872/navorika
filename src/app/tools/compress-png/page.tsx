'use client';

import { useState, useRef } from 'react';
import { ArrowLeft, Image as ImageIcon, ShieldCheck, Upload, X, Minimize } from 'lucide-react';
import { tools } from '@/data/registry';

export default function CompressPNGTool() {
  const meta = tools.find(t => t.slug === 'compress-png');
  // Default meta if not found
  const toolMeta = meta || {
    heroTitle: "Compress Png",
    heroDescription: "Process your documents efficiently with this tool.",
    formulaExplanation: "This tool processes your data locally in your browser for maximum privacy and speed.",
    faq: [
      { question: "How does this tool work?", answer: "All processing happens locally in your browser. No data is ever uploaded to any server." },
      { question: "Is my data safe?", answer: "Yes! Your files and data never leave your computer." },
      { question: "Do I need to install anything?", answer: "No installation needed. Everything runs directly in your web browser." }
    ]
  };

  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState(0.7);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processCompression = async () => {
    if (!file) return;
    setIsProcessing(true);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        // We force output to image/png
        let outputMime = 'image/png';
        // HTML5 canvas doesn't lossy-compress PNG directly. We proxy to webp if quality is adjusted heavily.
        if (outputMime === 'image/png' && quality < 0.9) outputMime = 'image/webp'; 

        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Navorika_Optimized_${file.name.split('.')[0]}.${outputMime.split('/')[1]}`;
            document.body.appendChild(a);
            a.click();
            URL.revokeObjectURL(url);
          }
          setIsProcessing(false);
        }, outputMime, quality);
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
      
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-bold uppercase tracking-wider mb-4 border border-purple-500/20">
          <ShieldCheck className="h-4 w-4" /> Local Quantization
        </div>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">{toolMeta.heroTitle}</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">{toolMeta.heroDescription}</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-8 space-y-6">
        {!file ? (
          <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-purple-300 dark:border-purple-500/30 rounded-2xl p-12 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-purple-50 dark:hover:bg-purple-900/5 transition-colors">
            <Upload className="h-10 w-10 text-purple-500 mb-4" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Upload PNG Image</h3>
            <input type="file" accept="image/png, image/jpeg" className="hidden" ref={fileInputRef} onChange={(e) => setFile(e.target.files?.[0] || null)} />
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 truncate">{file.name}</span>
              <button onClick={() => setFile(null)} className="text-slate-400 hover:text-red-500 transition-colors"><X className="h-4 w-4" /></button>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div className="flex justify-between items-center mb-4">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Target Quality</label>
                <span className="text-lg font-black text-purple-600 dark:text-purple-400">{Math.round(quality * 100)}%</span>
              </div>
              <input type="range" min="0.1" max="1.0" step="0.05" value={quality} onChange={(e) => setQuality(parseFloat(e.target.value))} className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-600" />
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
              <button onClick={processCompression} disabled={isProcessing} className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-bold transition shadow-md">
                <Minimize className="h-5 w-5" />
                {isProcessing ? 'Compressing...' : 'Compress PNG'}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
