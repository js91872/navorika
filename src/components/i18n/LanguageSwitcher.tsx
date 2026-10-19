'use client';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { Languages } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { isTranslatedTool, languageNames, locales, localizedPath, type Language, type TranslatedTool } from '@/lib/i18n/config';

export default function LanguageSwitcher({ locale, slug, label = 'Language' }: {
  locale: Language; slug?: TranslatedTool; label?: string;
}) {
  const menuRef = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    const dismissOutside = (event: PointerEvent) => {
      const menu = menuRef.current;
      if (menu?.open && event.target instanceof Node && !menu.contains(event.target)) menu.open = false;
    };
    const dismissEscape = (event: KeyboardEvent) => {
      const menu = menuRef.current;
      if (event.key === 'Escape' && menu?.open) {
        menu.open = false;
        menu.querySelector('summary')?.focus();
      }
    };
    document.addEventListener('pointerdown', dismissOutside, true);
    document.addEventListener('keydown', dismissEscape);
    return () => {
      document.removeEventListener('pointerdown', dismissOutside, true);
      document.removeEventListener('keydown', dismissEscape);
    };
  }, []);
  const pathname = usePathname();
  const segment = pathname?.split('/').filter(Boolean).at(-1) ?? '';
  const currentTool = slug ?? (isTranslatedTool(segment) ? segment : undefined);
  return (
    <details ref={menuRef} className="relative">
      <summary aria-label={`${label}: ${languageNames[locale]}`} className="flex min-h-11 min-w-11 cursor-pointer list-none items-center justify-center rounded-full text-sm text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)] sm:rounded-xl sm:border sm:border-[var(--border)] sm:px-3 sm:py-2 [&::-webkit-details-marker]:hidden">
        <Languages className="h-5 w-5 sm:hidden" aria-hidden="true" />
        <span className="hidden sm:inline">{label}: <span lang={locale}>{languageNames[locale]}</span></span>
      </summary>
      <nav aria-label={label} className="absolute end-0 z-[60] mt-2 grid min-w-44 gap-1 rounded-xl border border-[var(--border)] bg-[var(--background)] p-2 shadow-xl">
        {(['en', ...locales] as const).map((language) => (
          <Link key={language} href={localizedPath(language, currentTool)} hrefLang={language} lang={language}
            aria-current={locale === language ? 'page' : undefined}
            onClick={() => { if (menuRef.current) menuRef.current.open = false; }}
            className={`rounded-lg px-3 py-2 text-sm hover:bg-[var(--muted)] ${locale === language ? 'font-bold text-indigo-600 dark:text-indigo-400' : ''}`}>
            {languageNames[language]}
          </Link>
        ))}
      </nav>
    </details>
  );
}
