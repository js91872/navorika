import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import LocalizedTools from '@/components/i18n/LocalizedTools';
import BidiText from '@/components/i18n/BidiText';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { isLocale, isTranslatedTool, languageAlternates, localizedPath, translatedTools } from '@/lib/i18n/config';

type Props = { params: Promise<{ locale: string; slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return translatedTools.map((slug) => ({ slug })); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale) || !isTranslatedTool(slug)) notFound();
  const d = await getDictionary(locale);
  const tool = d.tools[slug];
  const url = `https://navorika.com${localizedPath(locale, slug)}`;
  return {
    title: tool.title, description: tool.description,
    alternates: { canonical: url, languages: languageAlternates(slug) },
    openGraph: { title: tool.title, description: tool.description, url, siteName: 'Navorika', type: 'website' },
    twitter: { card: 'summary', title: tool.title, description: tool.description },
  };
}

export default async function LocalizedToolPage({ params }: Props) {
  const { locale, slug } = await params;
  if (!isLocale(locale) || !isTranslatedTool(slug)) notFound();
  const d = await getDictionary(locale);
  const tool = d.tools[slug];
  const url = `https://navorika.com${localizedPath(locale, slug)}`;
  const schema = {
    '@context': 'https://schema.org', '@type': 'WebApplication',
    name: tool.title, description: tool.description, url, inLanguage: locale,
    applicationCategory: slug === 'css-flexbox-generator' ? 'DeveloperApplication' : 'UtilitiesApplication',
    operatingSystem: 'Any', isAccessibleForFree: true,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  };
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />
    <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
      <Link href={`/${locale}`} className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">{d.ui.home} / {d.ui.tools}</Link>
    </div>
    <h1 className="max-w-4xl text-3xl font-extrabold leading-tight text-indigo-600 sm:text-4xl dark:text-indigo-400">{tool.title}</h1>
    <p className="mt-5 max-w-3xl text-lg leading-8 text-[var(--muted-foreground)]"><BidiText text={tool.description} /></p>
    <p className="my-7 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 text-sm leading-7">{d.ui.local}</p>
    <LocalizedTools key={`${locale}/${slug}`} locale={locale} slug={slug} dictionary={d} />
    <div className="mt-10 grid gap-7 md:grid-cols-2">
      <section className="rounded-2xl border border-[var(--border)] p-6">
        <h2 className="text-xl font-bold">{d.ui.how}</h2>
        <p className="mt-4 leading-8 text-[var(--muted-foreground)]"><BidiText text={tool.how} /></p>
      </section>
      <section className="rounded-2xl border border-[var(--border)] p-6">
        <h2 className="text-xl font-bold">{d.ui.limits}</h2>
        <p className="mt-4 leading-8 text-[var(--muted-foreground)]"><BidiText text={tool.limits} /></p>
      </section>
    </div>
    <section className="mt-10 rounded-2xl border border-[var(--border)] p-6">
      <h2 className="text-xl font-bold">{d.ui.faq}</h2>
      <h3 className="mt-4 font-semibold">{tool.question}</h3>
      <p className="mt-3 leading-8 text-[var(--muted-foreground)]"><BidiText text={tool.answer} /></p>
    </section>
    <section className="mt-10">
      <h2 className="text-xl font-bold">{d.ui.related}</h2>
      <div className="mt-4 flex flex-wrap gap-3">{translatedTools.filter((item) => item !== slug).map((item) =>
        <Link key={item} href={localizedPath(locale, item)} className="rounded-xl border border-[var(--border)] px-4 py-3 text-sm hover:border-indigo-500">{d.tools[item].title}</Link>)}</div>
    </section>
  </>;
}
