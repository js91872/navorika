'use client';

import { useState, useRef } from 'react';
import { ArrowLeft, Code, ShieldCheck, Download, RefreshCw } from 'lucide-react';
import { tools } from '@/data/registry';

export default function HtmlToImageTool() {
  const meta = tools.find(t => t.slug === 'html-to-image');
  // Default meta if not found
  const toolMeta = meta || {
    heroTitle: "Html To Image",
    heroDescription: "Process your documents efficiently with this tool.",
    formulaExplanation: "This tool processes your data locally in your browser for maximum privacy and speed.",
    faq: [
      { question: "How does this tool work?", answer: "All processing happens locally in your browser. No data is ever uploaded to any server." },
      { question: "Is my data safe?", answer: "Yes! Your files and data never leave your computer." },
      { question: "Do I need to install anything?", answer: "No installation needed. Everything runs directly in your web browser." }
    ]
  };

  const [htmlInput, setHtmlInput] = useState('<div style="padding: 40px; background: linear-gradient(135deg, #6366f1, #a855f7); color: white; border-radius: 20px; font-family: sans-serif; text-align: center;">\n  <h1 style="margin:0; font-size: 48px;">Hello Navorika</h1>\n  <p style="font-size: 20px; opacity: 0.9;">This markup is rendered securely offline.</p>\n</div>');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Canvas boundaries
  const [canvasWidth, setCanvasWidth] = useState(800);
  const [canvasHeight, setCanvasHeight] = useState(600);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const renderHtmlToCanvas = () => {
    setIsProcessing(true);
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    
    if (!ctx || !canvas) {
      setIsProcessing(false);
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Create an XML-backed SVG wrapping the HTML using foreignObject
    const svgData = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${canvasWidth}" height="${canvasHeight}">
        <foreignObject width="100%" height="100%">
          <div xmlns="http://www.w3.org/1999/xhtml" style="width: 100%; height: 100%; margin: 0;">
            ${htmlInput}
          </div>
        </foreignObject>
      </svg>
    `;

    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      setIsProcessing(false);
    };
    img.onerror = () => {
      alert("Markup parsing failed. Ensure HTML is structurally valid XML.");
      URL.revokeObjectURL(url);
      setIsProcessing(false);
    };
    
    img.src = url;
  };

  const downloadRender = () => {
    if (!canvasRef.current) return;
    canvasRef.current.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Navorika_Render_${Date.now()}.png`;
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(url);
      }
    }, 'image/png', 1.0);
  };

  if (!meta) return null;

  return (
    <main className="max-w-6xl mx-auto px-6 py-12 lg:px-8">
      <a href="/categories/image-tools" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-purple-600 transition mb-8">
        <ArrowLeft className="h-4 w-4" /> Back to Image Tools
      </a>

      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-bold uppercase tracking-wider mb-4 border border-purple-500/20">
          <ShieldCheck className="h-4 w-4" /> XML foreignObject Rasterization
        </div>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">{toolMeta.heroTitle}</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">{toolMeta.heroDescription}</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden p-8 grid md:grid-cols-2 gap-8">
        
        {/* Editor Column */}
        <div className="space-y-6 flex flex-col h-full">
          <div className="flex items-center gap-4">
            <div className="w-1/2">
              <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Width (px)</label>
              <input type="number" value={canvasWidth} onChange={(e) => setCanvasWidth(Number(e.target.value))} className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 outline-none text-sm font-mono" />
            </div>
            <div className="w-1/2">
              <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Height (px)</label>
              <input type="number" value={canvasHeight} onChange={(e) => setCanvasHeight(Number(e.target.value))} className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 outline-none text-sm font-mono" />
            </div>
          </div>
          
          <div className="flex-1">
            <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Raw HTML / Inline CSS</label>
            <textarea 
              value={htmlInput}
              onChange={(e) => setHtmlInput(e.target.value)}
              className="w-full h-64 p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-mono outline-none text-slate-700 dark:text-slate-300 resize-none whitespace-pre"
            />
          </div>
          
          <button onClick={renderHtmlToCanvas} disabled={isProcessing} className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white py-3 rounded-xl font-bold transition shadow-md">
            <RefreshCw className={`h-4 w-4 ${isProcessing ? 'animate-spin' : ''}`} />
            Render Layout to Canvas
          </button>
        </div>

        {/* Live Canvas Preview Column */}
        <div className="flex flex-col gap-4">
          <div className="flex-1 border border-slate-100 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-950 p-4 flex items-center justify-center overflow-auto relative min-h-[300px]">
             <canvas 
               ref={canvasRef} 
               width={canvasWidth} 
               height={canvasHeight} 
               className="bg-white shadow-sm max-w-full h-auto object-contain"
             />
          </div>
          <button onClick={downloadRender} className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-bold transition shadow-md">
            <Download className="h-4 w-4" />
            Download Image PNG
          </button>
        </div>

      </div>
    </main>
  );
}
