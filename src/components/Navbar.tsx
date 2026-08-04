'use client';

import Link from 'next/link';
import { Sun, Moon, Search, BookOpen } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';

interface NavbarProps {
  onSearchClick?: () => void;
}

export default function Navbar({ onSearchClick }: NavbarProps) {
  const { isDark, toggle } = useTheme();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--background)] border-b border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold text-[var(--foreground)]">
            Navorika<span className="text-indigo-600 dark:text-indigo-400">Pro</span>
          </Link>
          
          <div className="flex items-center gap-6">
            <Link href="/guides" className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors flex items-center gap-1">
              <BookOpen className="h-4 w-4" /> Guides
            </Link>
            <Link href="/categories" className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
              Categories
            </Link>
            <Link href="/tools" className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
              Tools
            </Link>
            
            <button
              onClick={onSearchClick}
              className="p-2 rounded-lg hover:bg-[var(--muted)] transition-colors text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>

            <button
              onClick={toggle}
              className="p-2 rounded-lg hover:bg-[var(--muted)] transition-colors text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
