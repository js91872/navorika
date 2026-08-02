'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeft, Code, Cpu, Terminal } from 'lucide-react';

export default function BentoDeveloperEngine() {
  const params = useParams();
  const suboption = (params?.suboption as string) || 'universal-json-studio';

  return (
    <main className="h-[calc(100dvh-80px)] w-full relative overflow-hidden font-sans flex flex-col p-4 lg:p-8">
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none dark:mix-blend-screen"></div>
      
      <div className="flex-1 w-full max-w-7xl mx-auto flex flex-col min-h-0 gap-6 relative z-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
          <div>
            <a href="/categories/developer-tools" className="inline-flex items-center gap-2 text-[10px] font-black text-slate-500 hover:text-emerald-500 transition-colors mb-2 uppercase tracking-widest">
              <ArrowLeft className="h-3 w-3" /> Dev Workbench
            </a>
            <h1 className="text-2xl lg:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 tracking-tight capitalize">
              {suboption.replace(/-/g, ' ')}
            </h1>
          </div>
        </div>

        <div className="flex-1 min-h-0 grid lg:grid-cols-12 gap-6">
          {/* Input Data Stream Editor Block */}
          <div className="lg:col-span-6 bg-white dark:bg-white/[0.02] backdrop-blur-3xl border border-slate-200 dark:border-white/10 rounded-[2rem] p-6 shadow-xl flex flex-col gap-4">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2"><Terminal className="h-4 w-4"/> Input Buffer</span>
            <textarea className="flex-1 w-full p-4 bg-slate-50 dark:bg-black/40 border-2 border-transparent focus:border-emerald-500 rounded-2xl outline-none font-mono text-xs font-bold resize-none text-slate-900 dark:text-white transition-all" placeholder="Paste data stream layout payload directly here..." />
          </div>

          {/* Compiled Output View Panel */}
          <div className="lg:col-span-6 bg-slate-950 border border-slate-800 rounded-[2rem] p-6 flex flex-col gap-4 relative">
            <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest flex items-center gap-2"><Cpu className="h-4 w-4"/> Lexical Results</span>
            <div className="flex-1 bg-black/40 rounded-2xl border border-slate-800 flex items-center justify-center p-6 text-center font-mono text-xs text-slate-500 italic">
               Parsing loop idle... Enter string metrics.
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
