'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeft, Code, Cpu, Terminal } from 'lucide-react';

export default function CodeMinifierBeautifierTool() {
  const params = useParams();
  const suboption = (params?.suboption as string) || 'code-minifier-beautifier';

  const [inputCode, setInputCode] = useState('');
  const [outputCode, setOutputCode] = useState('');
  const [mode, setMode] = useState<'minify' | 'beautify'>('minify');
  const [language, setLanguage] = useState<'html' | 'css' | 'js'>('html');

  const handleProcess = () => {
    try {
      let result = inputCode;
      if (mode === 'minify') {
        if (language === 'html') {
          // Clean replacement without invalid regex literals
          result = result.replace(/\s+/g, ' ').replace(/>\s+</g, '><').trim();
        } else if (language === 'css') {
          result = result.replace(/\s+/g, ' ').trim();
        } else {
          result = result.replace(/\s+/g, ' ').trim();
        }
      } else {
        result = inputCode.split('\n').map(line => line.trim()).join('\n');
      }
      setOutputCode(result);
    } catch (e) {
      setOutputCode('Error processing code syntax.');
    }
  };

  return (
    <main className="min-h-screen w-full bg-slate-50 dark:bg-[#0A0A0B] text-slate-900 dark:text-slate-100 flex flex-col p-4 lg:p-8">
      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col gap-6">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
          <div>
            <a href="/categories/developer-tools" className="inline-flex items-center gap-2 text-[10px] font-black text-slate-500 hover:text-emerald-500 transition-colors mb-2 uppercase tracking-widest">
              <ArrowLeft className="h-3 w-3" /> Dev Workbench
            </a>
            <h1 className="text-2xl lg:text-3xl font-black tracking-tight capitalize">
              Code Minifier & Beautifier
            </h1>
          </div>
          
          <div className="flex items-center gap-2 bg-white dark:bg-white/5 p-1 rounded-xl border border-slate-200 dark:border-white/10">
            <button 
              onClick={() => setMode('minify')} 
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${mode === 'minify' ? 'bg-emerald-600 text-white' : 'text-slate-400'}`}
            >
              Minify
            </button>
            <button 
              onClick={() => setMode('beautify')} 
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${mode === 'beautify' ? 'bg-emerald-600 text-white' : 'text-slate-400'}`}
            >
              Beautify
            </button>
          </div>
        </div>

        <div className="flex-1 grid lg:grid-cols-2 gap-6 min-h-[400px]">
          
          <div className="bg-white dark:bg-white/[0.02] backdrop-blur-3xl border border-slate-200 dark:border-white/10 rounded-[2rem] p-6 shadow-xl flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                <Terminal className="h-4 w-4 text-emerald-500"/> Input Code Stream
              </span>
              <select 
                value={language} 
                onChange={(e) => setLanguage(e.target.value as any)}
                aria-label="Select Code Language"
                className="bg-slate-100 dark:bg-slate-800 text-xs font-bold px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700 outline-none"
              >
                <option value="html">HTML</option>
                <option value="css">CSS</option>
                <option value="js">JavaScript</option>
              </select>
            </div>
            
            <textarea 
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              className="flex-1 w-full p-4 bg-slate-50 dark:bg-black/40 border-2 border-transparent focus:border-emerald-500 rounded-2xl outline-none font-mono text-xs font-bold resize-none text-slate-900 dark:text-white transition-all" 
              placeholder="Paste raw source code here..." 
            />

            <button 
              onClick={handleProcess}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 transition-all text-xs uppercase tracking-widest"
            >
              Execute {mode}
            </button>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-[2rem] p-6 flex flex-col gap-4 relative shadow-2xl">
            <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest flex items-center gap-2">
              <Cpu className="h-4 w-4 text-emerald-400"/> Compiled Result
            </span>
            <textarea 
              readOnly
              value={outputCode}
              className="flex-1 w-full p-4 bg-black/40 rounded-2xl border border-slate-800 outline-none font-mono text-xs text-emerald-400 resize-none" 
              placeholder="Processed payload will display here..." 
            />
          </div>

        </div>
      </div>
    </main>
  );
}