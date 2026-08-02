'use client';

import { useTheme } from './ThemeProvider';
import { Sun, Moon, Zap } from 'lucide-react';
import Link from 'next/link';

export default function Header() {
  const { isDark, toggle } = useTheme();

  return (
    <header className="fixed top-0 left-0 right-0 h-[80px] z-[9999] flex items-center px-4 lg:px-8 pointer-events-none">
      <nav className="w-full max-w-7xl mx-auto flex items-center justify-between bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border border-slate-200 dark:border-white/10 px-6 py-3 rounded-2xl shadow-xl transition-colors duration-500 pointer-events-auto">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-indigo-600 p-1.5 rounded-lg shadow-md group-hover:scale-105 transition-transform">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <span className="font-black text-lg tracking-tighter text-slate-900 dark:text-white">
            Navorika<span className="text-indigo-600">Pro</span>
          </span>
        </Link>

        <button 
          onClick={toggle}
          className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/10 transition-all text-slate-600 dark:text-slate-300 shadow-sm"
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
      </nav>
    </header>
  );
}
