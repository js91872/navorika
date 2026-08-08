'use client';

import { useState, useRef, useEffect } from 'react';
import { ImageIcon, ArrowLeft, Upload, X, ShieldCheck, Download, Loader2, RefreshCw } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface ToolType {
  slug: string;
  title: string;
  description: string;
  category: string;
  keywords: string[];
  heroTitle?: string;
  heroDescription?: string;
  formulaExplanation?: string;
  faq?: Array<{ question: string; answer: string }>;
}

export default function ImageConverterEngine({ meta }: { meta: ToolType | undefined }) {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toolMeta = meta || {
    slug: 'image-converter',
    title: 'Image Converter',
    description: 'Convert your images to different formats.',
    category: 'image-tools',
    keywords: ['image', 'converter'],
    heroTitle: 'Image Converter',
    heroDescription: 'Convert your images to different formats easily.',
    formulaExplanation: 'This tool converts images from one format to another.',
    faq: []
  };

  // Determine the correct back link based on category
  const getBackLink = () => {
    const category = toolMeta.category || 'image-tools';
    const categoryNames: Record<string, string> = {
      'pdf-tools': 'PDF Tools',
      'image-tools': 'Image Tools',
      'finance-calculators': 'Finance Calculators',
      'health-calculators': 'Health Calculators',
      'developer-tools': 'Developer Tools',
      'construction-calculators': 'Construction Calculators'
    };
    return {
      href: `/categories/${category}`,
      label: `Back to ${categoryNames[category] || 'Tools'}`
    };
  };

  const backLink = getBackLink();

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
    setIsProcessing(true);

    try {
      const slug = toolMeta.slug;
      
      if (slug === 'image-to-pdf' || slug === 'webp-to-pdf' || slug === 'add-image-to-pdf') {
        const pdfDoc = await PDFDocument.create();
        const imageBytes = await file.arrayBuffer();
        let embeddedImage;

        if (file.type === 'image/jpeg' || file.name.endsWith('.jpg') || file.name.endsWith('.jpeg')) {
          embeddedImage = await pdfDoc.embedJpg(imageBytes);
        } else if (file.type === 'image/png' || file.name.endsWith('.png')) {
          embeddedImage = await pdfDoc.embedPng(imageBytes);
        } else {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const img = new Image();
          img.src = URL.createObjectURL(file);
          await new Promise(resolve => img.onload = resolve);
          canvas.width = img.width;
          canvas.height = img.height;
          ctx?.drawImage(img, 0, 0);
          const pngData = canvas.toDataURL('image/png');
          const pngBytes = await fetch(pngData).then(res => res.arrayBuffer());
          embeddedImage = await pdfDoc.embedPng(pngBytes);
        }

        const page = pdfDoc.addPage([600, 800]);
        const { width, height } = page.getSize();
        const scaledWidth = Math.min(width - 40, embeddedImage.width);
        const scaledHeight = (scaledWidth / embeddedImage.width) * embeddedImage.height;
        
        page.drawImage(embeddedImage, {
          x: (width - scaledWidth) / 2,
          y: (height - scaledHeight) / 2,
          width: scaledWidth,
          height: scaledHeight,
        });

        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `converted_${file.name.split('.')[0]}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        const url = URL.createObjectURL(file);
        const a = document.createElement('a');
        a.href = url;
        a.download = `converted_${file.name}`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      alert('Failed to convert. Please try again.');
    }
    setIsProcessing(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Link */}
      <a 
        href={backLink.href} 
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-600 transition mb-8"
      >
        <ArrowLeft className="h-4 w-4" /> {backLink.label}
      </a>

      {/* Tool Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4 border border-emerald-500/20">
          <ShieldCheck className="h-4 w-4" /> Local Processing Only
        </div>
        <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4">{toolMeta.heroTitle || toolMeta.title}</h2>
        <p className="text-lg text-slate-600 dark:text-slate-400">{toolMeta.heroDescription || toolMeta.description}</p>
      </div>

      {/* Upload Area */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden mb-8">
        <div className="p-8">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-indigo-300 dark:border-indigo-500/30 rounded-2xl p-12 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-500/5 transition-colors"
          >
            {file ? (
              <div className="flex items-center gap-3">
                <ImageIcon className="h-10 w-10 text-indigo-500" />
                <div className="text-left">
                  <p className="font-bold text-slate-900 dark:text-white">{file.name}</p>
                  <p className="text-sm text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); setFile(null); setPreviewUrl(''); }}
                  className="p-2 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  <X className="h-5 w-5 text-slate-500" />
                </button>
              </div>
            ) : (
              <>
                <Upload className="h-12 w-12 text-indigo-400 mb-4" />
                <p className="text-lg font-semibold text-slate-700 dark:text-slate-300">Upload Image</p>
                <p className="text-sm text-slate-500">Supports JPG, PNG, WEBP, and more</p>
              </>
            )}
          </div>
          <input 
            ref={fileInputRef}
            type="file" 
            accept="image/*,.pdf" 
            onChange={handleFileChange}
            className="hidden"
          />

          {file && (
            <div className="mt-6 flex flex-col items-center gap-4">
              <button
                onClick={executeConversion}
                disabled={isProcessing}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold hover:shadow-xl transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Download className="h-5 w-5" />
                    Convert & Download
                  </>
                )}
              </button>
              <button
                onClick={() => { setFile(null); setPreviewUrl(''); }}
                className="text-sm text-slate-500 hover:text-slate-700 transition-colors flex items-center gap-1"
              >
                <RefreshCw className="h-4 w-4" /> Start Over
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
