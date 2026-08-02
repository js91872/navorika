'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, ArrowRight, Zap, Shield, SearchCode, FileText, Image, Calculator, HeartPulse, Code, Hammer } from 'lucide-react';
import { tools, categories } from '@/data/registry';

const iconMap: { [key: string]: any } = {
  FileText: FileText,
  Image: Image,
  Calculator: Calculator,
  HeartPulse: HeartPulse,
  Code: Code,
  Hammer: Hammer,
};

export default function HomePage() {
  const [query, setQuery] = useState('');
  
  const filteredTools = query.trim() === '' 
    ? [] 
    : tools.filter(t => 
        t.title.toLowerCase().includes(query.toLowerCase()) || 
        t.keywords.some(k => k.toLowerCase().includes(query.toLowerCase()))
      ).slice(0, 5);

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#0A0A0B] text-slate-900 dark:text-slate-100 pb-24 transition-colors duration-500">
      
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 pt-20 pb-12 text-center lg:px-8 relative">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-500/10 dark:bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none"></div>

        <div className="mx-auto max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-black uppercase tracking-widest mb-6 border border-indigo-500/20 shadow-sm">
            <Zap className="h-3.5 w-3.5" /> High-Speed Client Sandbox
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-6 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-600 dark:from-white dark:via-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
            The Universal Client Suite
          </h1>
          <p className="text-base sm:text-lg leading-relaxed text-slate-600 dark:text-slate-400 max-w-xl mx-auto font-medium">
            Zero latency, zero server tracking. Every utility and calculator runs purely locally inside your browser workspace.
          </p>
        </div>

        {/* Live Search Bar */}
        <div className="mt-10 max-w-2xl mx-auto relative z-30">
          <div className="relative rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-2xl focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all flex items-center px-5 py-1">
            <Search className="h-5 w-5 text-slate-400 mr-3 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tools instantly (e.g., CAGR, Compress PDF, JSON...)"
              className="w-full py-3 bg-transparent outline-none text-slate-900 dark:text-slate-100 text-sm sm:text-base placeholder:text-slate-400 font-medium"
            />
          </div>

          {/* Auto-Suggestions */}
          {filteredTools.length > 0 && (
            <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden text-left z-50">
              <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800/50 text-[10px] font-black tracking-widest text-slate-400 uppercase">Suggested Tools</div>
              {filteredTools.map((tool) => (
                <Link 
                  key={tool.slug} 
                  href={`/tools/${tool.slug}`}
                  className="flex items-center justify-between px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition text-sm font-bold text-slate-700 dark:text-slate-300 border-b border-slate-100 dark:border-slate-800/40 last:border-0 group"
                >
                  <span>{tool.title}</span>
                  <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Categories Matrix Grid with Scroll Target ID */}
      <div id="categories-section" className="max-w-7xl mx-auto px-6 lg:px-8 pb-20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">Browse Tool Suites</h2>
          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Total {tools.length} Tools Operational</span>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const SpecificIcon = iconMap[cat.icon] || FileText;
            const toolCount = tools.filter(t => t.category === cat.slug).length;

            return (
              <Link
                key={cat.slug}
                href={`/categories/${cat.slug}`}
                className="group relative p-8 bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden hover:-translate-y-1.5 backdrop-blur-xl"
              >
                <div>
                  <div className={`p-3.5 rounded-2xl bg-gradient-to-br ${cat.color} text-white w-fit mb-6 shadow-md`}>
                    <SpecificIcon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-8 font-medium">
                    {cat.description}
                  </p>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/5 text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                  <span>{toolCount} Tools Operational</span>
                  <div className="p-2 rounded-full bg-slate-100 dark:bg-white/5 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Value Proposition Cards */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 border-t border-slate-200 dark:border-white/10 pt-16 grid sm:grid-cols-3 gap-8">
        <div className="flex gap-4 p-6 rounded-[2rem] bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/10">
          <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-500 h-fit"><Zap className="h-5 w-5" /></div>
          <div>
            <h3 className="font-black text-sm text-slate-900 dark:text-slate-100 uppercase tracking-wider">Instant Execution</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium leading-relaxed">Written in bare optimized JS loops to display solutions instantly.</p>
          </div>
        </div>
        <div className="flex gap-4 p-6 rounded-[2rem] bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/10">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500 h-fit"><Shield className="h-5 w-5" /></div>
          <div>
            <h3 className="font-black text-sm text-slate-900 dark:text-slate-100 uppercase tracking-wider">100% Client Privacy</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium leading-relaxed">Data never leaves your machine. Safe for corporate data profiles.</p>
          </div>
        </div>
        <div className="flex gap-4 p-6 rounded-[2rem] bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/10">
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500 h-fit"><SearchCode className="h-5 w-5" /></div>
          <div>
            <h3 className="font-black text-sm text-slate-900 dark:text-slate-100 uppercase tracking-wider">SEO Optimized</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium leading-relaxed">Strict crawlable deep semantic markup structures for optimal discovery.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
