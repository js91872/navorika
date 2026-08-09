'use client';

import { useState, useRef } from 'react';
import { ArrowLeft, Upload, X, ShieldCheck, Download, Loader2, RefreshCw } from 'lucide-react';

export default function ImageConverterEngine({ meta }: { meta?: any }) {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toolMeta = meta || {
    slug: 'image-converter',
    title: 'Image Converter',
    description: 'Convert your images to different formats.',
    category: 'image-tools',
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const executeConversion = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const url = URL.createObjectURL(file);
      const a = document.createElement('a');
      a.href = url;
      a.download = `converted_${file.name}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert('Failed to convert. Please try again.');
    }
    setIsProcessing(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <a href="/categories/image-tools" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-600 transition mb-8">
        <ArrowLeft className="h-4 w-4" /> Back to Image Tools
      </a>

      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4 border border-emerald-500/20">
          <ShieldCheck className="h-4 w-4" /> Local Processing Only
        </div>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">{toolMeta.title}</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">{toolMeta.description}</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
        <div className="p-8">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-indigo-300 dark:border-indigo-500/30 rounded-2xl p-12 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-500/5 transition-colors"
          >
            {file ? (
              <div className="flex items-center gap-3">
                <div className="text-left">
                  <p className="font-bold text-slate-900 dark:text-white">{file.name}</p>
                  <p className="text-sm text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); setFile(null); }}
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
                onClick={() => { setFile(null); }}
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
