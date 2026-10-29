import Link from 'next/link';
import { Shield } from 'lucide-react';
import Logo from '@/components/ui/Logo';
import type { Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/dictionaries';

interface LocalizedFooterProps {
  locale: Locale;
  dictionary: Dictionary;
}

export default function LocalizedFooter({ locale, dictionary: d }: LocalizedFooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-[var(--border)] bg-[var(--background)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand & Mission Column */}
          <div className="col-span-1 md:col-span-2">
            <Logo href={`/${locale}`} showTagline={true} size="lg" />
            <p className="mt-4 text-sm text-[var(--muted-foreground)] max-w-sm leading-relaxed">
              {d.ui.local}
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400">
              <Shield className="h-4 w-4 shrink-0" />
              <span className="font-semibold tracking-wider">{d.ui.privacyBadge}</span>
            </div>
          </div>

          {/* Navigation Column */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)] mb-4">
              {d.ui.navigation}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href={`/${locale}`} className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
                  {d.ui.home}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}#tools`} className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
                  {d.ui.tools}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/about`} className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
                  {d.ui.about}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/contact`} className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
                  {d.ui.contact}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Trust Column */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)] mb-4">
              {d.ui.legalTrust}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href={`/${locale}/privacy`} className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
                  {d.ui.privacy}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/terms`} className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
                  {d.ui.terms}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/disclaimer`} className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
                  {d.ui.disclaimer}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/methodology`} className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
                  {d.ui.methodology}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/glossary`} className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
                  {d.ui.glossary}
                </Link>
              </li>
            </ul>
          </div>

          {/* English Cross-links Column */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)] mb-4">
              {d.ui.englishNotice}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/tools" hrefLang="en" className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
                  {d.ui.allEnglish}
                </Link>
              </li>
              <li>
                <Link href="/about" hrefLang="en" className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
                  {d.ui.about} ({d.ui.englishName})
                </Link>
              </li>
              <li>
                <Link href="/contact" hrefLang="en" className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
                  {d.ui.contact} ({d.ui.englishName})
                </Link>
              </li>
              <li>
                <Link href="/privacy" hrefLang="en" className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
                  {d.ui.privacy} ({d.ui.englishName})
                </Link>
              </li>
              <li>
                <Link href="/terms" hrefLang="en" className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
                  {d.ui.terms} ({d.ui.englishName})
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" hrefLang="en" className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
                  {d.ui.disclaimer} ({d.ui.englishName})
                </Link>
              </li>
              <li>
                <Link href="/methodology" hrefLang="en" className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
                  {d.ui.methodology} ({d.ui.englishName})
                </Link>
              </li>
              <li>
                <Link href="/glossary" hrefLang="en" className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
                  {d.ui.glossary} ({d.ui.englishName})
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[var(--muted-foreground)]">
          <span>© {currentYear} Navorika.</span>
          <nav aria-label={d.ui.legalTrust} className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs sm:justify-end">
            <Link href={`/${locale}/privacy`} className="hover:text-[var(--foreground)] transition-colors">{d.ui.privacy}</Link>
            <Link href={`/${locale}/terms`} className="hover:text-[var(--foreground)] transition-colors">{d.ui.terms}</Link>
            <Link href={`/${locale}/disclaimer`} className="hover:text-[var(--foreground)] transition-colors">{d.ui.disclaimer}</Link>
            <Link href={`/${locale}/methodology`} className="hover:text-[var(--foreground)] transition-colors">{d.ui.methodology}</Link>
            <Link href={`/${locale}/glossary`} className="hover:text-[var(--foreground)] transition-colors">{d.ui.glossary}</Link>
            <Link href={`/${locale}/about`} className="hover:text-[var(--foreground)] transition-colors">{d.ui.about}</Link>
            <Link href={`/${locale}/contact`} className="hover:text-[var(--foreground)] transition-colors">{d.ui.contact}</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
