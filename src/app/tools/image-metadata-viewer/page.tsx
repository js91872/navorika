'use client';

import { useState, useRef } from 'react';
import { ArrowLeft, Upload, FileSearch, X, HardDrive } from 'lucide-react';
import { tools } from '@/data/registry';

export default function MetadataViewerTool() {
  const meta = tools.find(t => t.slug === 'image-metadata-viewer');
  const [file, setFile] = useState<File | null>(null);
  const [imgDims, setImgDims] = useState({ w: 0, h: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      
      const img = new Image();
      img.onload = () => {
        setImgDims({ w: img.width, h: img.height });
      };
      img.src = URL.createObjectURL(selected);
    }
  };

  if (!meta) return null;

  return (
    <main className="max-w-4xl mx-auto px-6 py-12 lg:px-8">
      <a href="/categories/image-tools" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-purple-600 transition mb-8"><ArrowLeft className="h-4 w-4" /> Back to Image Tools</a>
      <div className="text-center mb-10"><h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">{meta.heroTitle}</h1></div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl overflow-hidden p-8">
        {!file ? (
          <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-purple-300 rounded-2xl p-12 text-center cursor-pointer">
            <FileSearch className="h-10 w-10 text-purple-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold">Upload Image to Inspect Data</h3>
            <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border">
              <span className="font-bold truncate">{file.name}</span>
              <button onClick={() => setFile(null)} className="text-red-500 hover:text-red-600"><X className="h-5 w-5"/></button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
               <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-2xl border space-y-4">
                 <h3 className="font-black flex items-center gap-2 text-slate-700 dark:text-slate-300"><HardDrive className="h-4 w-4"/> File Properties</h3>
                 <div className="flex justify-between border-b pb-2"><span className="text-sm font-bold text-slate-500">File Name</span><span className="text-sm font-mono">{file.name}</span></div>
                 <div className="flex justify-between border-b pb-2"><span className="text-sm font-bold text-slate-500">MIME Type</span><span className="text-sm font-mono">{file.type || 'Unknown'}</span></div>
                 <div className="flex justify-between border-b pb-2"><span className="text-sm font-bold text-slate-500">File Size</span><span className="text-sm font-mono">{(file.size / 1024).toFixed(2)} KB</span></div>
                 <div className="flex justify-between border-b pb-2"><span className="text-sm font-bold text-slate-500">Last Modified</span><span className="text-sm font-mono">{new Date(file.lastModified).toLocaleDateString()}</span></div>
               </div>
               
               <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-2xl border space-y-4">
                 <h3 className="font-black flex items-center gap-2 text-slate-700 dark:text-slate-300"><FileSearch className="h-4 w-4"/> Visual Matrices</h3>
                 <div className="flex justify-between border-b pb-2"><span className="text-sm font-bold text-slate-500">Width</span><span className="text-sm font-mono">{imgDims.w} px</span></div>
                 <div className="flex justify-between border-b pb-2"><span className="text-sm font-bold text-slate-500">Height</span><span className="text-sm font-mono">{imgDims.h} px</span></div>
                 <div className="flex justify-between border-b pb-2"><span className="text-sm font-bold text-slate-500">Megapixels</span><span className="text-sm font-mono">{((imgDims.w * imgDims.h) / 1000000).toFixed(2)} MP</span></div>
                 <div className="flex justify-between border-b pb-2"><span className="text-sm font-bold text-slate-500">Aspect Ratio</span><span className="text-sm font-mono">{(imgDims.w / imgDims.h).toFixed(2)}:1</span></div>
               </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
