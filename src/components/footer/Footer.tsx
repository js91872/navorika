'use client';

import Link from 'next/link';
import Logo from '@/components/ui/Logo';
import SocialLinks from './SocialLinks';
import GoogleConsentSettings from '@/components/seo/GoogleConsentSettings';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[#e5e5e8] dark:border-[#27272a] bg-white dark:bg-[#18181b] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Logo showTagline={true} size="lg" />
            <p className="mt-3 text-sm text-[#5b5b63] dark:text-[#a1a1aa] max-w-sm leading-relaxed">
              Free, reliable online tools for daily work. Convert files, calculate quantities, and get things done quickly in your browser.
            </p>
            <div className="mt-4">
              <SocialLinks />
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#18181b] dark:text-white mb-4">
              Tools & Guides
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="text-[#5b5b63] dark:text-[#a1a1aa] hover:text-[#e5322d] dark:hover:text-[#ef4444] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/tools" className="text-[#5b5b63] dark:text-[#a1a1aa] hover:text-[#e5322d] dark:hover:text-[#ef4444] transition-colors">
                  All Tools
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-[#5b5b63] dark:text-[#a1a1aa] hover:text-[#e5322d] dark:hover:text-[#ef4444] transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/guides" className="text-[#5b5b63] dark:text-[#a1a1aa] hover:text-[#e5322d] dark:hover:text-[#ef4444] transition-colors">
                  Guides
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-[#5b5b63] dark:text-[#a1a1aa] hover:text-[#e5322d] dark:hover:text-[#ef4444] transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-[#5b5b63] dark:text-[#a1a1aa] hover:text-[#e5322d] dark:hover:text-[#ef4444] transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Trust */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#18181b] dark:text-white mb-4">
              Information
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/privacy" className="text-[#5b5b63] dark:text-[#a1a1aa] hover:text-[#e5322d] dark:hover:text-[#ef4444] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-[#5b5b63] dark:text-[#a1a1aa] hover:text-[#e5322d] dark:hover:text-[#ef4444] transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="text-[#5b5b63] dark:text-[#a1a1aa] hover:text-[#e5322d] dark:hover:text-[#ef4444] transition-colors">
                  Disclaimer
                </Link>
              </li>
              <li>
                <Link href="/methodology" className="text-[#5b5b63] dark:text-[#a1a1aa] hover:text-[#e5322d] dark:hover:text-[#ef4444] transition-colors">
                  Methodology
                </Link>
              </li>
              <li>
                <Link href="/sitemap" className="text-[#5b5b63] dark:text-[#a1a1aa] hover:text-[#e5322d] dark:hover:text-[#ef4444] transition-colors">
                  Sitemap
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-[#e5e5e8] dark:border-[#27272a] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#5b5b63] dark:text-[#a1a1aa]">
          <span>© {currentYear} Navorika · Free online tools</span>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 sm:justify-end">
            <Link href="/privacy" className="hover:text-[#e5322d] dark:hover:text-[#ef4444] transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-[#e5322d] dark:hover:text-[#ef4444] transition-colors">Terms</Link>
            <Link href="/disclaimer" className="hover:text-[#e5322d] dark:hover:text-[#ef4444] transition-colors">Disclaimer</Link>
            <Link href="/methodology" className="hover:text-[#e5322d] dark:hover:text-[#ef4444] transition-colors">Methodology</Link>
            <Link href="/about" className="hover:text-[#e5322d] dark:hover:text-[#ef4444] transition-colors">About</Link>
            <Link href="/contact" className="hover:text-[#e5322d] dark:hover:text-[#ef4444] transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
