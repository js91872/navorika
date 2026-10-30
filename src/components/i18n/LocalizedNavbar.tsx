'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Sun, Moon, Home, Wrench, Info, Mail } from 'lucide-react';
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
  const [scrolled, setScrolled] = useState(false);
  const [currentHash, setCurrentHash] = useState('');
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    { id: 'home', href: `/${locale}`, label: d.ui.home, icon: <Home className="h-4 w-4 shrink-0" /> },
    { id: 'tools', href: `/${locale}#tools`, label: d.ui.tools, icon: <Wrench className="h-4 w-4 shrink-0" /> },
    { id: 'about', href: `/${locale}/about`, label: d.ui.about, icon: <Info className="h-4 w-4 shrink-0" /> },
    { id: 'contact', href: `/${locale}/contact`, label: d.ui.contact, icon: <Mail className="h-4 w-4 shrink-0" /> },
  ];

  const mobileLinks = [
    ...navLinks,
    { id: 'privacy', href: `/${locale}/privacy`, label: d.ui.privacy, icon: <Info className="h-4 w-4 shrink-0" /> },
    { id: 'terms', href: `/${locale}/terms`, label: d.ui.terms, icon: <Info className="h-4 w-4 shrink-0" /> },
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
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[var(--background)]/95 backdrop-blur-sm border-b border-[var(--border)] shadow-sm'
          : 'bg-[var(--background)]/80 backdrop-blur-sm border-b border-[var(--border)]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-2 min-[360px]:px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo linking to localized homepage with translated accessible label */}
          <div className={`shrink-0 ${styles.brand}`}>
            <Logo href={`/${locale}`} ariaLabel={d.ui.brandHome} size="md" />
          </div>

          {/* Desktop Navigation */}
          <nav aria-label={d.ui.navigation} className="hidden xl:flex items-center gap-1">
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
                  className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                    active
                      ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-500/10'
                      : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]/50'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    {link.icon}
                    {link.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Right side controls: Language switcher outside menu, Theme toggle, Hamburger menu */}
          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            <LanguageSwitcher locale={locale} label={d.ui.language} />

            <button
              type="button"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="grid min-h-11 min-w-11 place-items-center rounded-full hover:bg-[var(--muted)] transition-all duration-300 text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              aria-label={d.ui.themeToggle}
              title={d.ui.themeToggle}
            >
              <Sun className="hidden h-5 w-5 dark:block" aria-hidden="true" />
              <Moon className="h-5 w-5 dark:hidden" aria-hidden="true" />
            </button>

            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="grid min-h-11 min-w-11 place-items-center rounded-full hover:bg-[var(--muted)] transition-all duration-300 text-[var(--muted-foreground)] hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 xl:hidden"
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
          className="xl:hidden bg-[var(--background)] border-b border-[var(--border)] shadow-lg animate-in slide-in-from-top-2 duration-200"
        >
          <nav aria-label={d.ui.navigation} className="px-4 py-4 space-y-1">
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
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                    active
                      ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold'
                      : 'text-[var(--muted-foreground)] hover:bg-[var(--muted)]/50 hover:text-[var(--foreground)] font-medium'
                  }`}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
