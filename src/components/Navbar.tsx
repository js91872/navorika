'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Sun, Moon, Search } from 'lucide-react';
import { useTheme } from 'next-themes';
import Logo from '@/components/ui/Logo';
import LanguageSwitcher from '@/components/i18n/LanguageSwitcher';
import styles from './Navbar.module.css';

interface NavbarProps {
  onSearchClick?: () => void;
}

export default function Navbar({ onSearchClick }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  const navLinks = [
    { href: '/tools', label: 'All Tools' },
    { href: '/categories', label: 'Categories' },
    { href: '/guides', label: 'Guides' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-[#18181b] border-b border-[#e5e5e8] dark:border-[#27272a] shadow-xs transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-2 min-[360px]:px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Preserve existing Navorika logo */}
          <div className={`shrink-0 ${styles.brand}`}>
            <Logo size="md" />
          </div>

          {/* Desktop Navigation */}
          <nav aria-label="Main navigation" className="hidden lg:flex items-center gap-6 text-sm font-semibold">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors duration-150 py-1 ${
                  isActive(link.href)
                    ? 'text-[#e5322d] font-bold'
                    : 'text-[#52525b] dark:text-[#a1a1aa] hover:text-[#e5322d] dark:hover:text-[#ef4444]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side controls in exact order: Language, Search, Theme, Mobile Menu */}
          <div className="flex shrink-0 items-center gap-0 sm:gap-2">
            <LanguageSwitcher locale="en" />

            <button
              type="button"
              onClick={onSearchClick}
              className="grid min-h-11 min-w-11 sm:inline-flex sm:min-w-0 sm:px-3 sm:py-1.5 place-items-center sm:items-center sm:justify-center sm:gap-2 rounded-lg border border-transparent sm:border-[#e4e4e8] dark:sm:border-[#27272a] sm:bg-[#f7f7f8] dark:sm:bg-[#202023] text-xs font-semibold text-[#52525b] dark:text-[#a1a1aa] hover:border-[#e5322d] hover:text-[#e5322d] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e5322d]"
              aria-label="Search tools"
            >
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline">Search</span>
              <kbd className="hidden rounded bg-white dark:bg-[#18181b] px-1.5 py-0.5 text-[10px] font-mono border border-[#e4e4e8] dark:border-[#27272a] sm:inline">⌘K</kbd>
            </button>

            <button
              type="button"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="hidden sm:grid min-h-11 min-w-11 place-items-center rounded-lg border border-transparent hover:border-[#e4e4e8] dark:hover:border-[#27272a] text-[#52525b] dark:text-[#a1a1aa] hover:text-[#18181b] dark:hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e5322d]"
              aria-label="Toggle theme"
            >
              <Sun className="hidden h-4 w-4 dark:block" aria-hidden="true" />
              <Moon className="h-4 w-4 dark:hidden" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="grid min-h-11 min-w-11 place-items-center rounded-lg border border-transparent hover:border-[#e4e4e8] dark:hover:border-[#27272a] text-[#52525b] dark:text-[#a1a1aa] hover:text-[#18181b] dark:hover:text-white lg:hidden transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e5322d]"
              aria-label="Toggle menu"
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="lg:hidden bg-white dark:bg-[#18181b] border-t border-[#e5e5e8] dark:border-[#27272a] shadow-md animate-in slide-in-from-top-1 duration-150">
          <nav aria-label="Mobile navigation" className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                  isActive(link.href)
                    ? 'bg-[#fff1f1] dark:bg-[#e5322d]/15 text-[#e5322d] font-bold'
                    : 'text-[#52525b] dark:text-[#a1a1aa] hover:bg-[#f7f7f8] dark:hover:bg-[#202023] hover:text-[#18181b] dark:hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <button type="button" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="sm:hidden flex w-full items-center gap-3 px-3 py-3 rounded-lg text-sm font-semibold text-[#52525b] dark:text-[#a1a1aa] hover:bg-[#f7f7f8] dark:hover:bg-[#202023]" aria-label="Toggle color theme">
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />} Toggle theme
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
