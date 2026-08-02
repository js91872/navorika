'use client';

import { useTheme } from './ThemeProvider';
import { Sun, Moon, Zap, LayoutDashboard, Grid, Wrench, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function Header() {
  const { isDark, toggle } = useTheme();

  return (
    <header className="sticky top-0 left-0 right-0 h-[80px] z-[9999] bg-white/80 dark:bg-[#0A0A0B]/80 backdrop-blur-xl border-b border-slate-200/60 dark:border-white/10 flex items-center transition-colors duration-500">
      <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between">
        
        {/* Left: Brand Identity */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-indigo-600 p-2 rounded-xl shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <span className="font-black text-xl tracking-tighter text-slate-900 dark:text-white">
            Navorika<span className="text-indigo-600">Pro</span>
          </span>
        </Link>

        {/* Center: Primary Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-2">
            <LayoutDashboard className="h-4 w-4" /> Home
          </Link>
          <Link href="/#categories" className="text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-2">
            <Grid className="h-4 w-4" /> Categories
          </Link>
          <Link href="/tools/merge-pdf" className="text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-2">
            <Wrench className="h-4 w-4" /> Tools Hub
          </Link>
        </nav>

        {/* Right: Security Badge & Theme Control */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
            <ShieldCheck className="h-3.5 w-3.5" /> 100% Secure
          </div>

          <button 
            onClick={toggle}
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 shadow-sm transition-all duration-300 hover:scale-[1.05]"
            aria-label="Toggle Theme"
          >
            {isDark ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
        
      </div>
    </header>
  );
}
