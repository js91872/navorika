import Link from 'next/link';
import SiteHead from '@/components/SiteHead';
import '../globals.css';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ThemeProvider } from '@/components/ThemeProvider';
import LanguageSwitcher from '@/components/i18n/LanguageSwitcher';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { isLocale, languageDirection, locales } from '@/lib/i18n/config';

export const dynamicParams = false;
export function generateStaticParams() { return locales.map((locale) => ({ locale })); }
export const metadata: Metadata = {
  metadataBase: new URL('https://navorika.com'),
  title: { default: 'Navorika', template: '%s | Navorika' },
  icons: { icon: '/favicon.svg' },
  robots: { index: true, follow: true },
};

export default async function LocalizedLayout({ children, params }: {
  children: React.ReactNode; params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = await getDictionary(locale);
  return <html lang={locale} dir={languageDirection(locale)} suppressHydrationWarning>
    <SiteHead />
    <body className="flex min-h-screen flex-col bg-[var(--background)] text-[var(--foreground)] antialiased">
      <ThemeProvider>
        <header className="border-b border-[var(--border)]">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-5 sm:px-6">
            <Link href={`/${locale}`} className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">Navorika</Link>
            <nav aria-label={d.ui.tools} className="flex items-center gap-5 text-sm font-semibold">
              <Link href={`/${locale}`}>{d.ui.tools}</Link>
              <LanguageSwitcher locale={locale} label={d.ui.language} />
            </nav>
          </div>
        </header>
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">{children}</main>
        <footer className="mt-12 border-t border-[var(--border)] px-4 py-8 text-sm text-[var(--muted-foreground)]">
          <div className="mx-auto max-w-6xl">
            <p>{d.ui.local}</p>
            <p className="mt-4">{d.ui.englishNotice}</p>
            <nav className="mt-3 flex flex-wrap gap-5" aria-label={d.ui.englishNotice}>
              <Link href="/tools" hrefLang="en">{d.ui.allEnglish}</Link>
              <Link href="/privacy" hrefLang="en">{d.ui.privacy} (English)</Link>
              <Link href="/terms" hrefLang="en">{d.ui.terms} (English)</Link>
              <Link href="/contact" hrefLang="en">{d.ui.contact} (English)</Link>
            </nav>
          </div>
        </footer>
      </ThemeProvider>
    </body>
  </html>;
}
