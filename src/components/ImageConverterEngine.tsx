'use client';

import { useState, useRef, useEffect } from 'react';
import { ImageIcon, ArrowLeft, Upload, X, ShieldCheck, Download, Loader2, RefreshCw } from 'lucide-react';
import { ToolMeta } from '@/types';
import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export default function ImageConverterEngine({ meta }: { meta: ToolMeta }) {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => { if (previewUrl) URL.revokeObjectURL(previewUrl); };
  }, [previewUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
    }
  };

  const executeConversion = async () => {
    if (!file) return;
    setIsProcessing(false);
    setIsProcessing(true);

    try {
      const slug = meta.slug;
      
      // -----------------------------------------------------
      // MATRIX PIPELINE A: CONVERT GRAPHICS TO PDF CONTAINER
      // -----------------------------------------------------
      if (slug === 'image-to-pdf' || slug === 'webp-to-pdf') {
        const pdfDoc = await PDFDocument.create();
        const imageBytes = await file.arrayBuffer();
        let embeddedImage;

        if (file.type === 'image/jpeg' || file.name.endsWith('.jpg') || file.name.endsWith('.jpeg')) {
          embeddedImage = await pdfDoc.embedJpg(imageBytes);
        } else if (file.type === 'image/png' || file.name.endsWith('.png')) {
          embeddedImage = await pdfDoc.embedPng(imageBytes);
        } else {
          // Fallback mapping via browser canvas proxy
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const img = await loadImageProxy(previewUrl);
          canvas.width = img.width;
          canvas.height = img.height;
          ctx?.drawImage(img, 0, 0);
          const jpgUrl = canvas.toDataURL('image/jpeg', 0.9);
          const res = await fetch(jpgUrl);
          embeddedImage = await pdfDoc.embedJpg(await res.arrayBuffer());
        }

        const page = pdfDoc.addPage([embeddedImage.width, embeddedImage.height]);
        page.drawImage(embeddedImage, { x: 0, y: 0, width: embeddedImage.width, height: embeddedImage.height });
        
        downloadBlob(new Blob([await pdfDoc.save()], { type: 'application/pdf' }), `${file.name.split('.')[0]}.pdf`);
      }
      
      // -----------------------------------------------------
      // MATRIX PIPELINE B: RASTERIZE PDF PAGES INTO IMAGES
      // -----------------------------------------------------
      else if (slug === 'pdf-to-image') {
        const fileBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: fileBuffer }).promise;
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 2.0 });
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d');
        
        if (ctx) {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          await page.render({ canvasContext: ctx, viewport: viewport }).promise;
          canvas.toBlob((blob) => {
            if (blob) downloadBlob(blob, `${file.name.split('.')[0]}_page1.png`);
          }, 'image/png');
        }
      }

      // -----------------------------------------------------
      // MATRIX PIPELINE C: STANDARD FORMAT CONVERSIONS (CANVAS CORE)
      // -----------------------------------------------------
      else {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = await loadImageProxy(previewUrl);
        
        canvas.width = img.width;
        canvas.height = img.height;

        let targetMime = 'image/png';
        let targetExt = 'png';

        if (slug.endsWith('to-jpg') || slug.endsWith('to-jpeg')) {
          targetMime = 'image/jpeg';
          targetExt = 'jpg';
          // Fill background in case origin has transparency channels
          if (ctx) {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }
        } else if (slug.endsWith('to-webp')) {
          targetMime = 'image/webp';
          targetExt = 'webp';
        } else if (slug === 'png-to-svg') {
          // Simple client tracer mock vector path wrapper block for compatibility layers
          const mockSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${img.width}" height="${img.height}"><image href="${previewUrl}" width="${img.width}" height="${img.height}"/></svg>`;
          downloadBlob(new Blob([mockSvg], { type: 'image/svg+xml' }), `${file.name.split('.')[0]}.svg`);
          setIsProcessing(false);
          return;
        }

        ctx?.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) downloadBlob(blob, `${file.name.split('.')[0]}.${targetExt}`);
        }, targetMime, 0.9);
      }

    } catch (err) {
      console.error(err);
      alert("Execution error during asset transformation. Check format structural compliance.");
    }
    setIsProcessing(false);
  };

  const loadImageProxy = (url: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    });
  };

  const downloadBlob = (blob: Blob, name: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Navorika_${name}`;
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="max-w-4xl mx-auto px-6 py-12 lg:px-8">
      <a href="/categories/image-tools" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-purple-600 transition mb-8">
        <ArrowLeft className="h-4 w-4" /> Back to Image Tools
      </a>
      
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-bold uppercase tracking-wider mb-4 border border-purple-500/20">
          <ShieldCheck className="h-4 w-4" /> Local Pixel Transmutation
        </div>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">{meta.heroTitle}</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">{meta.heroDescription}</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden mb-16">
        {!file ? (
          <div className="p-8">
            <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-purple-300 dark:border-purple-500/30 rounded-2xl p-16 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-purple-50 dark:hover:bg-purple-500/5 transition-colors">
              <Upload className="h-10 w-10 text-purple-500 mb-4" />
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Upload Asset to Convert</h3>
              <p className="text-sm text-slate-400 mt-2">Processes instantly inside memory sandbox</p>
              <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
            </div>
          </div>
        ) : (
          <div className="p-8">
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 mb-8">
              <div className="flex items-center gap-3 overflow-hidden">
                <ImageIcon className="h-5 w-5 text-purple-500 flex-shrink-0" />
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 truncate">{file.name}</span>
              </div>
              <button onClick={() => setFile(null)} className="p-2 text-slate-400 hover:text-red-500 transition-colors"><X className="h-4 w-4" /></button>
            </div>

            <div className="flex justify-end border-t border-slate-100 dark:border-slate-800 pt-6">
              <button onClick={executeConversion} disabled={isProcessing} className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-bold transition shadow-md">
                {isProcessing ? <Loader2 className="h-5 w-5 animate-spin" /> : <RefreshCw className="h-5 w-5" />}
                {isProcessing ? 'Processing Pixels...' : 'Convert Asset & Download'}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
