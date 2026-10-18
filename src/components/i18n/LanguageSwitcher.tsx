'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { isTranslatedTool, languageNames, locales, localizedPath, type Language, type TranslatedTool } from '@/lib/i18n/config';

export default function LanguageSwitcher({ locale, slug, label = 'Language' }: {
  locale: Language; slug?: TranslatedTool; label?: string;
}) {
  const pathname = usePathname();
  const segment = pathname?.split('/').filter(Boolean).at(-1) ?? '';
  const currentTool = slug ?? (isTranslatedTool(segment) ? segment : undefined);
  return (
    <details className="relative">
      <summary className="cursor-pointer rounded-xl border border-[var(--border)] px-3 py-2 text-sm">
        {label}: <span lang={locale}>{languageNames[locale]}</span>
      </summary>
      <nav aria-label={label} className="absolute end-0 z-[60] mt-2 grid min-w-44 gap-1 rounded-xl border border-[var(--border)] bg-[var(--background)] p-2 shadow-xl">
        {(['en', ...locales] as const).map((language) => (
          <Link key={language} href={localizedPath(language, currentTool)} hrefLang={language} lang={language}
            aria-current={locale === language ? 'page' : undefined}
            className={`rounded-lg px-3 py-2 text-sm hover:bg-[var(--muted)] ${locale === language ? 'font-bold text-indigo-600 dark:text-indigo-400' : ''}`}>
            {languageNames[language]}
          </Link>
        ))}
      </nav>
    </details>
  );
}
