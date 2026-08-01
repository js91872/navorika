'use client';

import { useState } from 'react';
import { ArrowLeft, ShieldCheck, Code2, Copy, Trash2, AlignLeft, Minimize2 } from 'lucide-react';
import { tools } from '@/data/registry';

export default function CodeMinifierTool() {
  const meta = tools.find(t => t.slug === 'code-minifier-beautifier');
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'html' | 'css' | 'js'>('css');
  const [copied, setCopied] = useState(false);

  // Fast offline RegEx formatting/minification engines
  const processCode = (action: 'minify' | 'beautify') => {
    if (!input.trim()) return;
    let result = input;

    if (action === 'minify') {
      if (mode === 'css') {
        result = result.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s+/g, ' ').replace(/\s*{\s*/g, '{').replace(/\s*}\s*/g, '}').replace(/\s*:\s*/g, ':').replace(/\s*;\s*/g, ';').trim();
      } else if (mode === 'js') {
        result = result.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*/g, '').replace(/\s+/g, ' ').replace(/\s*{\s*/g, '{').replace(/\s*}\s*/g, '}').replace(/\s*=\s*/g, '=').replace(/\s*\+\s*/g, '+').replace(/\s*-\s*/g, '-').trim();
      } else if (mode === 'html') {
        result = result.replace(//g, '').replace(/\s+/g, ' ').replace(/>\s+</g, '><').trim();
      }
    } else {
      // Basic Beautification
      if (mode === 'css') {
        result = result.replace(/{/g, ' {\n  ').replace(/}/g, '\n}\n').replace(/;/g, ';\n  ').replace(/\n\s*\n/g, '\n');
      } else if (mode === 'js') {
        result = result.replace(/{/g, ' {\n  ').replace(/}/g, '\n}\n').replace(/;/g, ';\n').replace(/\n\s*\n/g, '\n');
      } else if (mode === 'html') {
        result = result.replace(/>\s*</g, '>\n<').split('\n').map(line => line.trim()).join('\n  '); // Ultra-simple indent
      }
    }
    setInput(result);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(input);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!meta) return null;

  return (
    <main className="max-w-6xl mx-auto px-6 py-12 lg:px-8">
      <a href="/categories/developer-tools" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-emerald-600 transition mb-8"><ArrowLeft className="h-4 w-4" /> Back to Developer Tools</a>
      
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4 border border-emerald-500/20">
          <ShieldCheck className="h-4 w-4" /> Offline AST Regex Engine
        </div>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">{meta.heroTitle}</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">{meta.heroDescription}</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl overflow-hidden flex flex-col border border-slate-200 dark:border-slate-800">
        <div className="flex flex-wrap items-center justify-between p-4 bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800 gap-4">
          <div className="flex bg-slate-200 dark:bg-slate-800 rounded-lg p-1">
            {['html', 'css', 'js'].map((lang) => (
              <button key={lang} onClick={() => setMode(lang as any)} className={`px-6 py-1.5 rounded-md text-xs font-bold uppercase transition ${mode === lang ? 'bg-white dark:bg-slate-950 text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>
                {lang}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-2">
            <button onClick={() => processCode('beautify')} className="flex items-center gap-2 px-4 py-2 text-sm font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-emerald-500 hover:text-emerald-600 transition"><AlignLeft className="h-4 w-4"/> Format</button>
            <button onClick={() => processCode('minify')} className="flex items-center gap-2 px-4 py-2 text-sm font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-emerald-500 hover:text-emerald-600 transition"><Minimize2 className="h-4 w-4"/> Minify</button>
            <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-2"></div>
            <button onClick={handleCopy} className="flex items-center gap-2 px-4 py-2 text-sm font-bold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition shadow"><Copy className="h-4 w-4"/> {copied ? 'Copied' : 'Copy'}</button>
            <button onClick={() => setInput('')} className="flex items-center gap-2 px-3 py-2 text-sm font-bold text-slate-500 hover:text-red-500 rounded-lg transition"><Trash2 className="h-4 w-4"/></button>
          </div>
        </div>

        <div className="relative flex-1">
          <textarea 
            value={input} onChange={(e) => setInput(e.target.value)}
            placeholder={`Paste your ${mode.toUpperCase()} code here...`}
            className="w-full min-h-[500px] p-6 bg-transparent outline-none font-mono text-sm text-slate-800 dark:text-slate-300 resize-y" spellCheck="false"
          />
          {!input && (
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-slate-300 dark:text-slate-700">
              <Code2 className="h-16 w-16 mb-4 opacity-50" />
              <p className="font-bold uppercase tracking-widest text-sm">Awaiting Source Code</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
