'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Search, Menu, X, Home, Grid3x3, BookOpen, Info } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';

interface NavbarProps {
  onSearchClick?: () => void;
}

export default function Navbar({ onSearchClick }: NavbarProps) {
  const { isDark, toggle } = useTheme();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/', label: 'Home', icon: <Home className="h-4 w-4" /> },
    { href: '/categories', label: 'Categories', icon: <Grid3x3 className="h-4 w-4" /> },
    { href: '/tools', label: 'Tools', icon: null },
    { href: '/guides', label: 'Guides', icon: <BookOpen className="h-4 w-4" /> },
    { href: '/about', label: 'About', icon: <Info className="h-4 w-4" /> },
  ];

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[var(--background)]/80 backdrop-blur-xl border-b border-[var(--border)] shadow-lg'
          : 'bg-[var(--background)]/60 backdrop-blur-sm border-b border-[var(--border)]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <span className="text-xl font-black tracking-tight text-[var(--foreground)] transition-all duration-300 group-hover:scale-105">
              Navorika<span className="text-indigo-600 dark:text-indigo-400">Pro</span>
            </span>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-wider border border-indigo-500/20">
              β
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-1.5 ${
                    isActive
                      ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-500/10'
                      : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]/50'
                  }`}
                >
                  {link.icon}
                  {link.label}
                  {isActive && (
                    <motion.span
                      layoutId="navbar-active"
                      className="absolute inset-0 rounded-full bg-indigo-500/10 -z-10"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right side: Search + Theme Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={onSearchClick}
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--muted)] border border-[var(--border)] text-[var(--muted-foreground)] text-sm hover:bg-[var(--muted)]/80 hover:border-indigo-500/30 transition-all duration-300 group"
            >
              <Search className="h-4 w-4 group-hover:scale-110 transition-transform" />
              <span className="font-medium">Search</span>
              <kbd className="px-1.5 py-0.5 rounded bg-[var(--border)] text-[10px] font-mono text-[var(--muted-foreground)]">
                ⌘K
              </kbd>
            </button>

            <button
              onClick={toggle}
              className="p-2 rounded-full hover:bg-[var(--muted)] transition-all duration-300 text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:scale-110"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="h-5 w-5 hover:rotate-90 transition-transform duration-500" />
              ) : (
                <Moon className="h-5 w-5 hover:-rotate-90 transition-transform duration-500" />
              )}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-full hover:bg-[var(--muted)] transition-all duration-300 text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden border-t border-[var(--border)]"
            >
              <div className="py-4 space-y-1">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                        isActive
                          ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-500/10'
                          : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]/50'
                      }`}
                    >
                      {link.icon}
                      {link.label}
                    </Link>
                  );
                })}
                <button
                  onClick={() => {
                    onSearchClick?.();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]/50 transition-all duration-300 w-full text-left"
                >
                  <Search className="h-4 w-4" /> Search
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
