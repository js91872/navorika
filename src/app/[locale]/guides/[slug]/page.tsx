import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { languageDirection, languageNames, locales, type Language, isLocale } from '@/lib/i18n/config';
import { webpPngGuideTranslations } from '@/lib/i18n/webpPngGuideContent';

const slug = 'webp-to-png-guide';
const articleUrl = (locale: Language) => locale === 'en'
  ? `https://navorika.com/guides/${slug}`
  : `https://navorika.com/${locale}/guides/${slug}`;
type Props = { params: Promise<{ locale: string; slug: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return locales.map((locale) => ({ locale, slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug: requestedSlug } = await params;
  if (!isLocale(locale) || requestedSlug !== slug) notFound();
  const copy = webpPngGuideTranslations[locale];
  const languages = Object.fromEntries(
    (['en', ...locales] as Language[]).map((language) => [language, articleUrl(language)]),
  );
  languages['x-default'] = articleUrl('en');
  return {
    title: copy.title,
    description: copy.description,
    keywords: copy.keywords,
    alternates: { canonical: articleUrl(locale), languages },
    authors: [{ name: 'Navorika Team', url: 'https://navorika.com' }],
    category: copy.category,
    openGraph: { type: 'article', url: articleUrl(locale), title: copy.title, description: copy.description, siteName: 'Navorika', publishedTime: '2026-11-13', modifiedTime: '2026-11-13', locale },
    twitter: { card: 'summary', title: copy.title, description: copy.description },
  };
}

export default async function LocalizedWebpPngGuide({ params }: Props) {
  const { locale, slug: requestedSlug } = await params;
  if (!isLocale(locale) || requestedSlug !== slug) notFound();
  const copy = webpPngGuideTranslations[locale];
  const direction = languageDirection(locale);
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: copy.title,
    description: copy.description,
    inLanguage: locale,
    datePublished: '2026-11-13',
    dateModified: '2026-11-13',
    author: { '@type': 'Organization', name: 'Navorika' },
    mainEntityOfPage: articleUrl(locale),
    image: 'https://navorika.com/images/guides/image-guides.webp',
  };
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: copy.faqs.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
  };

  return (
    <main dir={direction} className="min-h-screen bg-[#f7f7f8] dark:bg-[#121214] pb-16 text-[#18181b] dark:text-[#f4f4f5]">
      <div className="mx-auto max-w-4xl px-4 pt-8 sm:px-6">
        <nav aria-label="Breadcrumb" className="mb-7 flex items-center gap-2 text-sm text-[#5b5b63] dark:text-[#a1a1aa]">
          <Link href={`/${locale}`} className="hover:text-[#e5322d]">{languageNames[locale]}</Link>
          <span aria-hidden="true">/</span><span>{copy.category}</span>
        </nav>
        <article>
          <header className="mb-8 border-b border-[#e4e4e8] pb-8 dark:border-[#27272a]">
            <p className="text-sm font-semibold text-[#e5322d]">{copy.category} · {copy.publishedDate} · {copy.readTime}</p>
            <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">{copy.title}</h1>
            <p className="mt-4 text-lg leading-relaxed text-[#5b5b63] dark:text-[#a1a1aa]">{copy.description}</p>
            <Link href={`/${locale}/tools/webp-to-png`} className="mt-6 inline-flex rounded-lg bg-[#e5322d] px-5 py-3 font-semibold text-white hover:bg-[#c92320]">
              {copy.toolLabel}
            </Link>
          </header>
          <div className="mb-8 rounded-xl border border-[#e4e4e8] bg-white p-5 text-base leading-8 dark:border-[#27272a] dark:bg-[#18181b]">
            <p>{copy.intro}</p>
            <h2 className="mt-6 text-xl font-bold">{copy.stepsTitle}</h2>
            <ol className="mt-3 list-decimal space-y-2 ps-6">
              {copy.steps.map((step) => <li key={step}>{step}</li>)}
            </ol>
          </div>
          <div className="space-y-9 text-base leading-8">
            {copy.sections.map((section) => (
              <section key={section.title}>
                <h2 className="mb-3 text-2xl font-bold">{section.title}</h2>
                {section.paragraphs.map((paragraph, index) => <p key={index} className="mb-4">{paragraph}</p>)}
              </section>
            ))}
            <section className="rounded-xl border border-[#e5322d]/20 bg-[#fff1f1] p-6 dark:bg-[#e5322d]/[0.06]">
              <h2 className="text-xl font-bold">{copy.stepsTitle}</h2>
              <p className="mt-3">{copy.conclusion}</p>
            </section>
          </div>
          <section className="mt-12 border-t border-[#e4e4e8] pt-8 dark:border-[#27272a]">
            <h2 className="text-2xl font-bold">{copy.languageLabel}</h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {(['en', ...locales] as Language[]).map((language) => (
                <li key={language}>
                  <Link href={language === 'en' ? `/guides/${slug}` : `/${language}/guides/${slug}`}
                    aria-current={language === locale ? 'page' : undefined}
                    className={`inline-flex rounded-full border px-3 py-1.5 text-sm hover:border-[#e5322d] ${language === locale ? 'border-[#e5322d] text-[#e5322d]' : 'border-[#e4e4e8] dark:border-[#27272a]'}`}>
                    {languageNames[language]}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
          <section className="mt-12 border-t border-[#e4e4e8] pt-8 dark:border-[#27272a]">
            <h2 className="text-2xl font-bold">{copy.faqTitle}</h2>
            <div className="mt-5 space-y-3">
              {copy.faqs.map(({ question, answer }) => (
                <details key={question} className="rounded-xl border border-[#e4e4e8] bg-white p-5 dark:border-[#27272a] dark:bg-[#18181b]">
                  <summary className="cursor-pointer font-semibold">{question}</summary>
                  <p className="mt-3 text-sm leading-relaxed text-[#5b5b63] dark:text-[#a1a1aa]">{answer}</p>
                </details>
              ))}
            </div>
          </section>
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replaceAll('<', '\\u003c') }} />
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replaceAll('<', '\\u003c') }} />
        </article>
      </div>
    </main>
  );
}
