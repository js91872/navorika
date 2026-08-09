'use client';

import { useState } from 'react';
import { ArrowLeft, ShieldCheck, KeyRound, Lock, Fingerprint, Copy, RefreshCw } from 'lucide-react';
import { tools } from '@/data/registry';

export default function WebCryptoStudioTool() {
  const meta = tools.find(t => t.slug === 'web-crypto-studio');
  // Default meta if not found
  const toolMeta = meta || {
    heroTitle: "Web Crypto Tools",
    heroDescription: "Process your documents efficiently with this tool.",
    formulaExplanation: "This tool processes your data locally in your browser for maximum privacy and speed.",
    faq: [
      { question: "How does this tool work?", answer: "All processing happens locally in your browser. No data is ever uploaded to any server." },
      { question: "Is my data safe?", answer: "Yes! Your files and data never leave your computer." },
      { question: "Do I need to install anything?", answer: "No installation needed. Everything runs directly in your web browser." }
    ]
  };

  
  // Hash State
  const [hashInput, setHashInput] = useState('NavorikaSecure');
  const [hashResults, setHashResults] = useState({ sha1: '', sha256: '', sha512: '' });
  
  // Password State
  const [pwdLength, setPwdLength] = useState(16);
  const [pwdOutput, setPwdOutput] = useState('');
  const [pwdEntropy, setPwdEntropy] = useState('');
  
  // UUID
  const [uuid, setUuid] = useState(crypto.randomUUID());

  // Hardware-Accelerated Hashing via Web Crypto API
  const generateHashes = async (text: string) => {
    setHashInput(text);
    if (!text) return setHashResults({ sha1: '', sha256: '', sha512: '' });
    
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    
    const sha1 = await crypto.subtle.digest('SHA-1', data);
    const sha256 = await crypto.subtle.digest('SHA-256', data);
    const sha512 = await crypto.subtle.digest('SHA-512', data);
    
    const bufToHex = (buffer: ArrayBuffer) => Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, '0')).join('');
    setHashResults({ sha1: bufToHex(sha1), sha256: bufToHex(sha256), sha512: bufToHex(sha512) });
  };

  const generatePassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
    let pwd = "";
    const randomArray = new Uint32Array(pwdLength);
    crypto.getRandomValues(randomArray);
    for (let i = 0; i < pwdLength; i++) pwd += chars[randomArray[i] % chars.length];
    
    setPwdOutput(pwd);
    // Simple entropy calculation (Bits = Length * log2(CharsetSize))
    const entropyBits = Math.round(pwdLength * Math.log2(chars.length));
    if (entropyBits < 50) setPwdEntropy(`Weak (${entropyBits} bits)`);
    else if (entropyBits < 80) setPwdEntropy(`Strong (${entropyBits} bits)`);
    else setPwdEntropy(`Military Grade (${entropyBits} bits)`);
  };

  const copy = (text: string) => navigator.clipboard.writeText(text);

  if (!meta) return null;

  return (
    <main className="max-w-6xl mx-auto px-6 py-12 lg:px-8">
      <a href="/categories/developer-tools" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-emerald-600 transition mb-8"><ArrowLeft className="h-4 w-4" /> Back to Developer Tools</a>
      
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4 border border-emerald-500/20">
          <ShieldCheck className="h-4 w-4" /> WebCrypto Hardware API
        </div>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">{toolMeta.heroTitle}</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">{toolMeta.heroDescription}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        
        {/* Secure Hash Generator */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl p-8 border border-slate-200 dark:border-slate-800 space-y-6 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-black flex items-center gap-2 mb-4"><Fingerprint className="h-5 w-5 text-emerald-500"/> Hash Generator (SHA)</h3>
            <label className="text-xs font-bold uppercase text-slate-500">Input String</label>
            <input type="text" value={hashInput} onChange={(e) => generateHashes(e.target.value)} className="w-full mt-2 p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none font-mono text-sm" placeholder="Type to hash..." />
          </div>

          <div className="space-y-4">
            {Object.entries(hashResults).map(([algo, hash]) => (
              <div key={algo} className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 relative">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 absolute top-2 left-4">{algo.toUpperCase()}</span>
                <p className="font-mono text-xs text-slate-800 dark:text-slate-300 mt-4 break-all">{hash || '...'}</p>
                <button onClick={() => copy(hash)} className="absolute top-2 right-2 text-slate-400 hover:text-emerald-500"><Copy className="h-4 w-4"/></button>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-8 flex flex-col">
          {/* Password Generator */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl p-8 border border-slate-200 dark:border-slate-800 flex-1">
            <h3 className="text-lg font-black flex items-center gap-2 mb-4"><KeyRound className="h-5 w-5 text-emerald-500"/> Secure Password Engine</h3>
            
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold uppercase text-slate-500">Length</label>
              <span className="font-bold text-emerald-600">{pwdLength} characters</span>
            </div>
            <input type="range" min="8" max="128" value={pwdLength} onChange={e => setPwdLength(Number(e.target.value))} className="w-full accent-emerald-600 mb-6" />

            <div className="relative mb-6">
              <input readOnly value={pwdOutput} placeholder="Click Generate..." className="w-full p-4 pr-12 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none font-mono text-emerald-600 dark:text-emerald-400" />
              <button onClick={() => copy(pwdOutput)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-500"><Copy className="h-5 w-5"/></button>
            </div>

            <div className="flex items-center justify-between">
              <span className={`text-xs font-bold uppercase px-3 py-1 rounded-full ${pwdEntropy.includes('Weak') ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}`}>{pwdEntropy || 'Entropy: 0 bits'}</span>
              <button onClick={generatePassword} className="bg-slate-800 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-slate-900 transition"><RefreshCw className="h-4 w-4"/> Generate</button>
            </div>
          </div>

          {/* UUID Generator */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl p-8 border border-slate-200 dark:border-slate-800 flex flex-col justify-center relative">
            <h3 className="text-lg font-black flex items-center gap-2 mb-4"><Lock className="h-5 w-5 text-emerald-500"/> UUID v4 Generator</h3>
            <p className="font-mono text-sm text-center py-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 select-all">{uuid}</p>
            <div className="flex gap-2 mt-4">
              <button onClick={() => copy(uuid)} className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 py-2 rounded-lg font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition">Copy UUID</button>
              <button onClick={() => setUuid(crypto.randomUUID())} className="flex-1 bg-emerald-600 text-white py-2 rounded-lg font-bold hover:bg-emerald-700 transition">Generate New</button>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
