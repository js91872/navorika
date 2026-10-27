import Link from 'next/link';
import type { Locale } from '@/lib/i18n/config';
import type { TrustPageContent, GlossaryPageContent } from '@/lib/i18n/trustPages';

interface LocalizedTrustPageProps {
  locale: Locale;
  content: TrustPageContent;
  homeLabel: string;
}

export function LocalizedTrustPage({ locale, content, homeLabel }: LocalizedTrustPageProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link href={`/${locale}`} className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
          ← {homeLabel}
        </Link>
      </div>
      <div className="mb-10">
        {content.eyebrow && (
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-3">
            {content.eyebrow}
          </div>
        )}
        <h1 className="text-3xl font-extrabold sm:text-4xl text-indigo-600 dark:text-indigo-400">
          {content.heroTitle}
        </h1>
        <p className="mt-4 text-lg text-[var(--muted-foreground)] leading-relaxed">
          {content.heroDescription}
        </p>
      </div>

      <div className="space-y-6">
        {content.sections.map((section, idx) => (
          <section key={idx} className="rounded-2xl border border-[var(--border)] p-6 bg-[var(--card)]">
            <h2 className="text-xl font-bold mb-3">{section.title}</h2>
            <p className="text-[var(--muted-foreground)] leading-relaxed">{section.content}</p>
            {section.points && section.points.length > 0 && (
              <ul className="mt-4 space-y-2 list-disc list-inside text-sm text-[var(--muted-foreground)]">
                {section.points.map((point, pIdx) => (
                  <li key={pIdx}>{point}</li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}

interface LocalizedGlossaryPageProps {
  locale: Locale;
  content: GlossaryPageContent;
  homeLabel: string;
}

export function LocalizedGlossaryPage({ locale, content, homeLabel }: LocalizedGlossaryPageProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link href={`/${locale}`} className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
          ← {homeLabel}
        </Link>
      </div>
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold sm:text-4xl text-indigo-600 dark:text-indigo-400">
          {content.heroTitle}
        </h1>
        <p className="mt-4 text-lg text-[var(--muted-foreground)] leading-relaxed">
          {content.heroDescription}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {content.terms.map((item, idx) => (
          <div key={idx} className="rounded-2xl border border-[var(--border)] p-5 bg-[var(--card)]">
            <h2 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 mb-2">{item.term}</h2>
            <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">{item.definition}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
