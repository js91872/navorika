'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Sun, Moon, Search, BookOpen, Grid3x3, Home, ChevronDown, Menu, X } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';
import { categories } from '@/data/registry';

interface NavbarProps {
  onSearchClick?: () => void;
}

export default function Navbar({ onSearchClick }: NavbarProps) {
  const { isDark, toggle } = useTheme();
  const [isHubOpen, setIsHubOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Active hubs (exclude empty ones)
  const activeHubs = categories.filter(c => c.slug !== 'construction-calculators');

  // Desktop nav links
  const navLinks = [
    { href: '/', label: 'Home', icon: <Home className="h-4 w-4" /> },
    { href: '/categories', label: 'Categories', icon: <Grid3x3 className="h-4 w-4" /> },
    { href: '/glossary', label: 'Glossary', icon: <BookOpen className="h-4 w-4" /> },
    { href: '/about', label: 'About', icon: null },
  ];

  const iconMap: Record<string, string> = {
    FileText: '📄',
    Image: '🖼️',
    Calculator: '📊',
    HeartPulse: '❤️',
    Code: '⚡',
    PiggyBank: '💰',
    Globe: '🌍',
    Hammer: '🔨',
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--background)] border-b border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold text-[var(--foreground)] shrink-0">
            Navorika<span className="text-indigo-600 dark:text-indigo-400">Pro</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 rounded-full text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] transition-all flex items-center gap-1.5"
              >
                {link.icon}
                {link.label}
              </Link>
            ))}

            {/* Hubs Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsHubOpen(!isHubOpen)}
                onMouseEnter={() => setIsHubOpen(true)}
                onMouseLeave={() => setIsHubOpen(false)}
                className="px-4 py-2 rounded-full text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] transition-all flex items-center gap-1.5"
              >
                <Grid3x3 className="h-4 w-4" />
                Hubs
                <ChevronDown className={`h-3 w-3 transition-transform ${isHubOpen ? 'rotate-180' : ''}`} />
              </button>

              {isHubOpen && (
                <div
                  className="absolute top-full left-0 mt-1 w-56 bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-lg overflow-hidden"
                  onMouseEnter={() => setIsHubOpen(true)}
                  onMouseLeave={() => setIsHubOpen(false)}
                >
                  {activeHubs.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/hubs/${cat.slug}`}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-[var(--muted)] transition-colors text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                    >
                      <span className="text-lg">{iconMap[cat.icon] || '📁'}</span>
                      {cat.name} Hub
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right side: Search + Theme Toggle + Mobile Menu */}
          <div className="flex items-center gap-2">
            <button
              onClick={onSearchClick}
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--muted)] border border-[var(--border)] text-[var(--muted-foreground)] text-sm hover:bg-[var(--muted)]/80 transition-all"
            >
              <Search className="h-4 w-4" />
              <span className="font-medium">Search</span>
              <kbd className="px-1.5 py-0.5 rounded bg-[var(--border)] text-[10px] font-mono text-[var(--muted-foreground)]">
                ⌘K
              </kbd>
            </button>

            <button
              onClick={toggle}
              className="p-2 rounded-full hover:bg-[var(--muted)] transition-colors text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-full hover:bg-[var(--muted)] transition-colors text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-[var(--border)] space-y-1">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] transition-all"
            >
              <Home className="h-4 w-4" /> Home
            </Link>
            <Link
              href="/categories"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] transition-all"
            >
              <Grid3x3 className="h-4 w-4" /> Categories
            </Link>

            <div className="px-2 py-1 text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">Hubs</div>
            {activeHubs.map((cat) => (
              <Link
                key={cat.slug}
                href={`/hubs/${cat.slug}`}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] transition-all"
              >
                <span className="text-lg">{iconMap[cat.icon] || '📁'}</span>
                {cat.name} Hub
              </Link>
            ))}

            <Link
              href="/glossary"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] transition-all"
            >
              <BookOpen className="h-4 w-4" /> Glossary
            </Link>
            <Link
              href="/about"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] transition-all"
            >
              About
            </Link>
            <button
              onClick={() => {
                onSearchClick?.();
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] transition-all w-full text-left"
            >
              <Search className="h-4 w-4" /> Search
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
