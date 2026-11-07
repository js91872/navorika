'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';
import Logo from '@/components/ui/Logo';
import LanguageSwitcher from '@/components/i18n/LanguageSwitcher';
import type { Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/dictionaries';
import styles from '@/components/Navbar.module.css';

interface LocalizedNavbarProps {
  locale: Locale;
  dictionary: Dictionary;
}

export default function LocalizedNavbar({ locale, dictionary: d }: LocalizedNavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentHash, setCurrentHash] = useState('');
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const updateHash = () => {
      if (typeof window !== 'undefined') {
        setCurrentHash(window.location.hash);
      }
    };
    updateHash();
    window.addEventListener('hashchange', updateHash);
    return () => window.removeEventListener('hashchange', updateHash);
  }, []);

  // Dismiss mobile menu on outside pointerdown or Escape key
  useEffect(() => {
    if (!isOpen) return;
    const dismissOutside = (event: PointerEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const dismissEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    document.addEventListener('pointerdown', dismissOutside, true);
    document.addEventListener('keydown', dismissEscape);
    return () => {
      document.removeEventListener('pointerdown', dismissOutside, true);
      document.removeEventListener('keydown', dismissEscape);
    };
  }, [isOpen]);

  const navLinks = [
    { id: 'home', href: `/${locale}`, label: d.ui.home },
    { id: 'tools', href: `/${locale}#tools`, label: d.ui.tools },
    { id: 'about', href: `/${locale}/about`, label: d.ui.about },
    { id: 'contact', href: `/${locale}/contact`, label: d.ui.contact },
  ];

  const mobileLinks = [
    ...navLinks,
    { id: 'privacy', href: `/${locale}/privacy`, label: d.ui.privacy },
    { id: 'terms', href: `/${locale}/terms`, label: d.ui.terms },
  ];

  const getNavState = (id: string) => {
    if (id === 'about') {
      const active = pathname === `/${locale}/about`;
      return { active, ariaCurrent: active ? ('page' as const) : undefined };
    }
    if (id === 'contact') {
      const active = pathname === `/${locale}/contact`;
      return { active, ariaCurrent: active ? ('page' as const) : undefined };
    }
    if (id === 'privacy') {
      const active = pathname === `/${locale}/privacy`;
      return { active, ariaCurrent: active ? ('page' as const) : undefined };
    }
    if (id === 'terms') {
      const active = pathname === `/${locale}/terms`;
      return { active, ariaCurrent: active ? ('page' as const) : undefined };
    }
    if (id === 'tools') {
      const isToolDetail = pathname.startsWith(`/${locale}/tools/`);
      const isHomeToolsSection = pathname === `/${locale}` && currentHash === '#tools';
      const active = isToolDetail || isHomeToolsSection;
      const ariaCurrent = isHomeToolsSection ? ('page' as const) : undefined;
      return { active, ariaCurrent };
    }
    if (id === 'home') {
      const isHome = pathname === `/${locale}` && currentHash !== '#tools';
      return { active: isHome, ariaCurrent: isHome ? ('page' as const) : undefined };
    }
    return { active: false, ariaCurrent: undefined };
  };

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 bg-white dark:bg-[#18181b] border-b border-[#e5e5e8] dark:border-[#27272a] shadow-xs transition-colors duration-200"
    >
      <div className="max-w-7xl mx-auto px-2 min-[360px]:px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Brand Logo linking to localized homepage with translated accessible label */}
          <div className={`shrink-0 ${styles.brand}`}>
            <Logo href={`/${locale}`} ariaLabel={d.ui.brandHome} size="md" />
          </div>

          {/* Desktop Navigation */}
          <nav aria-label={d.ui.navigation} className="hidden lg:flex items-center gap-6 text-sm font-semibold">
            {navLinks.map((link) => {
              const { active, ariaCurrent } = getNavState(link.id);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={ariaCurrent}
                  onClick={() => {
                    if (link.id === 'tools') setCurrentHash('#tools');
                    if (link.id === 'home') setCurrentHash('');
                  }}
                  className={`transition-colors duration-150 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e5322d] ${
                    active
                      ? 'text-[#e5322d] font-bold'
                      : 'text-[#52525b] dark:text-[#a1a1aa] hover:text-[#e5322d] dark:hover:text-[#ef4444]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right side controls: Language switcher, Theme toggle, Hamburger menu */}
          <div className="flex shrink-0 items-center gap-0 sm:gap-2">
            <LanguageSwitcher locale={locale} label={d.ui.language} />

            <button
              type="button"
              onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
              className="grid min-h-11 min-w-11 place-items-center rounded-lg border border-transparent hover:border-[#e4e4e8] dark:hover:border-[#27272a] text-[#52525b] dark:text-[#a1a1aa] hover:text-[#18181b] dark:hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e5322d]"
              aria-label={d.ui.themeToggle}
              title={d.ui.themeToggle}
            >
              <Sun className="hidden h-4 w-4 dark:block" aria-hidden="true" />
              <Moon className="h-4 w-4 dark:hidden" aria-hidden="true" />
            </button>

            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="grid min-h-11 min-w-11 place-items-center rounded-lg border border-[#e4e4e8] dark:border-[#27272a] text-[#52525b] dark:text-[#a1a1aa] hover:text-[#18181b] dark:hover:text-white lg:hidden transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e5322d]"
              aria-label={d.ui.menuToggle}
              title={d.ui.menuToggle}
              aria-expanded={isOpen}
              aria-controls="mobile-navigation-menu"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isOpen && (
        <div
          id="mobile-navigation-menu"
          className="lg:hidden bg-white dark:bg-[#18181b] border-t border-[#e5e5e8] dark:border-[#27272a] shadow-md animate-in slide-in-from-top-1 duration-150"
        >
          <nav aria-label={d.ui.navigation} className="px-4 py-3 space-y-1">
            {mobileLinks.map((link) => {
              const { active, ariaCurrent } = getNavState(link.id);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={ariaCurrent}
                  onClick={() => {
                    if (link.id === 'tools') setCurrentHash('#tools');
                    if (link.id === 'home') setCurrentHash('');
                    setIsOpen(false);
                  }}
                  className={`block px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e5322d] ${
                    active
                      ? 'bg-[#fff1f1] dark:bg-[#e5322d]/15 text-[#e5322d] font-bold'
                      : 'text-[#52525b] dark:text-[#a1a1aa] hover:bg-[#f7f7f8] dark:hover:bg-[#202023] hover:text-[#18181b] dark:hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
