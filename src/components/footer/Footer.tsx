'use client';

import Link from 'next/link';
import { Shield, Mail, ArrowRight } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--background)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="text-xl font-bold text-[var(--foreground)]">
              Navorika<span className="text-indigo-600 dark:text-indigo-400">Pro</span>
            </Link>
            <p className="mt-3 text-sm text-[var(--muted-foreground)] max-w-sm leading-relaxed">
              Universal client computing engine offering absolute data privacy,
              instantaneous execution, and world-class productivity tools.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400">
              <Shield className="h-4 w-4" />
              <span className="font-medium">100% CLIENT-SIDE SAFE</span>
            </div>

            {/* Social Links - Using Emojis */}
            <div className="mt-4 flex items-center gap-3">
              <a
                href="#"
                className="p-2 rounded-full bg-[var(--muted)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-indigo-500/10 transition-all text-xl"
                aria-label="GitHub"
              >
                🐙
              </a>
              <a
                href="#"
                className="p-2 rounded-full bg-[var(--muted)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-indigo-500/10 transition-all text-xl"
                aria-label="Twitter"
              >
                🐦
              </a>
              <a
                href="#"
                className="p-2 rounded-full bg-[var(--muted)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-indigo-500/10 transition-all text-xl"
                aria-label="LinkedIn"
              >
                🔗
              </a>
              <a
                href="#"
                className="p-2 rounded-full bg-[var(--muted)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-indigo-500/10 transition-all text-xl"
                aria-label="YouTube"
              >
                ▶️
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)] mb-4">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm">
              {['Home', 'Categories', 'Tools', 'Guides', 'About'].map((item) => (
                <li key={item}>
                  <Link
                    href={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                    className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Newsletter */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)] mb-4">
              Legal
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/sitemap" className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
                  XML Sitemap
                </Link>
              </li>
            </ul>

            {/* Newsletter */}
            <div className="mt-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)] mb-3">
                Stay Updated
              </h4>
              <div className="flex items-center gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-3 py-2 text-sm rounded-lg bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:border-indigo-500 transition-all"
                />
                <button className="p-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-all">
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[var(--muted-foreground)]">
          <span>© {currentYear} NavorikaPro. All rights reserved.</span>
          <div className="flex items-center gap-6 text-xs">
            <Link href="/" className="hover:text-[var(--foreground)] transition-colors">Home</Link>
            <Link href="/categories" className="hover:text-[var(--foreground)] transition-colors">Categories</Link>
            <Link href="/tools" className="hover:text-[var(--foreground)] transition-colors">Tools</Link>
            <Link href="/guides" className="hover:text-[var(--foreground)] transition-colors">Guides</Link>
            <Link href="/about" className="hover:text-[var(--foreground)] transition-colors">About</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
