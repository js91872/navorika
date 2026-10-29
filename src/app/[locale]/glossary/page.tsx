import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isLocale, locales, publicPageAlternates } from '@/lib/i18n/config';
import { glossaryContent } from '@/lib/i18n/trustPages';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { LocalizedGlossaryPage } from '@/components/i18n/LocalizedTrustPage';

type Props = { params: Promise<{ locale: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const content = glossaryContent[locale];
  return {
    title: content.title,
    description: content.description,
    alternates: {
      canonical: `https://navorika.com/${locale}/glossary`,
      languages: publicPageAlternates('/glossary'),
    },
    openGraph: {
      title: content.title,
      description: content.description,
      url: `https://navorika.com/${locale}/glossary`,
      siteName: 'Navorika',
      type: 'website',
    },
  };
}

export default async function GlossaryRoute({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const content = glossaryContent[locale];
  const d = await getDictionary(locale);

  return <LocalizedGlossaryPage locale={locale} content={content} homeLabel={d.ui.home} />;
}
