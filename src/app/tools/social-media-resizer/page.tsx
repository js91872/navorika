'use client';

import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, ShieldCheck, Upload, X, Crop, MonitorSmartphone } from 'lucide-react';
import { tools } from '@/data/registry';

type PlatformPreset = { id: string; name: string; formats: { name: string; w: number; h: number }[] };

const PRESETS: PlatformPreset[] = [
  { id: 'instagram', name: 'Instagram', formats: [{ name: 'Square Post', w: 1080, h: 1080 }, { name: 'Portrait Post', w: 1080, h: 1350 }, { name: 'Story / Reel', w: 1080, h: 1920 }] },
  { id: 'facebook', name: 'Facebook', formats: [{ name: 'Shared Image', w: 1200, h: 630 }, { name: 'Cover Photo', w: 820, h: 312 }, { name: 'Profile Picture', w: 170, h: 170 }] },
  { id: 'youtube', name: 'YouTube', formats: [{ name: 'Thumbnail', w: 1280, h: 720 }, { name: 'Channel Banner', w: 2560, h: 1440 }, { name: 'Profile Pic', w: 800, h: 800 }] },
  { id: 'twitter', name: 'Twitter / X', formats: [{ name: 'In-Stream Photo', w: 1600, h: 900 }, { name: 'Header', w: 1500, h: 500 }] },
  { id: 'linkedin', name: 'LinkedIn', formats: [{ name: 'Company Logo', w: 300, h: 300 }, { name: 'Cover Photo', w: 1128, h: 191 }, { name: 'Shared Image', w: 1200, h: 627 }] },
  { id: 'pinterest', name: 'Pinterest', formats: [{ name: 'Standard Pin', w: 1000, h: 1500 }, { name: 'Square Pin', w: 1000, h: 1000 }] },
];

export default function SocialMediaResizerTool() {
  const meta = tools.find(t => t.slug === 'social-media-resizer');
  // Default meta if not found
  const toolMeta = meta || {
    heroTitle: "Social Media Resizer",
    heroDescription: "Process your documents efficiently with this tool.",
    formulaExplanation: "This tool processes your data locally in your browser for maximum privacy and speed.",
    faq: [
      { question: "How does this tool work?", answer: "All processing happens locally in your browser. No data is ever uploaded to any server." },
      { question: "Is my data safe?", answer: "Yes! Your files and data never leave your computer." },
      { question: "Do I need to install anything?", answer: "No installation needed. Everything runs directly in your web browser." }
    ]
  };

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  
  const [platformId, setPlatformId] = useState('instagram');
  const [formatIndex, setFormatIndex] = useState(0);
  const [fitMode, setFitMode] = useState<'cover' | 'contain'>('cover');
  const [bgColor, setBgColor] = useState('#ffffff');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const currentPlatform = PRESETS.find(p => p.id === platformId) || PRESETS[0];
  const currentFormat = currentPlatform.formats[formatIndex];

  useEffect(() => {
    if (previewUrl && canvasRef.current) {
      const img = new Image();
      img.onload = () => drawToCanvas(img);
      img.src = previewUrl;
    }
  }, [previewUrl, platformId, formatIndex, fitMode, bgColor]);

  const drawToCanvas = (img: HTMLImageElement) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    canvas.width = currentFormat.w;
    canvas.height = currentFormat.h;
    
    // Fill background (useful for 'contain' mode)
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const srcRatio = img.width / img.height;
    const dstRatio = canvas.width / canvas.height;
    
    let drawW, drawH, drawX, drawY;

    if (fitMode === 'cover') {
      if (srcRatio > dstRatio) {
        drawH = canvas.height;
        drawW = drawH * srcRatio;
        drawX = (canvas.width - drawW) / 2;
        drawY = 0;
      } else {
        drawW = canvas.width;
        drawH = drawW / srcRatio;
        drawX = 0;
        drawY = (canvas.height - drawH) / 2;
      }
    } else {
      // Contain logic
      if (srcRatio > dstRatio) {
        drawW = canvas.width;
        drawH = drawW / srcRatio;
        drawX = 0;
        drawY = (canvas.height - drawH) / 2;
      } else {
        drawH = canvas.height;
        drawW = drawH * srcRatio;
        drawX = (canvas.width - drawW) / 2;
        drawY = 0;
      }
    }

    ctx.drawImage(img, drawX, drawY, drawW, drawH);
  };

  const handleDownload = () => {
    if (!canvasRef.current || !file) return;
    canvasRef.current.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Navorika_${currentPlatform.name}_${currentFormat.name.replace(' ', '')}_${file.name}`;
        document.body.appendChild(a);
        a.click();
      }
    }, file.type, 0.95);
  };

  if (!meta) return null;

  return (
    <main className="max-w-6xl mx-auto px-6 py-12 lg:px-8">
      <a href="/categories/image-tools" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-purple-600 transition mb-8"><ArrowLeft className="h-4 w-4" /> Back to Image Tools</a>
      <div className="text-center mb-10"><h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">{toolMeta.heroTitle}</h1></div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl overflow-hidden p-8 grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          {!file ? (
            <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-purple-300 rounded-2xl p-12 text-center cursor-pointer h-64 flex flex-col justify-center">
              <Upload className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Load Asset to Resize</h4>
              <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={(e) => {
                if (e.target.files?.[0]) {
                  setFile(e.target.files[0]);
                  setPreviewUrl(URL.createObjectURL(e.target.files[0]));
                }
              }} />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="text-xs font-semibold truncate w-48">{file.name}</span>
                <button onClick={() => { setFile(null); setPreviewUrl(''); }} className="text-slate-400 hover:text-red-500"><X className="h-3 w-3" /></button>
              </div>

              <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-800 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-500">Platform</label>
                    <select value={platformId} onChange={(e) => { setPlatformId(e.target.value); setFormatIndex(0); }} className="w-full mt-1 p-2 rounded bg-white dark:bg-slate-900 border text-sm font-bold">
                      {PRESETS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-500">Format</label>
                    <select value={formatIndex} onChange={(e) => setFormatIndex(Number(e.target.value))} className="w-full mt-1 p-2 rounded bg-white dark:bg-slate-900 border text-sm font-bold">
                      {currentPlatform.formats.map((f, i) => <option key={i} value={i}>{f.name} ({f.w}x{f.h})</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-500">Scale Mode</label>
                    <select value={fitMode} onChange={(e) => setFitMode(e.target.value as 'cover'|'contain')} className="w-full mt-1 p-2 rounded bg-white dark:bg-slate-900 border text-sm font-bold">
                      <option value="cover">Crop to Fill (Cover)</option>
                      <option value="contain">Pad to Fit (Contain)</option>
                    </select>
                  </div>
                  {fitMode === 'contain' && (
                    <div>
                      <label className="text-[10px] font-bold uppercase text-slate-500">Pad Background</label>
                      <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-full h-9 rounded cursor-pointer mt-1" />
                    </div>
                  )}
                </div>
              </div>
              
              <button onClick={handleDownload} className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition shadow-md">
                <MonitorSmartphone className="h-4 w-4"/> Format & Download
              </button>
            </div>
          )}
        </div>

        <div className="border border-slate-100 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-950 p-4 flex items-center justify-center min-h-[400px]">
          {file ? (
            <div className="relative">
              <span className="absolute -top-6 left-0 text-[10px] font-mono text-slate-400 font-bold">{currentFormat.w} x {currentFormat.h}px</span>
              <canvas ref={canvasRef} className="max-w-full max-h-[350px] object-contain shadow-md rounded border border-slate-200 dark:border-slate-700" />
            </div>
          ) : (
            <div className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest"><Crop className="h-6 w-6 opacity-50 mx-auto mb-2" /> Awaiting Asset</div>
          )}
        </div>
      </div>
    </main>
  );
}
