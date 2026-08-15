'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Sun, Moon, Home, Layers, Wrench, BookOpen, Info, Mail } from 'lucide-react';
import { useTheme } from 'next-themes';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
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

  // Don't render theme-dependent content until mounted
  if (!mounted) return null;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled ? 'bg-[var(--background)]/95 backdrop-blur-sm border-b border-[var(--border)]' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="relative transition-all duration-500 group-hover:scale-105 h-10 w-10">
                <svg className="w-full h-full" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="50%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                    <radialGradient id="glowGrad" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                    </radialGradient>
                  </defs>
                  <circle cx="24" cy="24" r="22" fill="url(#glowGrad)" className="opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <polygon points="24,6 40,14 40,30 24,38 8,30 8,14" fill="url(#logoGrad)" stroke="white" strokeWidth="2" className="transition-all duration-300 group-hover:shadow-lg" />
                  <polygon points="24,14 32,20 24,26 16,20" fill="white" opacity="0.9" />
                  <polygon points="24,26 32,32 24,38 16,32" fill="white" opacity="0.4" />
                  <circle cx="16" cy="14" r="1.5" fill="white" opacity="0.6" />
                  <circle cx="32" cy="14" r="1.5" fill="white" opacity="0.6" />
                  <circle cx="16" cy="34" r="1.5" fill="white" opacity="0.6" />
                  <circle cx="32" cy="34" r="1.5" fill="white" opacity="0.6" />
                </svg>
              </div>
              <div className="absolute inset-0 rounded-full border-2 border-indigo-500/20 opacity-0 group-hover:opacity-100 animate-ping duration-1000 h-10 w-10" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-0.5">
                <span className="font-black tracking-tight text-[var(--foreground)] transition-colors duration-300 text-xl">
                  Navorika
                </span>
                <span className="font-black tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent text-xl">
                  Pro
                </span>
              </div>
            </div>
          </Link>

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

          {/* Right side - Theme toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-full hover:bg-[var(--muted)] transition-all duration-300 text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:scale-110"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-full hover:bg-[var(--muted)] transition-all duration-300 text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
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
