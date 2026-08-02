'use client';

import { useState } from 'react';
import { useTheme } from '../ThemeProvider';
import { Sun, Moon, Zap, LayoutDashboard, Grid, Wrench, BookOpen, Info, ShieldCheck, Menu, X } from 'lucide-react';
import Link from 'next/link';

export default function Navbar() {
  const { isDark, toggle } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 left-0 right-0 h-[80px] z-[9999] bg-white/80 dark:bg-[#0d0d11]/80 backdrop-blur-xl border-b border-slate-200/60 dark:border-white/10 flex items-center transition-colors duration-500">
      <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-indigo-600 p-2 rounded-xl shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <span className="font-black text-xl tracking-tighter text-slate-900 dark:text-white">
            Navorika<span className="text-indigo-600">Pro</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1.5">
            <LayoutDashboard className="h-4 w-4" /> Home
          </Link>
          <Link href="/categories" className="text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1.5">
            <Grid className="h-4 w-4" /> Categories
          </Link>
          <Link href="/tools" className="text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1.5">
            <Wrench className="h-4 w-4" /> Tools
          </Link>
          <Link href="/guides" className="text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1.5">
            <BookOpen className="h-4 w-4" /> Guides
          </Link>
          <Link href="/about" className="text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1.5">
            <Info className="h-4 w-4" /> About
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <div className="hidden xl:flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
            <ShieldCheck className="h-3.5 w-3.5" /> Secure
          </div>

          <button 
            onClick={toggle}
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 shadow-sm transition-all duration-300 hover:scale-[1.05]"
            aria-label="Toggle Theme"
          >
            {isDark ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4" />}
          </button>

          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Dropdown Navigation */}
      {mobileMenuOpen && (
        <div className="absolute top-[80px] left-0 right-0 bg-white dark:bg-[#0d0d11] border-b border-slate-200 dark:border-white/10 p-6 shadow-2xl md:hidden flex flex-col gap-4">
          <Link href="/" onClick={() => setMobileMenuOpen(false)} className="text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-200 py-2 flex items-center gap-2">
            <LayoutDashboard className="h-4 w-4 text-indigo-500" /> Home
          </Link>
          <Link href="/categories" onClick={() => setMobileMenuOpen(false)} className="text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-200 py-2 flex items-center gap-2">
            <Grid className="h-4 w-4 text-indigo-500" /> Categories
          </Link>
          <Link href="/tools" onClick={() => setMobileMenuOpen(false)} className="text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-200 py-2 flex items-center gap-2">
            <Wrench className="h-4 w-4 text-indigo-500" /> Tools
          </Link>
          <Link href="/guides" onClick={() => setMobileMenuOpen(false)} className="text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-200 py-2 flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-indigo-500" /> Guides
          </Link>
          <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-200 py-2 flex items-center gap-2">
            <Info className="h-4 w-4 text-indigo-500" /> About
          </Link>
        </div>
      )}
    </header>
  );
}
