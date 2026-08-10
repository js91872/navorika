'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, ShieldCheck, Fingerprint, KeyRound, Lock, Copy, Check } from 'lucide-react';
import { tools } from '@/data/registry';

export default function WebCryptoStudioTool() {
  const meta = tools.find(t => t.slug === 'web-crypto-studio');
  const [uuid, setUuid] = useState<string>('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setUuid(crypto.randomUUID());
  }, []);

  const copy = (text: string) => navigator.clipboard.writeText(text);

  if (!meta) return null;

  return (
    <main className="max-w-6xl mx-auto px-6 py-12 lg:px-8">
      <a href="/categories/developer-tools" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-600 transition mb-8">
        <ArrowLeft className="h-4 w-4" /> Back to Developer Tools
      </a>

      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider border border-emerald-500/20">
          <ShieldCheck className="h-4 w-4" /> WebCrypto Hardware API
        </div>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">Web Crypto Studio</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">Encrypt, decrypt, hash, and sign data using Web Crypto API</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl p-8 border border-slate-200 dark:border-slate-800">
          <h3 className="text-lg font-black flex items-center gap-2 mb-4"><Fingerprint className="h-5 w-5 text-emerald-500" /> Secure Hash Generator</h3>
          <label className="text-xs font-bold uppercase text-slate-500">Input String</label>
          <input type="text" placeholder="Enter text to hash..." className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-indigo-500" />
        </div>

        <div className="space-y-8 flex flex-col">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl p-8 border border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-black flex items-center gap-2 mb-4"><KeyRound className="h-5 w-5 text-emerald-500" /> Password Generator</h3>
            <p className="font-mono text-sm text-center py-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-700">
              {isClient ? 'Click Generate to create a password' : 'Loading...'}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl p-8 border border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-black flex items-center gap-2 mb-4"><Lock className="h-5 w-5 text-emerald-500" /> UUID Generator</h3>
            <p className="font-mono text-sm text-center py-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-700">
              {isClient ? uuid : 'Loading...'}
            </p>
            <div className="flex gap-2 mt-4">
              <button onClick={() => copy(uuid)} className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 py-2 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">Copy</button>
              <button onClick={() => setUuid(crypto.randomUUID())} className="flex-1 bg-emerald-600 text-white py-2 rounded-xl font-bold hover:bg-emerald-700 transition-all">Generate</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
