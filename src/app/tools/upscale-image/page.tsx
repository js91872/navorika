'use client';

import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Image as ImageIcon, ShieldCheck, Download, Upload, X, ZoomIn } from 'lucide-react';
import { tools } from '@/data/registry';

export default function UpscaleImageTool() {
  const meta = tools.find(t => t.slug === 'upscale-image');
  // Default meta if not found
  const toolMeta = meta || {
    heroTitle: "Upscale Image",
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
  const [isProcessing, setIsProcessing] = useState(false);
  const [scaleMultiplier, setScaleMultiplier] = useState<number>(2); // 2x default
  const [originDims, setOriginDims] = useState({ w: 0, h: 0 });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (previewUrl && canvasRef.current) {
      const img = new Image();
      img.onload = () => {
        setOriginDims({ w: img.width, h: img.height });
        renderUpscale(img);
      };
      img.src = previewUrl;
    }
  }, [previewUrl, scaleMultiplier]);

  const renderUpscale = (img: HTMLImageElement) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    // Expand bounding structural matrices
    canvas.width = img.width * scaleMultiplier;
    canvas.height = img.height * scaleMultiplier;

    // Enforce high-quality local browser interpolation
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
    }
  };

  const downloadUpscaled = () => {
    if (!canvasRef.current || !file) return;
    setIsProcessing(true);
    
    canvasRef.current.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Navorika_Upscaled_${scaleMultiplier}x_${file.name}`;
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(url);
      }
      setIsProcessing(false);
    }, file.type, 1.0);
  };

  if (!meta) return null;

  return (
    <main className="max-w-5xl mx-auto px-6 py-12 lg:px-8">
      <a href="/categories/image-tools" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-purple-600 transition mb-8">
        <ArrowLeft className="h-4 w-4" /> Back to Image Tools
      </a>

      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-bold uppercase tracking-wider mb-4 border border-purple-500/20">
          <ShieldCheck className="h-4 w-4" /> Bi-Cubic Interpolation Mapping
        </div>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">{toolMeta.heroTitle}</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">{toolMeta.heroDescription}</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden p-8 grid md:grid-cols-3 gap-8">
        
        {/* Controls Column */}
        <div className="space-y-6 flex flex-col justify-between h-full">
          {!file ? (
            <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-purple-300 dark:border-purple-500/30 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-purple-50 dark:hover:bg-purple-500/5 transition-colors h-64">
              <Upload className="h-8 w-8 text-purple-500 mb-2" />
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Load Asset to Upscale</h4>
              <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 truncate w-32">{file.name}</span>
                <button onClick={() => { setFile(null); setPreviewUrl(''); setOriginDims({w:0,h:0}); }} className="text-slate-400 hover:text-red-500 transition-colors"><X className="h-3 w-3" /></button>
              </div>

              <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-800 space-y-4">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Multiplier Factor</label>
                <div className="grid grid-cols-3 gap-2">
                  {[2, 4, 8].map(mult => (
                    <button 
                      key={mult}
                      onClick={() => setScaleMultiplier(mult)}
                      className={`py-2 rounded-lg text-sm font-bold transition-all border ${scaleMultiplier === mult ? 'bg-purple-600 border-purple-600 text-white' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-purple-500'}`}
                    >
                      {mult}x
                    </button>
                  ))}
                </div>
                
                {originDims.w > 0 && (
                  <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-800">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      <span>Origin</span>
                      <span>Target</span>
                    </div>
                    <div className="flex justify-between text-sm font-mono mt-1 text-slate-700 dark:text-slate-300">
                      <span>{originDims.w}x{originDims.h}</span>
                      <span className="text-purple-600 dark:text-purple-400 font-bold">{originDims.w * scaleMultiplier}x{originDims.h * scaleMultiplier}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {file && (
            <button onClick={downloadUpscaled} disabled={isProcessing} className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-bold transition shadow-md">
              <ZoomIn className="h-4 w-4" />
              {isProcessing ? 'Processing...' : 'Download Enlarged Asset'}
            </button>
          )}
        </div>

        {/* Live Canvas Preview */}
        <div className="md:col-span-2 border border-slate-100 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-950 p-4 flex items-center justify-center min-h-[300px] overflow-hidden">
          {file ? (
            <canvas ref={canvasRef} className="max-w-full max-h-[400px] object-contain rounded shadow-md" />
          ) : (
            <div className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest flex flex-col items-center gap-2">
              <ZoomIn className="h-6 w-6 opacity-50" />
              Awaiting Canvas Load...
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
