import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Shield } from 'lucide-react';
import LocalizedTools from '@/components/i18n/LocalizedTools';
import BidiText from '@/components/i18n/BidiText';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { isLocale, isTranslatedTool, languageAlternates, localizedPath, translatedTools } from '@/lib/i18n/config';

type Props = { params: Promise<{ locale: string; slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() {
  return translatedTools.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale) || !isTranslatedTool(slug)) notFound();
  const d = await getDictionary(locale);
  const tool = d.tools[slug];
  const url = `https://navorika.com${localizedPath(locale, slug)}`;
  return {
    title: tool.title,
    description: tool.description,
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
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: tool.title,
    description: tool.description,
    url,
    inLanguage: locale,
    applicationCategory: slug.startsWith('css-') ? 'DeveloperApplication' : 'UtilitiesApplication',
    operatingSystem: 'Any',
    isAccessibleForFree: true,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }}
      />

      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-sm text-[var(--muted-foreground)]">
        <Link href={`/${locale}`} className="hover:text-[var(--foreground)] transition-colors">
          {d.ui.home}
        </Link>
        <span className="text-[var(--muted-foreground)]">/</span>
        <Link href={`/${locale}#tools`} className="hover:text-[var(--foreground)] transition-colors">
          {d.ui.tools}
        </Link>
        <span className="text-[var(--muted-foreground)]">/</span>
        <span className="font-medium text-[var(--foreground)] [overflow-wrap:anywhere]">{tool.title}</span>
      </nav>

      {/* Tool Header */}
      <div className="mb-8">
        <h1 className="max-w-4xl text-3xl font-black tracking-tight text-[var(--foreground)] sm:text-4xl [overflow-wrap:anywhere]">
          {tool.title}
        </h1>
        <p className="mt-3 max-w-3xl text-base sm:text-lg leading-relaxed text-[var(--muted-foreground)] [overflow-wrap:anywhere]">
          <BidiText text={tool.description} />
        </p>

        {/* Privacy Trust Banner */}
        <div className="my-6 max-w-3xl rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4 text-xs sm:text-sm leading-relaxed text-[var(--foreground)] flex items-center gap-3">
          <Shield className="h-5 w-5 text-emerald-500 shrink-0" />
          <span>{d.ui.local}</span>
        </div>
      </div>

      {/* Main Tool Interactive Component */}
      <LocalizedTools key={`${locale}/${slug}`} locale={locale} slug={slug} dictionary={d} />

      {/* Educational & Usage Details */}
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
          <h2 className="text-xl font-bold">{d.ui.how}</h2>
          <p className="mt-3.5 leading-relaxed text-[var(--muted-foreground)] text-sm sm:text-base">
            <BidiText text={tool.how} />
          </p>
        </section>
        <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
          <h2 className="text-xl font-bold">{d.ui.limits}</h2>
          <p className="mt-3.5 leading-relaxed text-[var(--muted-foreground)] text-sm sm:text-base">
            <BidiText text={tool.limits} />
          </p>
        </section>
      </div>

      {/* Frequently Asked Question */}
      <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
        <h2 className="text-xl font-bold">{d.ui.faq}</h2>
        <h3 className="mt-4 font-semibold text-base sm:text-lg">{tool.question}</h3>
        <p className="mt-2.5 leading-relaxed text-[var(--muted-foreground)] text-sm sm:text-base">
          <BidiText text={tool.answer} />
        </p>
      </section>

      {/* Related Tools */}
      <section className="mt-10">
        <h2 className="text-xl font-bold mb-4">{d.ui.related}</h2>
        <div className="flex flex-wrap gap-2.5">
          {translatedTools
            .filter((item) => item !== slug)
            .map((item) => (
              <Link
                key={item}
                href={localizedPath(locale, item)}
                className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-3.5 py-2 text-xs sm:text-sm font-medium hover:border-indigo-500/50 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all shadow-sm"
              >
                {d.tools[item].title}
              </Link>
            ))}
        </div>
      </section>
    </>
  );
}
