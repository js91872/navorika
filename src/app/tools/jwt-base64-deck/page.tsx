'use client';

import { useState } from 'react';
import { ArrowLeft, ShieldCheck, Key, RefreshCw, Copy, Trash2, LockOpen } from 'lucide-react';
import { tools } from '@/data/registry';

export default function JwtBase64Tool() {
  const meta = tools.find(t => t.slug === 'jwt-base64-deck');
  // Default meta if not found
  const toolMeta = meta || {
    heroTitle: "Jwt Base64 Deck",
    heroDescription: "Process your documents efficiently with this tool.",
    formulaExplanation: "This tool processes your data locally in your browser for maximum privacy and speed.",
    faq: [
      { question: "How does this tool work?", answer: "All processing happens locally in your browser. No data is ever uploaded to any server." },
      { question: "Is my data safe?", answer: "Yes! Your files and data never leave your computer." },
      { question: "Do I need to install anything?", answer: "No installation needed. Everything runs directly in your web browser." }
    ]
  };

  const [mode, setMode] = useState<'base64' | 'jwt'>('jwt');
  const [input, setInput] = useState('');
  
  // Base64 State
  const [b64Mode, setB64Mode] = useState<'encode' | 'decode'>('decode');
  const [b64Output, setB64Output] = useState('');
  
  // JWT State
  const [jwtHeader, setJwtHeader] = useState('');
  const [jwtPayload, setJwtPayload] = useState('');
  const [jwtError, setJwtError] = useState('');

  const processBase64 = () => {
    try {
      if (b64Mode === 'encode') setB64Output(btoa(input));
      else setB64Output(atob(input));
    } catch (e) {
      setB64Output('Error: Invalid Base64 String');
    }
  };

  const processJwt = () => {
    if (!input) return;
    setJwtError('');
    try {
      const parts = input.split('.');
      if (parts.length !== 3) throw new Error('Invalid JWT format (must have 3 parts separated by dots).');
      
      const decodeB64Url = (str: string) => {
        const b64 = str.replace(/-/g, '+').replace(/_/g, '/');
        const pad = b64.length % 4 === 0 ? '' : '='.repeat(4 - (b64.length % 4));
        return atob(b64 + pad);
      };

      setJwtHeader(JSON.stringify(JSON.parse(decodeB64Url(parts[0])), null, 2));
      setJwtPayload(JSON.stringify(JSON.parse(decodeB64Url(parts[1])), null, 2));
    } catch (e: any) {
      setJwtError(e.message || 'Failed to decode token.');
      setJwtHeader('');
      setJwtPayload('');
    }
  };

  const copy = (text: string) => navigator.clipboard.writeText(text);

  if (!meta) return null;

  return (
    <main className="max-w-6xl mx-auto px-6 py-12 lg:px-8">
      <a href="/categories/developer-tools" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-emerald-600 transition mb-8"><ArrowLeft className="h-4 w-4" /> Back to Developer Tools</a>
      
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4 border border-emerald-500/20">
           <ShieldCheck className="h-4 w-4" /> Zero-API Token Inspector
        </div>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">{toolMeta.heroTitle}</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">{toolMeta.heroDescription}</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl overflow-hidden p-8 border border-slate-200 dark:border-slate-800">
        
        <div className="flex gap-4 border-b border-slate-100 dark:border-slate-800 pb-6 mb-6">
          <button onClick={() => { setMode('jwt'); setInput(''); }} className={`px-6 py-2 rounded-xl text-sm font-bold transition ${mode === 'jwt' ? 'bg-emerald-600 text-white shadow' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>JWT Inspector</button>
          <button onClick={() => { setMode('base64'); setInput(''); }} className={`px-6 py-2 rounded-xl text-sm font-bold transition ${mode === 'base64' ? 'bg-emerald-600 text-white shadow' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>Base64 Engine</button>
        </div>

        {mode === 'jwt' ? (
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4 flex flex-col">
              <label className="text-xs font-bold uppercase text-slate-500">Paste JWT Token</label>
              <textarea value={input} onChange={e => { setInput(e.target.value); processJwt(); }} className="w-full flex-1 min-h-[300px] p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 outline-none text-sm font-mono break-all" placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." />
              {jwtError && <p className="text-red-500 text-sm font-bold">{jwtError}</p>}
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold uppercase text-slate-500 text-emerald-500">Header (Algorithm & Type)</label>
                  <button onClick={() => copy(jwtHeader)} className="text-slate-400 hover:text-emerald-500"><Copy className="h-4 w-4"/></button>
                </div>
                <pre className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-mono overflow-auto text-emerald-600 dark:text-emerald-400 min-h-[100px]">{jwtHeader || '{}'}</pre>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold uppercase text-slate-500 text-blue-500">Payload (Data & Claims)</label>
                  <button onClick={() => copy(jwtPayload)} className="text-slate-400 hover:text-emerald-500"><Copy className="h-4 w-4"/></button>
                </div>
                <pre className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-mono overflow-auto text-blue-600 dark:text-blue-400 min-h-[250px]">{jwtPayload || '{}'}</pre>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase text-slate-500">Input String</label>
                <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                  <button onClick={() => setB64Mode('encode')} className={`px-4 py-1 rounded text-xs font-bold ${b64Mode === 'encode' ? 'bg-white dark:bg-slate-900 text-emerald-600 shadow-sm' : 'text-slate-500'}`}>Encode</button>
                  <button onClick={() => setB64Mode('decode')} className={`px-4 py-1 rounded text-xs font-bold ${b64Mode === 'decode' ? 'bg-white dark:bg-slate-900 text-emerald-600 shadow-sm' : 'text-slate-500'}`}>Decode</button>
                </div>
              </div>
              <textarea value={input} onChange={e => setInput(e.target.value)} className="w-full h-64 p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 outline-none text-sm font-mono" placeholder="String to process..." />
              <button onClick={processBase64} className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2"><RefreshCw className="h-4 w-4"/> Process Base64</button>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase text-slate-500">Output Result</label>
                <button onClick={() => copy(b64Output)} className="text-slate-400 hover:text-emerald-500"><Copy className="h-4 w-4"/></button>
              </div>
              <textarea readOnly value={b64Output} className="w-full h-[325px] p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 outline-none text-sm font-mono" />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
