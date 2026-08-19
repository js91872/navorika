'use client';

import { useState, useRef } from 'react';
import { ArrowLeft, Upload, X, Monitor } from 'lucide-react';
import { tools } from '@/data/registry';

export default function ChangeResolutionTool() {
  const meta = tools.find(t => t.slug === 'change-image-resolution');
  // Default meta if not found
  const toolMeta = meta || {
    heroTitle: "Change Image Resolution",
    heroDescription: "Process your documents efficiently with this tool.",
    formulaExplanation: "This tool processes your data locally in your browser for maximum privacy and speed.",
    faq: [
      { question: "How does this tool work?", answer: "All processing happens locally in your browser. No data is ever uploaded to any server." },
      { question: "Is my data safe?", answer: "Yes! Your files and data never leave your computer." },
      { question: "Do I need to install anything?", answer: "No installation needed. Everything runs directly in your web browser." }
    ]
  };

  const [file, setFile] = useState<File | null>(null);
  const [preset, setPreset] = useState("1920x1080");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processResolution = () => {
    if (!file) return;
    const [tW, tH] = preset.split('x').map(Number);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = tW;
      canvas.height = tH;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.imageSmoothingEnabled = true;
        ctx.drawImage(img, 0, 0, tW, tH);
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Navorika_${tW}x${tH}.png`;
            document.body.appendChild(a);
            a.click();
          }
        }, 'image/png');
      }
    };
    img.src = URL.createObjectURL(file);
  };

  if (!meta) return null;

  return (
    <main className="max-w-4xl mx-auto px-6 py-12 lg:px-8">
      <a href="/categories/image-tools" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-purple-600 transition mb-8"><ArrowLeft className="h-4 w-4" /> Back to Image Tools</a>
      <div className="text-center mb-10"><h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">{toolMeta.heroTitle}</h1></div>
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl p-8 space-y-6">
        {!file ? (
          <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-purple-300 rounded-2xl p-12 text-center cursor-pointer">
            <Upload className="h-10 w-10 text-purple-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold">Upload Image to Lock Resolution</h3>
            <input type="file" className="hidden" ref={fileInputRef} onChange={(e) => setFile(e.target.files?.[0] || null)} />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center"><span className="font-semibold">{file.name}</span><button onClick={()=>setFile(null)}><X className="h-4 w-4"/></button></div>
            <div>
              <label className="text-xs font-bold uppercase">Standard Resolution Presets</label>
              <select value={preset} onChange={e => setPreset(e.target.value)} className="w-full mt-2 p-3 border rounded-xl bg-slate-50 dark:bg-slate-950">
                <option value="1280x720">HD (720p - 1280x720)</option>
                <option value="1920x1080">FHD (1080p - 1920x1080)</option>
                <option value="2560x1440">QHD (2K - 2560x1440)</option>
                <option value="3840x2160">UHD (4K - 3840x2160)</option>
                <option value="1080x1080">Social Square (1080x1080)</option>
              </select>
            </div>
            <button onClick={processResolution} className="w-full bg-purple-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2"><Monitor className="h-5 w-5"/> Lock & Download</button>
          </div>
        )}
      </div>
    </main>
  );
}
