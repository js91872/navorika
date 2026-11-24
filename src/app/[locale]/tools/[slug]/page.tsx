import PageHelp from '@/components/seo/PageHelp';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Shield } from 'lucide-react';
import LocalizedTools from '@/components/i18n/LocalizedTools';
import BidiText from '@/components/i18n/BidiText';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { isLocale, isTranslatedTool, languageAlternates, localizedPath, translatedTools } from '@/lib/i18n/config';
import { hasIndexableLocalizedToolCopy, type LocalizedToolCopy } from '@/lib/i18n/contentDepth';

type Props = { params: Promise<{ locale: string; slug: string }> };

/** Keep related links focused instead of serializing the full translated tool catalog on every page. */
function relatedToolSlugs(slug: string): (typeof translatedTools)[number][] {
  const words = new Set(slug.split('-').filter((word) => word.length > 3 && !['calculator', 'converter', 'generator', 'image', 'tool', 'tools'].includes(word)));
  const candidates = translatedTools.filter((item) => item !== slug);
  return candidates
    .map((item, index) => ({
      item,
      index,
      score: item.split('-').reduce((score, word) => score + (words.has(word) ? 1 : 0), 0),
    }))
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, 8)
    .map(({ item }) => item);
}
export const dynamicParams = false;
export function generateStaticParams() {
  return translatedTools.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale) || !isTranslatedTool(slug)) notFound();
  const d = await getDictionary(locale);
  const tool = d.tools[slug];
  const indexable = hasIndexableLocalizedToolCopy(tool);
  const url = `https://navorika.com${localizedPath(locale, slug)}`;
  return {
    title: tool.title,
    description: tool.description,
    alternates: { canonical: url, languages: languageAlternates(slug) },
    openGraph: { title: tool.title, description: tool.description, url, siteName: 'Navorika', type: 'website' },
    twitter: { card: 'summary', title: tool.title, description: tool.description },
    robots: { index: indexable, follow: true },
  };
}

export default async function LocalizedToolPage({ params }: Props) {
  const { locale, slug } = await params;
  if (!isLocale(locale) || !isTranslatedTool(slug)) notFound();
  const d = await getDictionary(locale);
  const tool = d.tools[slug];
  const richTool = tool as typeof tool & LocalizedToolCopy;
  const indexable = hasIndexableLocalizedToolCopy(tool);
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
  const renderCopy = (copy: string | string[]) => (Array.isArray(copy) ? copy : [copy]).map((text, index) => (
    <p key={`${index}-${text}`} className="leading-relaxed text-[var(--muted-foreground)] text-sm sm:text-base">
      <BidiText text={text} />
    </p>
  ));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }}
      />

      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="mb-3 sm:mb-5 flex flex-wrap items-center gap-2 text-sm text-[var(--muted-foreground)]">
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
      <div className="mb-5 sm:mb-7">
        <h1 className="max-w-4xl text-2xl font-black tracking-tight text-[var(--foreground)] sm:text-4xl [overflow-wrap:anywhere]">
          {tool.title}
        </h1>
        <p className="mt-2 max-w-3xl text-sm sm:text-base leading-relaxed text-[var(--muted-foreground)] [overflow-wrap:anywhere]">
          <BidiText text={tool.description} />
        </p>


      </div>

      {/* Main Tool Interactive Component */}
      <LocalizedTools key={`${locale}/${slug}`} locale={locale} slug={slug} dictionary={d} />

      <div className="mt-6 max-w-3xl" aria-label="Tool processing information">
        {/* Privacy Trust Banner */}
        <div className="my-0 max-w-3xl rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4 text-xs sm:text-sm leading-relaxed text-[var(--foreground)] flex items-center gap-3">
          <Shield className="h-5 w-5 text-emerald-500 shrink-0" />
          <span>{d.ui.local}</span>
        </div>
      </div>

      {indexable ? (
        <div className="mt-12 space-y-8">
          <section><h2 className="text-xl font-bold">{d.ui.aboutTool}</h2><div className="mt-3 space-y-3">{richTool.about && renderCopy(richTool.about)}</div></section>
          <section><h2 className="text-xl font-bold">{d.ui.calculationMethod}</h2><div className="mt-3 space-y-3">{richTool.calculationMethod && renderCopy(richTool.calculationMethod)}</div></section>
          <section><h2 className="text-xl font-bold">{d.ui.how}</h2><ol className="mt-3 list-decimal space-y-2 pl-6 text-sm sm:text-base">{richTool.steps?.map((step, index) => <li key={`${index}-${step}`} className="leading-relaxed"><BidiText text={step} /></li>)}</ol></section>
          <section><h2 className="text-xl font-bold">{d.ui.understandingResults}</h2><div className="mt-3 space-y-3">{richTool.understandingResults && renderCopy(richTool.understandingResults)}</div></section>
          <section><h2 className="text-xl font-bold">{d.ui.limits}</h2><div className="mt-3 space-y-3">{richTool.limits && renderCopy(richTool.limits)}</div></section>
          <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
            <h2 className="text-xl font-bold">{d.ui.faq}</h2>
            <div className="mt-4 space-y-5">{richTool.faqs?.map(({ question, answer }) => <div key={question}><h3 className="font-semibold text-base sm:text-lg">{question}</h3><p className="mt-2.5 leading-relaxed text-[var(--muted-foreground)] text-sm sm:text-base"><BidiText text={answer} /></p></div>)}</div>
          </section>
        </div>
      ) : (
        <>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
              <h2 className="text-xl font-bold">{d.ui.how}</h2>
              <p className="mt-3.5 leading-relaxed text-[var(--muted-foreground)] text-sm sm:text-base"><BidiText text={tool.how} /></p>
            </section>
            <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
              <h2 className="text-xl font-bold">{d.ui.limits}</h2>
              <p className="mt-3.5 leading-relaxed text-[var(--muted-foreground)] text-sm sm:text-base"><BidiText text={tool.limits} /></p>
            </section>
          </div>
          <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
            <h2 className="text-xl font-bold">{d.ui.faq}</h2>
            <h3 className="mt-4 font-semibold text-base sm:text-lg">{tool.question}</h3>
            <p className="mt-2.5 leading-relaxed text-[var(--muted-foreground)] text-sm sm:text-base"><BidiText text={tool.answer} /></p>
          </section>
        </>
      )}

      <PageHelp path={`/${locale}/tools/${slug}`} />

      {/* Related Tools */}
      <section className="mt-10">
        <h2 className="text-xl font-bold mb-4">{d.ui.related}</h2>
        <div className="flex flex-wrap gap-2.5">
          {relatedToolSlugs(slug)
            .map((item) => (
              <Link
                key={item}
                href={localizedPath(locale, item)}
                className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-3.5 py-2 text-xs sm:text-sm font-medium hover:border-[#e5322d]/40 hover:text-[#e5322d] dark:hover:text-[#ff6b68] transition-all shadow-xs"
              >
                {d.tools[item].title}
              </Link>
            ))}
        </div>
      </section>
    </>
  );
}
