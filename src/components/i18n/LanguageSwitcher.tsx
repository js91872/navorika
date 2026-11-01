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
      <summary aria-label={`${label}: ${languageNames[locale]}`} className="flex min-h-11 min-w-11 cursor-pointer list-none items-center justify-center rounded-lg border border-[#e4e4e8] dark:border-[#27272a] bg-[#f7f7f8] dark:bg-[#202023] px-2.5 py-1.5 text-xs font-semibold text-[#52525b] dark:text-[#a1a1aa] hover:border-[#e5322d] hover:text-[#e5322d] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e5322d] [&::-webkit-details-marker]:hidden">
        <Languages className="h-4 w-4 sm:mr-1.5" aria-hidden="true" />
        <span className="hidden sm:inline">{languageNames[locale]}</span>
      </summary>
      <nav aria-label={label} className="absolute end-0 z-[60] mt-1.5 grid min-w-44 gap-1 rounded-xl border border-[#e4e4e8] dark:border-[#27272a] bg-white dark:bg-[#18181b] p-1.5 shadow-xl">
        {(['en', ...locales] as const).map((language) => (
          <Link key={language} href={localizedPath(language, currentTool)} hrefLang={language} lang={language}
            aria-current={locale === language ? 'page' : undefined}
            onClick={() => { if (menuRef.current) menuRef.current.open = false; }}
            className={`rounded-lg px-3 py-2 text-xs font-medium hover:bg-[#f7f7f8] dark:hover:bg-[#202023] transition-colors ${locale === language ? 'font-bold text-[#e5322d] bg-[#fff1f1] dark:bg-[#e5322d]/10' : 'text-[#52525b] dark:text-[#a1a1aa]'}`}>
            {languageNames[language]}
          </Link>
        ))}
      </nav>
    </details>
  );
}
