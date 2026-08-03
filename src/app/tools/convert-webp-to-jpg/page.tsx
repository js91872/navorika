'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Upload, Download, Loader2, ImageIcon, ShieldCheck, X } from 'lucide-react';
import { tools } from '@/data/registry';

export default function ConvertWebpToJpgPage() {
  const meta = tools.find(t => t.slug === 'convert-webp-to-jpg');
  
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
    }
  };

  const handleConvert = async () => {
    if (!file) return;
    setIsProcessing(true);

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      const imageUrl = URL.createObjectURL(file);
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = imageUrl;
      });

      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);

      const jpgDataUrl = canvas.toDataURL('image/jpeg', 0.92);
      const response = await fetch(jpgDataUrl);
      const blob = await response.blob();
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name.replace(/\.[^/.]+$/, '') + '.jpg';
      a.click();
      URL.revokeObjectURL(url);
      
    } catch (err) {
      alert('Failed to convert image. Please try again.');
    }
    setIsProcessing(false);
  };

  return (
    <main className="max-w-4xl mx-auto px-6 py-12 lg:px-8">
      <Link href="/categories/image-tools" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-600 transition mb-8">
        <ArrowLeft className="h-4 w-4" /> Back to Image Tools
      </Link>

      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4 border border-emerald-500/20">
          <ShieldCheck className="h-4 w-4" /> Local Processing Only
        </div>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">
          Convert WEBP to JPG
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          Convert WEBP images to JPG format with high quality.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden mb-16">
        <div className="p-8">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-indigo-300 dark:border-indigo-500/30 rounded-2xl p-12 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-500/5 transition-colors"
          >
            {previewUrl ? (
              <div className="flex flex-col items-center gap-4">
                <img src={previewUrl} alt="Preview" className="max-h-48 rounded-lg" />
                <div className="flex items-center gap-3">
                  <ImageIcon className="h-6 w-6 text-indigo-500" />
                  <span className="font-medium">{file?.name}</span>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setFile(null); setPreviewUrl(''); }}
                    className="p-1 hover:bg-slate-200 rounded"
                  >
                    <X className="h-4 w-4 text-slate-500" />
                  </button>
                </div>
              </div>
            ) : (
              <>
                <Upload className="h-10 w-10 text-indigo-500 mb-4" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Upload WEBP Image</h3>
                <p className="text-sm text-slate-500 mt-2">Convert to JPG format</p>
              </>
            )}
            <input 
              type="file" 
              accept="image/webp" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleFileChange}
            />
          </div>

          {file && (
            <button
              onClick={handleConvert}
              disabled={isProcessing}
              className="w-full mt-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Converting...
                </>
              ) : (
                <>
                  <Download className="h-5 w-5" />
                  Convert to JPG & Download
                </>
              )}
            </button>
          )}
        </div>
      </div>

      <div className="prose prose-slate dark:prose-invert max-w-none">
        <h2 className="text-2xl font-bold mb-4">How it Works</h2>
        <p>This tool converts WEBP images to JPG format with high quality (92% compression).</p>
        <h3 className="text-xl font-bold mt-8 mb-4">Frequently Asked Questions</h3>
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <h4 className="font-bold text-slate-900 dark:text-white mb-2">Why convert WEBP to JPG?</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400">JPG is more widely supported across platforms and devices.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <h4 className="font-bold text-slate-900 dark:text-white mb-2">Is my image secure?</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400">Yes! All processing happens locally in your browser.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
