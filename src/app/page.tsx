'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, ArrowRight, Zap, Shield, SearchCode } from 'lucide-react';
import { tools, categories } from '@/data/registry';

export default function HomePage() {
  const [query, setQuery] = useState('');
  
  const filteredTools = query.trim() === '' 
    ? [] 
    : tools.filter(t => 
        t.title.toLowerCase().includes(query.toLowerCase()) || 
        t.keywords.some(k => k.toLowerCase().includes(query.toLowerCase()))
      ).slice(0, 5);

  return (
    <main className="relative isolate overflow-hidden">
      {/* Premium Hero Grid Header Section */}
      <div className="max-w-7xl mx-auto px-6 pt-24 pb-20 text-center lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-5xl font-black tracking-tight text-slate-900 dark:text-white sm:text-6xl bg-gradient-to-b from-slate-900 via-slate-800 to-slate-600 dark:from-white dark:via-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
            The Ultra-Fast Utility Portal
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            Zero latency, zero tracking server calls. Every calculator runs purely locally in your browser workspace.
          </p>
        </div>

        {/* Live Auto-Suggestion Search Bar Engine */}
        <div className="mt-10 max-w-2xl mx-auto relative z-30">
          <div className="relative rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all flex items-center px-4">
            <Search className="h-5 w-5 text-slate-400 mr-3 flex-shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tools instantly (e.g., SIP, EMI, PDF...)"
              className="w-full py-4 bg-transparent outline-none text-slate-900 dark:text-slate-100 text-base placeholder:text-slate-400"
            />
          </div>

          {/* Instant Client Suggestion Dropdown Drop */}
          {filteredTools.length > 0 && (
            <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-left">
              <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800/50 text-xs font-semibold tracking-wider text-slate-400 uppercase">Suggested Tools</div>
              {filteredTools.map((tool) => (
                <Link 
                  key={tool.slug} 
                  href={`/tools/${tool.slug}`}
                  className="flex items-center justify-between px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition text-sm font-semibold text-slate-700 dark:text-slate-300 border-b border-slate-100 dark:border-slate-800/40 last:border-0"
                >
                  <span>{tool.title}</span>
                  <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-indigo-500" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Structured Value Proposition Matrix */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 border-t border-slate-200/60 dark:border-slate-800/60 grid sm:grid-cols-3 gap-8">
        <div className="flex gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-slate-900">
          <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-500 h-fit"><Zap className="h-5 w-5" /></div>
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">Instant Execution</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Written in bare optimized JS loops to display solutions instantly.</p>
          </div>
        </div>
        <div className="flex gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-slate-900">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500 h-fit"><Shield className="h-5 w-5" /></div>
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">100% Client-Side Privacy</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Data never leaves your machine. Safe for financial calculations.</p>
          </div>
        </div>
        <div className="flex gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-slate-900">
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500 h-fit"><SearchCode className="h-5 w-5" /></div>
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">SEO Optimized</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Strict, crawlable deep semantic markup structures for optimal discovery.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
