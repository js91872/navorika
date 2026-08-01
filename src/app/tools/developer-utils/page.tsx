'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, ShieldCheck, Regex, Clock, Palette, Copy, Check } from 'lucide-react';
import { tools } from '@/data/registry';

export default function DeveloperUtilsTool() {
  const meta = tools.find(t => t.slug === 'developer-utils');
  const [mode, setMode] = useState<'regex' | 'epoch' | 'gradient'>('regex');
  const [copied, setCopied] = useState(false);

  // Regex State
  const [regexPattern, setRegexPattern] = useState('[A-Z]\\w+');
  const [regexFlags, setRegexFlags] = useState('g');
  const [regexTestString, setRegexTestString] = useState('Hello World, this is a Regex Test.');
  const [regexResult, setRegexResult] = useState<string[]>([]);
  const [regexError, setRegexError] = useState('');

  // Epoch State
  const [epochInput, setEpochInput] = useState(Math.floor(Date.now() / 1000).toString());
  const [epochResult, setEpochResult] = useState('');

  // Gradient State
  const [gradColor1, setGradColor1] = useState('#6366f1');
  const [gradColor2, setGradColor2] = useState('#a855f7');
  const [gradAngle, setGradAngle] = useState(135);

  useEffect(() => {
    // Regex Processing
    if (mode === 'regex') {
      try {
        const regex = new RegExp(regexPattern, regexFlags);
        const matches = regexTestString.match(regex);
        setRegexResult(matches ? Array.from(matches) : []);
        setRegexError('');
      } catch (err: any) {
        setRegexError(err.message);
        setRegexResult([]);
      }
    }
    
    // Epoch Processing
    if (mode === 'epoch') {
      const ms = epochInput.length > 10 ? parseInt(epochInput) : parseInt(epochInput) * 1000;
      if (!isNaN(ms)) {
        setEpochResult(new Date(ms).toLocaleString());
      } else {
        setEpochResult('Invalid Timestamp');
      }
    }
  }, [regexPattern, regexFlags, regexTestString, epochInput, mode]);

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!meta) return null;

  return (
    <main className="max-w-6xl mx-auto px-6 py-12 lg:px-8">
      <a href="/categories/developer-tools" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-emerald-600 transition mb-8"><ArrowLeft className="h-4 w-4" /> Back to Developer Tools</a>
      
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4 border border-emerald-500/20">
           <ShieldCheck className="h-4 w-4" /> Browser-Native Processing
        </div>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">{meta.heroTitle}</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">{meta.heroDescription}</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl overflow-hidden p-8 border border-slate-200 dark:border-slate-800">
        
        <div className="flex flex-wrap gap-4 border-b border-slate-100 dark:border-slate-800 pb-6 mb-8">
          <button onClick={() => setMode('regex')} className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold transition ${mode === 'regex' ? 'bg-emerald-600 text-white shadow' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}><Regex className="h-4 w-4"/> Regex Tester</button>
          <button onClick={() => setMode('epoch')} className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold transition ${mode === 'epoch' ? 'bg-emerald-600 text-white shadow' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}><Clock className="h-4 w-4"/> Unix Timestamp</button>
          <button onClick={() => setMode('gradient')} className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold transition ${mode === 'gradient' ? 'bg-emerald-600 text-white shadow' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}><Palette className="h-4 w-4"/> CSS Gradients</button>
        </div>

        {/* REGEX TESTER */}
        {mode === 'regex' && (
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4 flex flex-col">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-xs font-bold uppercase text-slate-500">Regular Expression</label>
                  <input type="text" value={regexPattern} onChange={e => setRegexPattern(e.target.value)} className="w-full mt-1 p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 outline-none text-sm font-mono" />
                </div>
                <div className="w-24">
                  <label className="text-xs font-bold uppercase text-slate-500">Flags</label>
                  <input type="text" value={regexFlags} onChange={e => setRegexFlags(e.target.value)} className="w-full mt-1 p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 outline-none text-sm font-mono" />
                </div>
              </div>
              <div className="flex-1 flex flex-col">
                <label className="text-xs font-bold uppercase text-slate-500">Test String</label>
                <textarea value={regexTestString} onChange={e => setRegexTestString(e.target.value)} className="w-full flex-1 min-h-[150px] mt-1 p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 outline-none text-sm font-mono resize-none" />
              </div>
            </div>
            <div className="space-y-2 flex flex-col">
               <label className="text-xs font-bold uppercase text-emerald-500">Match Results</label>
               {regexError ? (
                 <div className="p-4 bg-red-500/10 text-red-500 font-bold text-sm rounded-xl border border-red-500/20">{regexError}</div>
               ) : (
                 <div className="flex-1 p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 overflow-auto font-mono text-sm space-y-2">
                   {regexResult.length > 0 ? regexResult.map((match, i) => (
                     <div key={i} className="px-3 py-2 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 rounded border border-emerald-500/20 break-all flex items-center gap-4">
                       <span className="text-[10px] font-black text-emerald-600/50">[{i}]</span> {match}
                     </div>
                   )) : (
                     <span className="text-slate-400 font-bold italic">No matches found.</span>
                   )}
                 </div>
               )}
            </div>
          </div>
        )}

        {/* EPOCH CONVERTER */}
        {mode === 'epoch' && (
          <div className="grid md:grid-cols-2 gap-8 items-center min-h-[300px]">
             <div>
               <label className="text-xs font-bold uppercase text-slate-500">Unix Timestamp (Seconds or MS)</label>
               <div className="flex gap-2 mt-2">
                 <input type="number" value={epochInput} onChange={e => setEpochInput(e.target.value)} className="flex-1 p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 outline-none text-lg font-mono font-bold text-emerald-600 dark:text-emerald-400" />
                 <button onClick={() => setEpochInput(Math.floor(Date.now() / 1000).toString())} className="px-6 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-900 transition">Now</button>
               </div>
             </div>
             <div className="p-8 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
               <span className="text-xs font-bold uppercase text-slate-500 mb-2 block">Local Human Time</span>
               <h2 className="text-3xl font-black text-slate-900 dark:text-white">{epochResult}</h2>
             </div>
          </div>
        )}

        {/* CSS GRADIENTS */}
        {mode === 'gradient' && (
          <div className="grid md:grid-cols-2 gap-8">
             <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="text-xs font-bold uppercase text-slate-500 block mb-2">Color 1</label>
                    <input type="color" value={gradColor1} onChange={e => setGradColor1(e.target.value)} className="w-full h-12 rounded cursor-pointer" />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs font-bold uppercase text-slate-500 block mb-2">Color 2</label>
                    <input type="color" value={gradColor2} onChange={e => setGradColor2(e.target.value)} className="w-full h-12 rounded cursor-pointer" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2 text-xs font-bold uppercase text-slate-500"><span>Angle</span><span>{gradAngle}°</span></div>
                  <input type="range" min="0" max="360" value={gradAngle} onChange={e => setGradAngle(Number(e.target.value))} className="w-full accent-emerald-600" />
                </div>
                <div className="relative pt-4 border-t border-slate-100 dark:border-slate-800">
                  <textarea readOnly value={`background: linear-gradient(${gradAngle}deg, ${gradColor1}, ${gradColor2});`} className="w-full p-4 pr-12 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 outline-none font-mono text-sm text-emerald-600 dark:text-emerald-400 font-bold resize-none" />
                  <button onClick={() => copy(`background: linear-gradient(${gradAngle}deg, ${gradColor1}, ${gradColor2});`)} className="absolute right-4 top-1/2 mt-2 -translate-y-1/2 text-slate-400 hover:text-emerald-500"><Copy className="h-5 w-5"/></button>
                </div>
             </div>
             <div 
               className="w-full min-h-[300px] rounded-2xl shadow-inner border border-slate-200 dark:border-slate-800 transition-all duration-300"
               style={{ background: `linear-gradient(${gradAngle}deg, ${gradColor1}, ${gradColor2})` }}
             ></div>
          </div>
        )}
      </div>
    </main>
  );
}
