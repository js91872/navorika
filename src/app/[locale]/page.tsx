import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import LocalizedCatalog from '@/components/i18n/LocalizedCatalog';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { isLocale, languageAlternates } from '@/lib/i18n/config';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = await getDictionary(locale);
  return {
    title: d.ui.title, description: d.ui.intro,
    alternates: { canonical: `https://navorika.com/${locale}`, languages: languageAlternates() },
    openGraph: { title: d.ui.title, description: d.ui.intro, url: `https://navorika.com/${locale}`, siteName: 'Navorika', type: 'website' },
  };
}

export default async function LanguageHome({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = await getDictionary(locale);
  return <>
    <div className="mb-10 max-w-3xl min-w-0">
      <h1 className="break-words text-3xl font-extrabold leading-tight text-indigo-600 sm:text-5xl dark:text-indigo-400">{d.ui.title}</h1>
      <p className="mt-5 break-words text-lg leading-8 text-[var(--muted-foreground)]">{d.ui.intro}</p>
      <p className="mt-5 break-words rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 text-sm leading-7">{d.ui.local}</p>
    </div>
    <LocalizedCatalog locale={locale} dictionary={d} />
  </>;
}
