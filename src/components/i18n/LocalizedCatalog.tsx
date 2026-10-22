'use client';
import Link from 'next/link';
import { useState } from 'react';
import { localizedPath, translatedTools, type Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/dictionaries';

export default function LocalizedCatalog({ locale, dictionary: d }: { locale: Locale; dictionary: Dictionary }) {
  const [query, setQuery] = useState('');
  const matches = translatedTools.filter((slug) =>
    `${d.tools[slug].title} ${d.tools[slug].description} ${slug}`.toLocaleLowerCase(locale).includes(query.trim().toLocaleLowerCase(locale)));
  return <>
    <label htmlFor="tool-search" className="mb-2 block font-semibold">{d.ui.search}</label>
    <input id="tool-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)}
      className="mb-8 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3" />
    <div className="grid gap-5 md:grid-cols-2">
      {matches.map((slug) => <Link key={slug} href={localizedPath(locale, slug)}
        className="min-w-0 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 transition hover:border-indigo-500">
        <h2 className="break-words text-xl font-bold text-indigo-600 dark:text-indigo-400">{d.tools[slug].title}</h2>
        <p className="mt-3 break-words leading-7 text-[var(--muted-foreground)]">{d.tools[slug].description}</p>
      </Link>)}
    </div>
    <p role="status" className="mt-4">{matches.length === 0 ? d.ui.noResults : ''}</p>
  </>;
}
