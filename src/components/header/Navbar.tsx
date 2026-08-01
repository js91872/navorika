'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '../ui/ThemeContext';
import { Sun, Moon, Menu, X, Layers } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { name: 'Home', href: '/' },
    { name: 'Categories', href: '/categories' },
    { name: 'Tools', href: '/tools' },
    { name: 'Guides', href: '/guides' },
    { name: 'About', href: '/about' },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2 font-black text-xl tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Navorika <span className="text-xs px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 uppercase tracking-widest font-bold">Pro</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => {
              const active = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-150 ${
                    active 
                      ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' 
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-900/50'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
            <button onClick={toggleTheme} className="ml-4 p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-500 dark:text-slate-400 transition" aria-label="Toggle Theme">
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>

          <div className="md:hidden flex items-center gap-2">
            <button onClick={toggleTheme} className="p-2 rounded-xl text-slate-500" aria-label="Toggle Theme">
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 rounded-xl text-slate-500">
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>
      {mobileOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-4 space-y-1">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-2.5 rounded-xl text-base font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900"
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
