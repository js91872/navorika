'use client';

import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, ShieldCheck, Upload, X, User, Download, Crop } from 'lucide-react';
import { tools } from '@/data/registry';

// Standard 300 DPI resolutions for professional printing
const PRESETS = [
  { id: 'us_passport', name: 'US Passport / Visa (2x2 in)', w: 600, h: 600 },
  { id: 'uk_passport', name: 'UK / Europe / AU (35x45 mm)', w: 413, h: 531 },
  { id: 'in_passport', name: 'India Passport (3.5x4.5 cm)', w: 413, h: 531 },
  { id: 'in_pan', name: 'India PAN Card (2.5x3.5 cm)', w: 295, h: 413 },
  { id: 'linkedin', name: 'Standard Profile (Square)', w: 800, h: 800 },
];

export default function IdPhotoMakerTool() {
  const meta = tools.find(t => t.slug === 'id-photo-maker');
  // Default meta if not found
  const toolMeta = meta || {
    heroTitle: "Id Photo Maker",
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
  
  const [formatId, setFormatId] = useState(PRESETS[0].id);
  const [zoom, setZoom] = useState(1);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const activeFormat = PRESETS.find(p => p.id === formatId) || PRESETS[0];

  useEffect(() => {
    if (previewUrl) {
      const img = new Image();
      img.onload = () => {
        imgRef.current = img;
        drawCanvas();
      };
      img.src = previewUrl;
    }
  }, [previewUrl, formatId, zoom, offsetX, offsetY]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas || !imgRef.current) return;

    const img = imgRef.current;
    
    // Set target canvas physical pixels
    canvas.width = activeFormat.w;
    canvas.height = activeFormat.h;

    // Fill background with white (standard for passports)
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Calculate base scale to fill the frame
    const scale = Math.max(canvas.width / img.width, canvas.height / img.height) * zoom;
    const drawW = img.width * scale;
    const drawH = img.height * scale;

    // Center image and apply manual offsets
    const drawX = (canvas.width - drawW) / 2 + offsetX;
    const drawY = (canvas.height - drawH) / 2 + offsetY;

    ctx.drawImage(img, drawX, drawY, drawW, drawH);
  };

  const handleDownload = () => {
    if (!canvasRef.current || !file) return;
    canvasRef.current.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Navorika_${activeFormat.name.split(' ')[0]}_Photo.jpg`;
        document.body.appendChild(a);
        a.click();
      }
    }, 'image/jpeg', 1.0); // Passports require high quality JPG
  };

  if (!meta) return null;

  return (
    <main className="max-w-6xl mx-auto px-6 py-12 lg:px-8">
      <a href="/categories/image-tools" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-purple-600 transition mb-8"><ArrowLeft className="h-4 w-4" /> Back to Image Tools</a>
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-bold uppercase tracking-wider mb-4 border border-purple-500/20">
           <ShieldCheck className="h-4 w-4" /> 300 DPI Biometric Crop
        </div>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">{toolMeta.heroTitle}</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">{toolMeta.heroDescription}</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl overflow-hidden p-8 grid md:grid-cols-2 gap-8">
        
        {/* Controls */}
        <div className="space-y-6 flex flex-col justify-between">
          {!file ? (
            <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-purple-300 rounded-2xl p-12 text-center cursor-pointer h-64 flex flex-col justify-center">
              <Upload className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Load Portrait Photo</h4>
              <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={(e) => {
                if (e.target.files?.[0]) {
                  setFile(e.target.files[0]);
                  setPreviewUrl(URL.createObjectURL(e.target.files[0]));
                  setZoom(1); setOffsetX(0); setOffsetY(0);
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
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-500">Document Standard</label>
                  <select value={formatId} onChange={(e) => setFormatId(e.target.value)} className="w-full mt-1 p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-bold">
                    {PRESETS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                  <div className="flex justify-between text-[10px] font-bold uppercase text-slate-500 mb-1"><span>Zoom</span><span>{Math.round(zoom * 100)}%</span></div>
                  <input type="range" min="1" max="3" step="0.05" value={zoom} onChange={(e) => setZoom(Number(e.target.value))} className="w-full accent-purple-600" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div>
                     <label className="text-[10px] font-bold uppercase text-slate-500">Pan Horizontal (X)</label>
                     <input type="range" min="-300" max="300" value={offsetX} onChange={(e) => setOffsetX(Number(e.target.value))} className="w-full accent-purple-600 mt-1" />
                   </div>
                   <div>
                     <label className="text-[10px] font-bold uppercase text-slate-500">Pan Vertical (Y)</label>
                     <input type="range" min="-300" max="300" value={offsetY} onChange={(e) => setOffsetY(Number(e.target.value))} className="w-full accent-purple-600 mt-1" />
                   </div>
                </div>
              </div>
              
              <button onClick={handleDownload} className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition shadow-md">
                <Download className="h-4 w-4"/> Extract Official Photo
              </button>
            </div>
          )}
        </div>

        {/* Viewport Canvas with Face Guide */}
        <div className="border border-slate-100 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-950 p-4 flex items-center justify-center min-h-[400px] relative overflow-hidden">
          {file ? (
            <div className="relative inline-block border shadow-sm bg-white">
               {/* Head bounding box guide overlay (invisible on download, visible in editor) */}
               <div className="absolute inset-0 pointer-events-none border-[3px] border-dashed border-red-500/50 m-[10%] rounded-[40%] flex items-center justify-center">
                 <span className="text-red-500/50 font-bold text-xs uppercase tracking-widest text-center px-4">Align Face Inside Target</span>
               </div>
               <canvas ref={canvasRef} className="max-w-[300px] md:max-w-[350px] object-contain" />
            </div>
          ) : (
            <div className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest"><User className="h-8 w-8 opacity-50 mx-auto mb-2" /> Awaiting Portrait</div>
          )}
        </div>

      </div>
    </main>
  );
}
