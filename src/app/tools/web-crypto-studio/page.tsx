'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Copy, Fingerprint, KeyRound, Lock, ShieldCheck } from 'lucide-react';

const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*_-+=';

function randomPassword(length: number) {
  const output: string[] = [];
  const limit = Math.floor(0x100000000 / alphabet.length) * alphabet.length;
  while (output.length < length) {
    const values = new Uint32Array(length - output.length);
    crypto.getRandomValues(values);
    for (const value of values) {
      if (value < limit) output.push(alphabet[value % alphabet.length]);
      if (output.length === length) break;
    }
  }
  return output.join('');
}

export default function Page() {
  const [hashInput, setHashInput] = useState('');
  const [hash, setHash] = useState('');
  const [length, setLength] = useState(20);
  const [password, setPassword] = useState('');
  const [uuid, setUuid] = useState('');
  const [isSupported, setIsSupported] = useState<boolean | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const supported = typeof crypto !== 'undefined'
      && typeof crypto.getRandomValues === 'function'
      && typeof crypto.randomUUID === 'function'
      && Boolean(crypto.subtle);
    setIsSupported(supported);
    if (!supported) {
      setError('Web Crypto is unavailable. Use a current browser in a secure HTTPS context.');
      return;
    }
    try {
      setUuid(crypto.randomUUID());
      setPassword(randomPassword(20));
    } catch {
      setIsSupported(false);
      setError('Web Crypto could not initialize in this browser context.');
    }
  }, []);

  const makeHash = async () => {
    if (!isSupported) return;
    setError('');
    try {
      const bytes = new TextEncoder().encode(hashInput);
      const digest = await crypto.subtle.digest('SHA-256', bytes);
      setHash(Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join(''));
    } catch {
      setHash('');
      setError('The SHA-256 digest could not be generated in this browser.');
    }
  };

  const generatePassword = () => {
    if (!isSupported) return;
    try {
      setPassword(randomPassword(length));
      setError('');
    } catch {
      setError('A secure random password could not be generated in this browser.');
    }
  };

  const generateUuid = () => {
    if (!isSupported) return;
    try {
      setUuid(crypto.randomUUID());
      setError('');
    } catch {
      setError('A UUID could not be generated in this browser.');
    }
  };

  const copy = async (text: string) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setError('');
    } catch {
      setError('Clipboard access was denied. Select and copy the value manually.');
    }
  };

  return <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
    <Link href="/categories/developer-tools" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 mb-8"><ArrowLeft className="h-4 w-4" /> Back to Developer Tools</Link>
    <div className="text-center mb-10"><div className="inline-flex gap-2 text-xs font-bold text-emerald-600"><ShieldCheck className="h-4 w-4" /> BROWSER WEB CRYPTO</div><h1 className="text-4xl font-black mt-4">Web Crypto Studio</h1><p className="mt-3 text-slate-500">Generate SHA-256 hashes, random passwords, and UUID v4 identifiers locally.</p></div>
    {error && <p role="alert" className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">{error}</p>}
    <div className="grid lg:grid-cols-2 gap-6">
      <section className="bg-white dark:bg-slate-900 rounded-3xl border p-5 sm:p-6"><h2 className="font-black flex gap-2"><Fingerprint className="h-5 w-5 text-emerald-500" /> SHA-256</h2><textarea value={hashInput} onChange={event => { setHashInput(event.target.value); setHash(''); }} disabled={!isSupported} className="mt-4 w-full min-h-32 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border" placeholder="Text to hash" /><button type="button" onClick={() => void makeHash()} disabled={!isSupported} className="mt-3 w-full py-3 rounded-xl bg-emerald-600 text-white font-bold disabled:opacity-50">Generate hash</button>{hash && <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 break-all font-mono text-xs">{hash}<button type="button" aria-label="Copy hash" onClick={() => void copy(hash)} className="ml-2"><Copy className="h-4 w-4" /></button></div>}</section>
      <div className="space-y-6">
        <section className="bg-white dark:bg-slate-900 rounded-3xl border p-5 sm:p-6"><h2 className="font-black flex gap-2"><KeyRound className="h-5 w-5 text-emerald-500" /> Random password</h2><label className="mt-4 block text-sm font-bold">Length: {length}<input type="range" min={12} max={64} value={length} onChange={event => setLength(Number(event.target.value))} disabled={!isSupported} className="w-full mt-2" /></label><p className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 break-all font-mono min-h-12">{password}</p><div className="grid grid-cols-2 gap-2 mt-3"><button type="button" onClick={generatePassword} disabled={!isSupported} className="py-2 rounded-xl bg-emerald-600 text-white font-bold disabled:opacity-50">Generate</button><button type="button" onClick={() => void copy(password)} disabled={!password} className="py-2 rounded-xl bg-slate-200 dark:bg-slate-800 font-bold disabled:opacity-50">Copy</button></div><p className="mt-3 text-xs text-slate-500">Uses Web Crypto random values with rejection sampling to avoid modulo bias. This is not a password manager.</p></section>
        <section className="bg-white dark:bg-slate-900 rounded-3xl border p-5 sm:p-6"><h2 className="font-black flex gap-2"><Lock className="h-5 w-5 text-emerald-500" /> UUID v4</h2><p className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 font-mono text-sm break-all min-h-12">{uuid}</p><div className="grid grid-cols-2 gap-2 mt-3"><button type="button" onClick={generateUuid} disabled={!isSupported} className="py-2 rounded-xl bg-emerald-600 text-white font-bold disabled:opacity-50">Generate</button><button type="button" onClick={() => void copy(uuid)} disabled={!uuid} className="py-2 rounded-xl bg-slate-200 dark:bg-slate-800 font-bold disabled:opacity-50">Copy</button></div></section>
      </div>
    </div>
  </main>;
}
