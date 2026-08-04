'use client';

import { motion } from 'framer-motion';
import { Search, Shield, Zap, Sparkles } from 'lucide-react';

interface EnhancedHeroProps {
  onSearchClick: () => void;
  toolCount: number;
}

export default function EnhancedHero({ onSearchClick, toolCount }: EnhancedHeroProps) {
  return (
    <section className="relative px-4 pt-24 pb-16 md:pt-32 md:pb-24 text-center">
      <div className="max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-400" />
          </span>
          Zero-latency · Local processing
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.1] mb-6">
          Tools that feel like
          <br />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            extensions of your mind
          </span>
        </h1>

        <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto text-lg mb-8">
          {toolCount}+ utilities, calculators, and converters — all running
          instantly in your browser. No uploads. No tracking.
        </p>

        <button
          onClick={onSearchClick}
          className="flex items-center gap-3 max-w-lg mx-auto w-full p-3 rounded-full bg-[var(--card)] border border-[var(--border]] hover:border-indigo-400/50 transition-all text-left"
        >
          <Search className="h-5 w-5 text-[var(--muted-foreground)] ml-2" />
          <span className="flex-1 text-[var(--muted-foreground)]">Search any tool...</span>
          <kbd className="px-2 py-1 rounded bg-[var(--muted)] text-[var(--muted-foreground)] text-xs font-mono">⌘K</kbd>
        </button>

        <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-sm text-[var(--muted-foreground)]">
          <span className="flex items-center gap-2"><Shield className="h-4 w-4 text-emerald-500" /> 100% client-side</span>
          <span className="w-px h-4 bg-[var(--border)]" />
          <span className="flex items-center gap-2"><Zap className="h-4 w-4 text-indigo-500" /> No data uploaded</span>
          <span className="w-px h-4 bg-[var(--border)]" />
          <span className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-amber-500" /> {toolCount}+ tools</span>
        </div>
      </div>
    </section>
  );
}
