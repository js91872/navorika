'use client';

import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, ShieldCheck, Upload, X, Pipette, Copy, Check } from 'lucide-react';
import { tools } from '@/data/registry';

export default function ColorExtractionTool() {
  const meta = tools.find(t => t.slug === 'color-extraction-studio');
  // Default meta if not found
  const toolMeta = meta || {
    heroTitle: "Color Extraction Studio",
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
  const [pickedColor, setPickedColor] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (previewUrl && canvasRef.current) {
      const img = new Image();
      img.onload = () => {
        imgRef.current = img;
        drawCanvas();
      };
      img.src = previewUrl;
    }
  }, [previewUrl]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas || !imgRef.current) return;
    
    // Scale canvas to fit viewport visually but keep logical resolution high
    const maxW = 500;
    const ratio = imgRef.current.width / imgRef.current.height;
    canvas.width = Math.min(imgRef.current.width, maxW);
    canvas.height = canvas.width / ratio;
    
    ctx.drawImage(imgRef.current, 0, 0, canvas.width, canvas.height);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    // Map screen click coordinates to internal canvas buffer coordinates
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    const pixel = ctx.getImageData(x, y, 1, 1).data;
    const hex = `#${((1 << 24) + (pixel[0] << 16) + (pixel[1] << 8) + pixel[2]).toString(16).slice(1).toUpperCase()}`;
    setPickedColor(hex);
  };

  const copyToClipboard = () => {
    if (pickedColor) {
      navigator.clipboard.writeText(pickedColor);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!meta) return null;

  return (
    <main className="max-w-6xl mx-auto px-6 py-12 lg:px-8">
      <a href="/categories/image-tools" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-purple-600 transition mb-8"><ArrowLeft className="h-4 w-4" /> Back to Image Tools</a>
      <div className="text-center mb-10"><h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">{toolMeta.heroTitle}</h1></div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl overflow-hidden p-8 grid md:grid-cols-2 gap-8">
        
        {/* Workspace */}
        <div className="border border-slate-100 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-950 p-4 flex items-center justify-center min-h-[400px]">
          {!file ? (
             <div onClick={() => fileInputRef.current?.click()} className="text-center cursor-pointer hover:opacity-75 transition-opacity">
                <Upload className="h-10 w-10 text-purple-500 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Upload Asset to Analyze</h4>
                <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={(e) => {
                  if (e.target.files?.[0]) {
                    setFile(e.target.files[0]);
                    setPreviewUrl(URL.createObjectURL(e.target.files[0]));
                  }
                }} />
             </div>
          ) : (
            <div className="relative group cursor-crosshair">
              <span className="absolute -top-6 left-0 text-[10px] font-mono text-slate-400 font-bold uppercase">Click Image to Pick Exact Pixel Color</span>
              <canvas 
                ref={canvasRef} 
                onClick={handleCanvasClick}
                className="max-w-full max-h-[450px] object-contain shadow-md rounded border border-slate-200 dark:border-slate-700" 
              />
              <button onClick={() => { setFile(null); setPreviewUrl(''); setPickedColor(null); }} className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full shadow hover:bg-red-600 transition"><X className="h-3 w-3"/></button>
            </div>
          )}
        </div>

        {/* Results Panel */}
        <div className="space-y-6 flex flex-col justify-center">
          <div className="bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 p-8 rounded-3xl flex flex-col items-center justify-center text-center h-full min-h-[300px]">
             {pickedColor ? (
               <>
                 <div className="w-32 h-32 rounded-full shadow-inner mb-6 border-4 border-white dark:border-slate-800 transition-colors duration-200" style={{ backgroundColor: pickedColor }}></div>
                 <h2 className="text-4xl font-black font-mono text-slate-900 dark:text-white mb-4 tracking-wider">{pickedColor}</h2>
                 <button onClick={copyToClipboard} className="flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-2.5 rounded-full font-bold text-sm shadow hover:-translate-y-0.5 transition-transform">
                   {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                   {copied ? 'Copied to Clipboard' : 'Copy HEX Code'}
                 </button>
               </>
             ) : (
               <div className="flex flex-col items-center text-slate-400">
                 <Pipette className="h-12 w-12 mb-4 opacity-50" />
                 <p className="font-bold uppercase tracking-wider text-sm">Select a pixel on the canvas to extract data.</p>
               </div>
             )}
          </div>
        </div>

      </div>
    </main>
  );
}
