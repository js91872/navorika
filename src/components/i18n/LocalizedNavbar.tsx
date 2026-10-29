'use client';

import { useState, useEffect } from 'react';
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
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: `/${locale}`, label: d.ui.home, icon: <Home className="h-4 w-4 shrink-0" /> },
    { href: `/${locale}#tools`, label: d.ui.tools, icon: <Wrench className="h-4 w-4 shrink-0" /> },
    { href: `/${locale}/about`, label: d.ui.about, icon: <Info className="h-4 w-4 shrink-0" /> },
    { href: `/${locale}/contact`, label: d.ui.contact, icon: <Mail className="h-4 w-4 shrink-0" /> },
  ];

  const mobileLinks = [
    ...navLinks,
    { href: `/${locale}/privacy`, label: d.ui.privacy, icon: <Info className="h-4 w-4 shrink-0" /> },
    { href: `/${locale}/terms`, label: d.ui.terms, icon: <Info className="h-4 w-4 shrink-0" /> },
  ];

  const isActive = (href: string) => {
    if (href === `/${locale}`) return pathname === `/${locale}`;
    return pathname.startsWith(href.split('#')[0]);
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[var(--background)]/95 backdrop-blur-sm border-b border-[var(--border)] shadow-sm'
          : 'bg-[var(--background)]/80 backdrop-blur-sm border-b border-[var(--border)]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-2 min-[360px]:px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo linking to localized homepage */}
          <div className={`shrink-0 ${styles.brand}`}>
            <Logo href={`/${locale}`} size="md" />
          </div>

          {/* Desktop Navigation */}
          <nav aria-label={d.ui.navigation} className="hidden xl:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  isActive(link.href)
                    ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-500/10'
                    : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]/50'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  {link.icon}
                  {link.label}
                </span>
              </Link>
            ))}
          </nav>

          {/* Right side controls: Language switcher outside menu, Theme toggle, Hamburger menu */}
          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            <LanguageSwitcher locale={locale} label={d.ui.language} />

            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="grid min-h-11 min-w-11 place-items-center rounded-full hover:bg-[var(--muted)] transition-all duration-300 text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:scale-110"
              aria-label={d.ui.themeToggle}
              title={d.ui.themeToggle}
            >
              <Sun className="hidden h-5 w-5 dark:block" aria-hidden="true" />
              <Moon className="h-5 w-5 dark:hidden" aria-hidden="true" />
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="grid min-h-11 min-w-11 place-items-center rounded-full hover:bg-[var(--muted)] transition-all duration-300 text-[var(--muted-foreground)] hover:text-[var(--foreground)] xl:hidden"
              aria-label={d.ui.menuToggle}
              title={d.ui.menuToggle}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isOpen && (
        <div className="xl:hidden bg-[var(--background)] border-b border-[var(--border)] shadow-lg animate-in slide-in-from-top-2 duration-200">
          <nav aria-label={d.ui.navigation} className="px-4 py-4 space-y-1">
            {mobileLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive(link.href)
                    ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold'
                    : 'text-[var(--muted-foreground)] hover:bg-[var(--muted)]/50 hover:text-[var(--foreground)] font-medium'
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
