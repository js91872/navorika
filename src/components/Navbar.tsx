'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FileText, Image as LucideImageIcon, Calculator, HeartPulse, Code, Hammer, Menu, X } from 'lucide-react';
import { categories } from '@/data/registry';
import { useState } from 'react';

const iconMap: { [key: string]: any } = {
  FileText: FileText,
  Image: LucideImageIcon,
  Calculator: Calculator,
  HeartPulse: HeartPulse,
  Code: Code,
  Hammer: Hammer,
};

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-black tracking-wider text-slate-900 dark:text-white uppercase">
                Navorika<span className="text-indigo-600 dark:text-indigo-400">Pro</span>
              </span>
            </Link>
            
            {/* Desktop Navigation Category Option List Links */}
            <div className="hidden md:flex items-center gap-6">
              {categories.map((cat) => {
                const Icon = iconMap[cat.icon] || FileText;
                const isActive = pathname === `/categories/${cat.slug}`;
                
                return (
                  <Link
                    key={cat.slug}
                    href={`/categories/${cat.slug}`}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                      isActive 
                        ? 'bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400' 
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{cat.name.split(' ')[0]}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Mobile hamburger activator */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Panel Dropdown Area */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-2 pb-4 space-y-2">
          {categories.map((cat) => {
            const Icon = iconMap[cat.icon] || FileText;
            const isActive = pathname === `/categories/${cat.slug}`;

            return (
              <Link
                key={cat.slug}
                href={`/categories/${cat.slug}`}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  isActive 
                    ? 'bg-indigo-600 text-white' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{cat.name}</span>
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}
