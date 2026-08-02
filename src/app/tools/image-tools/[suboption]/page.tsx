'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeft, Image as ImageIcon, Sliders, Layers } from 'lucide-react';

export default function BentoImageEngine() {
  const params = useParams();
  const suboption = (params?.suboption as string) || 'image-converter';

  return (
    <main className="h-[calc(100dvh-80px)] w-full relative overflow-hidden font-sans flex flex-col p-4 lg:p-8">
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none dark:mix-blend-screen"></div>
      
      <div className="flex-1 w-full max-w-7xl mx-auto flex flex-col min-h-0 gap-6 relative z-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
          <div>
            <a href="/categories/image-tools" className="inline-flex items-center gap-2 text-[10px] font-black text-slate-500 hover:text-purple-500 transition-colors mb-2 uppercase tracking-widest">
              <ArrowLeft className="h-3 w-3" /> Image Matrix
            </a>
            <h1 className="text-2xl lg:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 tracking-tight capitalize">
              {suboption.replace(/-/g, ' ')}
            </h1>
          </div>
        </div>

        <div className="flex-1 min-h-0 grid lg:grid-cols-12 gap-6">
          {/* Controls Parameters Grid */}
          <div className="lg:col-span-4 bg-white dark:bg-white/[0.02] backdrop-blur-3xl border border-slate-200 dark:border-white/10 rounded-[2rem] p-6 shadow-xl flex flex-col gap-6">
            <div className="flex items-center gap-2 text-xs font-black uppercase text-slate-400 tracking-wider">
              <Sliders className="h-4 w-4"/> Quantization
            </div>
            <div className="flex-1 border-2 border-dashed border-slate-200 dark:border-white/5 rounded-2xl flex flex-col justify-center items-center p-4">
              <span className="text-xs font-bold text-slate-400">Waiting for Media Asset buffer...</span>
            </div>
          </div>

          {/* Output Display Buffer Screen */}
          <div className="lg:col-span-8 bg-gradient-to-br from-purple-50 to-fuchsia-50 dark:from-purple-500/10 dark:to-fuchsia-500/10 backdrop-blur-3xl border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-12 flex flex-col justify-center items-center text-center">
            <ImageIcon className="h-16 w-16 text-purple-500 mb-4" />
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Viewport Processing Terminal</h2>
            <p className="text-sm font-medium text-slate-400 max-w-md">Multi-threaded canvas matrices render fully offline directly within your memory registers.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
