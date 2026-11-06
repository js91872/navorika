import SiteHead from '@/components/SiteHead';
import '../globals.css';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ThemeProvider } from '@/components/ThemeProvider';
import LocalizedNavbar from '@/components/i18n/LocalizedNavbar';
import LocalizedFooter from '@/components/i18n/LocalizedFooter';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { isLocale, languageDirection, locales } from '@/lib/i18n/config';

export const dynamicParams = false;
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  metadataBase: new URL('https://navorika.com'),
  title: { default: 'Navorika', template: '%s | Navorika' },
  icons: { icon: '/favicon.svg' },
  robots: { index: true, follow: true },
};

export default async function LocalizedLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = await getDictionary(locale);

  // Keep the client navbar payload small: the full dictionary contains every translated tool.
  const navbarDictionary = {
    ui: {
      home: d.ui.home,
      tools: d.ui.tools,
      about: d.ui.about,
      contact: d.ui.contact,
      privacy: d.ui.privacy,
      terms: d.ui.terms,
      brandHome: d.ui.brandHome,
      navigation: d.ui.navigation,
      language: d.ui.language,
      themeToggle: d.ui.themeToggle,
      menuToggle: d.ui.menuToggle,
    },
  };

  return (
    <html lang={locale} dir={languageDirection(locale)} suppressHydrationWarning>
      <SiteHead />
      <body className="flex min-h-screen flex-col bg-[var(--background)] text-[var(--foreground)] antialiased">
        <ThemeProvider>
          <LocalizedNavbar locale={locale} dictionary={navbarDictionary} />
          <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
            {children}
          </main>
          <LocalizedFooter locale={locale} dictionary={d} />
        </ThemeProvider>
      </body>
    </html>
  );
}
