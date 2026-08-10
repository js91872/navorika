'use client';

import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Image as ImageIcon, ShieldCheck, Download, Upload, X, Stamp } from 'lucide-react';
import { tools } from '@/data/registry';

export default function WatermarkImageTool() {
  const meta = tools.find(t => t.slug === 'watermark-image');
  // Default meta if not found
  const toolMeta = meta || {
    heroTitle: "Watermark Image",
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

  // Watermark Parameters
  const [watermarkText, setWatermarkText] = useState('© Navorika');
  const [opacity, setOpacity] = useState(0.5);
  const [position, setPosition] = useState('bottom-right');
  const [color, setColor] = useState('#ffffff');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (previewUrl && canvasRef.current) {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current!;
        canvas.width = img.width;
        canvas.height = img.height;
        renderWatermark(img, canvas);
      };
      img.src = previewUrl;
    }
  }, [previewUrl, watermarkText, opacity, position, color]);

  const renderWatermark = (img: HTMLImageElement, canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw origin image
    ctx.globalAlpha = 1.0;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Setup typography and style
    const fontSize = Math.max(20, canvas.width * 0.05); // Responsive font size
    ctx.font = `bold ${fontSize}px Arial, sans-serif`;
    ctx.fillStyle = color;
    ctx.globalAlpha = opacity;

    // Add slight shadow for readability
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;

    const metrics = ctx.measureText(watermarkText);
    const textWidth = metrics.width;
    const padding = fontSize;

    let x = 0;
    let y = 0;

    // Calculate Cartesian coordinates based on position mapping
    switch (position) {
      case 'top-left':
        x = padding;
        y = padding + fontSize;
        break;
      case 'top-right':
        x = canvas.width - textWidth - padding;
        y = padding + fontSize;
        break;
      case 'bottom-left':
        x = padding;
        y = canvas.height - padding;
        break;
      case 'bottom-right':
        x = canvas.width - textWidth - padding;
        y = canvas.height - padding;
        break;
      case 'center':
        x = (canvas.width - textWidth) / 2;
        y = (canvas.height + fontSize) / 2;
        break;
    }

    ctx.fillText(watermarkText, x, y);
    
    // Reset context state
    ctx.globalAlpha = 1.0;
    ctx.shadowColor = 'transparent';
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
    }
  };

  const downloadStampedImage = () => {
    if (!canvasRef.current || !file) return;
    setIsProcessing(true);
    
    canvasRef.current.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Navorika_Watermarked_${file.name}`;
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(url);
      }
      setIsProcessing(false);
    }, file.type, 0.95);
  };

  if (!meta) return null;

  return (
    <main className="max-w-5xl mx-auto px-6 py-12 lg:px-8">
      <a href="/categories/image-tools" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-purple-600 transition mb-8">
        <ArrowLeft className="h-4 w-4" /> Back to Image Tools
      </a>

      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-bold uppercase tracking-wider mb-4 border border-purple-500/20">
          <ShieldCheck className="h-4 w-4" /> Native Alpha Compositing
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
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Load Image</h4>
              <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 truncate w-32">{file.name}</span>
                <button onClick={() => { setFile(null); setPreviewUrl(''); }} className="text-slate-400 hover:text-red-500 transition-colors"><X className="h-3 w-3" /></button>
              </div>

              <div className="space-y-4 bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Watermark Text</label>
                  <input type="text" value={watermarkText} onChange={(e) => setWatermarkText(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none focus:border-purple-500 text-sm" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Color</label>
                    <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-full h-8 rounded cursor-pointer" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Position</label>
                    <select value={position} onChange={(e) => setPosition(e.target.value)} className="w-full px-2 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs outline-none">
                      <option value="bottom-right">Bottom Right</option>
                      <option value="bottom-left">Bottom Left</option>
                      <option value="top-right">Top Right</option>
                      <option value="top-left">Top Left</option>
                      <option value="center">Center</option>
                    </select>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-500 mb-1"><span>Opacity</span><span>{Math.round(opacity * 100)}%</span></div>
                  <input type="range" min="0.1" max="1.0" step="0.1" value={opacity} onChange={(e) => setOpacity(Number(e.target.value))} className="w-full accent-purple-600" />
                </div>
              </div>
            </div>
          )}

          {file && (
            <button onClick={downloadStampedImage} disabled={isProcessing} className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-bold transition shadow-md">
              <Download className="h-4 w-4" />
              {isProcessing ? 'Applying...' : 'Apply & Download'}
            </button>
          )}
        </div>

        {/* Live Canvas Preview */}
        <div className="md:col-span-2 border border-slate-100 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-950 p-4 flex items-center justify-center min-h-[300px] overflow-hidden">
          {file ? (
            <canvas ref={canvasRef} className="max-w-full max-h-[400px] object-contain rounded shadow-md" />
          ) : (
            <div className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest flex flex-col items-center gap-2">
              <Stamp className="h-6 w-6 opacity-50" />
              Awaiting Canvas Load...
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
