'use client';

import Link from 'next/link';
import { Shield } from 'lucide-react';
import Logo from '@/components/ui/Logo';
import SocialLinks from './SocialLinks';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--background)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Logo showTagline={true} size="lg" />
            <p className="mt-4 text-sm text-[var(--muted-foreground)] max-w-sm leading-relaxed">
              Privacy-first calculators and utilities. Most tools process data locally;
              tools that need live external data identify their source.
            </p>
            <div className="mt-4 flex items-center gap-4">
              <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400">
                <Shield className="h-4 w-4" />
                <span className="font-medium">PRIVACY-FIRST BY DESIGN</span>
              </div>
            </div>
            <SocialLinks />
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)] mb-4">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/tools" className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
                  Tools
                </Link>
              </li>
              <li>
                <Link href="/guides" className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
                  Guides
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
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
                  Sitemap
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[var(--muted-foreground)]">
          <span>© {currentYear} Navorika. All rights reserved.</span>
          <div className="flex items-center gap-6 text-xs">
            <Link href="/" className="hover:text-[var(--foreground)] transition-colors">Home</Link>
            <Link href="/categories" className="hover:text-[var(--foreground)] transition-colors">Categories</Link>
            <Link href="/tools" className="hover:text-[var(--foreground)] transition-colors">Tools</Link>
            <Link href="/guides" className="hover:text-[var(--foreground)] transition-colors">Guides</Link>
            <Link href="/about" className="hover:text-[var(--foreground)] transition-colors">About</Link>
            <Link href="/contact" className="hover:text-[var(--foreground)] transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
