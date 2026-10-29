import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isLocale, locales, publicPageAlternates } from '@/lib/i18n/config';
import { disclaimerContent } from '@/lib/i18n/trustPages';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { LocalizedTrustPage } from '@/components/i18n/LocalizedTrustPage';

type Props = { params: Promise<{ locale: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const content = disclaimerContent[locale];
  return {
    title: content.title,
    description: content.description,
    alternates: {
      canonical: `https://navorika.com/${locale}/disclaimer`,
      languages: publicPageAlternates('/disclaimer'),
    },
    openGraph: {
      title: content.title,
      description: content.description,
      url: `https://navorika.com/${locale}/disclaimer`,
      siteName: 'Navorika',
      type: 'website',
    },
  };
}

export default async function DisclaimerRoute({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const content = disclaimerContent[locale];
  const d = await getDictionary(locale);

  return <LocalizedTrustPage locale={locale} content={content} homeLabel={d.ui.home} />;
}
