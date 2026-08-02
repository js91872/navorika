'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, FileText, Shield, Sparkles, Upload } from 'lucide-react';

export default function BentoPdfEngine() {
  const params = useParams();
  const suboption = (params?.suboption as string) || 'merge-pdf';
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  return (
    <main className="h-[calc(100dvh-80px)] w-full relative overflow-hidden font-sans flex flex-col p-4 lg:p-8">
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-rose-500/10 rounded-full blur-[120px] pointer-events-none dark:mix-blend-screen"></div>
      
      <div className="flex-1 w-full max-w-7xl mx-auto flex flex-col min-h-0 gap-6 relative z-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
          <div>
            <a href="/categories/pdf-tools" className="inline-flex items-center gap-2 text-[10px] font-black text-slate-500 hover:text-rose-500 transition-colors mb-2 uppercase tracking-widest">
              <ArrowLeft className="h-3 w-3" /> PDF Suite
            </a>
            <h1 className="text-2xl lg:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 tracking-tight capitalize">
              {suboption.replace(/-/g, ' ')}
            </h1>
          </div>
        </div>

        <div className="flex-1 min-h-0 grid lg:grid-cols-12 gap-6">
          {/* Upload Configuration Panel */}
          <div className="lg:col-span-5 bg-white dark:bg-white/[0.02] backdrop-blur-3xl border border-slate-200 dark:border-white/10 rounded-[2rem] p-6 shadow-xl flex flex-col justify-center items-center gap-4 border-dashed border-2">
            <Upload className="h-10 w-10 text-slate-400 animate-bounce" />
            <p className="text-sm font-bold text-slate-500 text-center">Drag and drop documents or click to upload</p>
            <span className="text-[10px] uppercase font-black tracking-widest text-slate-400">100% Client-Side Sandbox</span>
          </div>

          {/* Visualization Studio Workspace Panel */}
          <div className="lg:col-span-7 bg-gradient-to-br from-rose-50 to-orange-50 dark:from-rose-500/10 dark:to-orange-500/10 backdrop-blur-3xl border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-12 flex flex-col justify-center items-center relative overflow-hidden group">
            <FileText className="h-16 w-16 text-rose-500 mb-4" />
            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">Workspace Matrix</h3>
            <p className="text-xs font-medium text-slate-400 max-w-xs text-center">Drop components locally onto the workspace grid parameters.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
