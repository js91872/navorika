'use client';

import { useState } from 'react';
import { ArrowLeft, ShieldCheck, FileJson, CheckCircle2, XCircle, Copy, Minimize2, AlignLeft, Trash2 } from 'lucide-react';
import { tools } from '@/data/registry';

export default function UniversalJsonStudioTool() {
  const meta = tools.find(t => t.slug === 'universal-json-studio');
  // Default meta if not found
  const toolMeta = meta || {
    heroTitle: "Universal Json Studio",
    heroDescription: "Process your documents efficiently with this tool.",
    formulaExplanation: "This tool processes your data locally in your browser for maximum privacy and speed.",
    faq: [
      { question: "How does this tool work?", answer: "All processing happens locally in your browser. No data is ever uploaded to any server." },
      { question: "Is my data safe?", answer: "Yes! Your files and data never leave your computer." },
      { question: "Do I need to install anything?", answer: "No installation needed. Everything runs directly in your web browser." }
    ]
  };

  const [input, setInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'valid' | 'invalid'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [copied, setCopied] = useState(false);

  const processJson = (action: 'beautify-2' | 'beautify-4' | 'minify') => {
    if (!input.trim()) {
      setStatus('idle');
      setErrorMessage('');
      return;
    }

    try {
      const parsed = JSON.parse(input);
      
      let result = '';
      if (action === 'beautify-2') {
        result = JSON.stringify(parsed, null, 2);
      } else if (action === 'beautify-4') {
        result = JSON.stringify(parsed, null, 4);
      } else if (action === 'minify') {
        result = JSON.stringify(parsed);
      }
      
      setInput(result);
      setStatus('valid');
      setErrorMessage('Valid JSON');
    } catch (err: any) {
      setStatus('invalid');
      setErrorMessage(err.message || 'Invalid JSON format');
    }
  };

  const handleCopy = () => {
    if (!input) return;
    navigator.clipboard.writeText(input);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInput('');
    setStatus('idle');
    setErrorMessage('');
  };

  if (!meta) return null;

  return (
    <main className="max-w-6xl mx-auto px-6 py-12 lg:px-8">
      <a href="/categories/developer-tools" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-emerald-600 transition mb-8"><ArrowLeft className="h-4 w-4" /> Back to Developer Tools</a>
      
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4 border border-emerald-500/20">
          <ShieldCheck className="h-4 w-4" /> Native Engine Parsing
        </div>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">{toolMeta.heroTitle}</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">{toolMeta.heroDescription}</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl overflow-hidden flex flex-col border border-slate-200 dark:border-slate-800">
        
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between p-4 bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800 gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <button onClick={() => processJson('beautify-2')} className="flex items-center gap-2 px-4 py-2 text-sm font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-emerald-500 hover:text-emerald-600 transition-colors">
              <AlignLeft className="h-4 w-4"/> Format (2 Spaces)
            </button>
            <button onClick={() => processJson('beautify-4')} className="flex items-center gap-2 px-4 py-2 text-sm font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-emerald-500 hover:text-emerald-600 transition-colors">
              <AlignLeft className="h-4 w-4"/> Format (4 Spaces)
            </button>
            <button onClick={() => processJson('minify')} className="flex items-center gap-2 px-4 py-2 text-sm font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-emerald-500 hover:text-emerald-600 transition-colors">
              <Minimize2 className="h-4 w-4"/> Minify
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            <button onClick={handleCopy} className="flex items-center gap-2 px-4 py-2 text-sm font-bold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition shadow">
              <Copy className="h-4 w-4"/> {copied ? 'Copied!' : 'Copy'}
            </button>
            <button onClick={handleClear} className="flex items-center gap-2 px-3 py-2 text-sm font-bold text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition">
              <Trash2 className="h-4 w-4"/> Clear
            </button>
          </div>
        </div>

        {/* Validation Status Bar */}
        {status !== 'idle' && (
          <div className={`px-4 py-2 text-sm font-bold flex items-center gap-2 ${status === 'valid' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-600'}`}>
            {status === 'valid' ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
            {errorMessage}
          </div>
        )}

        {/* Editor Area */}
        <div className="relative flex-1">
          <textarea 
            value={input}
            onChange={(e) => {
               setInput(e.target.value);
               if (status !== 'idle') setStatus('idle'); // Reset status on edit
            }}
            placeholder="Paste your JSON payload here..."
            className="w-full min-h-[500px] p-6 bg-transparent outline-none font-mono text-sm text-slate-800 dark:text-slate-300 resize-y"
            spellCheck="false"
          />
          {!input && (
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-slate-300 dark:text-slate-700">
              <FileJson className="h-16 w-16 mb-4 opacity-50" />
              <p className="font-bold uppercase tracking-widest text-sm">Awaiting Payload Data</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
