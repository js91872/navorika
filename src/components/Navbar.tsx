'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';
import ThemeToggle from '@/components/header/ThemeToggle';

interface NavbarProps {
  onSearchClick?: () => void;
}

export default function Navbar({ onSearchClick }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/80 dark:bg-[#060608]/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-white/5'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-xl font-black tracking-tighter text-slate-900 dark:text-white">
              Navorika<span className="text-indigo-600 dark:text-indigo-400">Pro</span>
            </span>
            <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-wider">
              β
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={onSearchClick}
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 dark:bg-white/5 border border-slate-200/20 dark:border-white/10 text-slate-600 dark:text-slate-300 text-sm hover:bg-white/20 transition-colors"
            >
              <Search className="h-4 w-4" />
              <span className="font-medium">Search tools...</span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-200/50 dark:bg-white/10 text-[10px] font-mono text-slate-500 dark:text-slate-400">
                ⌘K
              </kbd>
            </button>
            <ThemeToggle />
            <button
              onClick={onSearchClick}
              className="md:hidden p-2 rounded-full bg-white/10 dark:bg-white/5 text-slate-600 dark:text-slate-300"
            >
              <Search className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
