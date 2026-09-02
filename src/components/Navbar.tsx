'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Sun, Moon, Home, Layers, Wrench, BookOpen, Info, Mail, Search } from 'lucide-react';
import { useTheme } from 'next-themes';
import Logo from '@/components/ui/Logo';

interface NavbarProps {
  onSearchClick?: () => void;
}

export default function Navbar({ onSearchClick }: NavbarProps) {
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
    { href: '/', label: 'Home', icon: <Home className="h-4 w-4" /> },
    { href: '/categories', label: 'Categories', icon: <Layers className="h-4 w-4" /> },
    { href: '/tools', label: 'Tools', icon: <Wrench className="h-4 w-4" /> },
    { href: '/guides', label: 'Guides', icon: <BookOpen className="h-4 w-4" /> },
    { href: '/about', label: 'About', icon: <Info className="h-4 w-4" /> },
    { href: '/contact', label: 'Contact', icon: <Mail className="h-4 w-4" /> },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled ? 'bg-[var(--background)]/95 backdrop-blur-sm border-b border-[var(--border)]' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo - Larger with XL size */}
          <Logo size="md" />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
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
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <button
              onClick={onSearchClick}
              className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-full px-3 hover:bg-[var(--muted)] transition-all duration-300 text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              aria-label="Search tools"
            >
              <Search className="h-5 w-5" />
              <span className="hidden text-sm font-semibold lg:inline">Search</span>
              <kbd className="hidden rounded bg-[var(--muted)] px-1.5 py-0.5 text-[10px] xl:inline">⌘/Ctrl K</kbd>
            </button>

            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="grid min-h-11 min-w-11 place-items-center rounded-full hover:bg-[var(--muted)] transition-all duration-300 text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:scale-110"
              aria-label="Toggle theme"
            >
              <Sun className="hidden h-5 w-5 dark:block" aria-hidden="true" />
              <Moon className="h-5 w-5 dark:hidden" aria-hidden="true" />
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="grid min-h-11 min-w-11 place-items-center rounded-full hover:bg-[var(--muted)] transition-all duration-300 text-[var(--muted-foreground)] hover:text-[var(--foreground)] md:hidden"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-[var(--background)] border-b border-[var(--border)] shadow-lg">
          <div className="px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive(link.href)
                    ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                    : 'text-[var(--muted-foreground)] hover:bg-[var(--muted)]/50 hover:text-[var(--foreground)]'
                }`}
              >
                {link.icon}
                <span className="font-medium">{link.label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
