'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  X,
  FileText,
  ImageIcon,
  Calculator,
  HeartPulse,
  Code2,
  Hammer,
  Globe,
  Sparkles,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';
import { localizedPath, translatedTools, type Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/dictionaries';
import { tools } from '@/data/registry';
import { getToolIcon } from '@/lib/toolIcons';

const toolCategoryMap = new Map(tools.map((t) => [t.slug, t.category]));

const CATEGORY_CONFIG = [
  { id: 'all', key: 'catAll', icon: Sparkles },
  { id: 'pdf-tools', key: 'catPdf', icon: FileText },
  { id: 'image-tools', key: 'catImage', icon: ImageIcon },
  { id: 'finance-calculators', key: 'catFinance', icon: Calculator },
  { id: 'health-calculators', key: 'catHealth', icon: HeartPulse },
  { id: 'developer-tools', key: 'catDeveloper', icon: Code2 },
  { id: 'construction-calculators', key: 'catConstruction', icon: Hammer },
  { id: 'everyday-calculators', key: 'catEveryday', icon: Globe },
] as const;

export default function LocalizedCatalog({ locale, dictionary: d }: { locale: Locale; dictionary: Dictionary }) {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Compute tool counts per category for the filter tabs
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: translatedTools.length };
    for (const slug of translatedTools) {
      const cat = toolCategoryMap.get(slug) || 'other';
      counts[cat] = (counts[cat] || 0) + 1;
    }
    return counts;
  }, []);

  // Filter tools based on activeCategory and search query
  const matches = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase(locale);
    return translatedTools.filter((slug) => {
      // Category filter
      if (activeCategory !== 'all') {
        const cat = toolCategoryMap.get(slug);
        if (cat !== activeCategory) return false;
      }
      // Query filter
      if (!normalizedQuery) return true;
      const tool = d.tools[slug];
      const searchTarget = `${tool.title} ${tool.description} ${slug}`.toLocaleLowerCase(locale);
      return searchTarget.includes(normalizedQuery);
    });
  }, [locale, d, query, activeCategory]);

  const resetFilters = () => {
    setQuery('');
    setActiveCategory('all');
  };

  const formattedCount = useMemo(() => {
    return new Intl.NumberFormat(locale).format(matches.length);
  }, [locale, matches.length]);

  const totalCount = useMemo(() => {
    return new Intl.NumberFormat(locale).format(translatedTools.length);
  }, [locale]);

  const announcement = `${formattedCount} ${d.ui.toolsFound}`;

  return (
    <section id="tools" className="mt-6 scroll-mt-24 max-w-full overflow-hidden">
      {/* Search Header */}
      <div className="max-w-2xl mx-auto mb-8">
        <label htmlFor="tool-search" className="mb-2 block text-sm font-semibold text-[#18181b] dark:text-white">
          {d.ui.search}
        </label>
        <div className="relative flex items-center bg-white dark:bg-[#18181b] border border-[#d6d6dc] dark:border-[#27272a] rounded-lg shadow-xs focus-within:border-[#e5322d] focus-within:ring-2 focus-within:ring-[#e5322d]/20 transition-all">
          <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-4 text-[#5b5b63] dark:text-[#a1a1aa]">
            <Search className="h-5 w-5" aria-hidden="true" />
          </div>
          <input
            id="tool-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={d.ui.searchPlaceholder}
            className="w-full bg-transparent py-3.5 ps-11 pe-11 text-sm sm:text-base text-[#18181b] dark:text-white outline-none placeholder:text-[#5b5b63] dark:placeholder:text-[#a1a1aa]"
          />
          {query.length > 0 && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute inset-y-0 end-0 flex items-center pe-3.5 text-[#5b5b63] hover:text-[#18181b] dark:hover:text-white transition rounded-full"
              aria-label={d.ui.clearSearch}
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
        <div className="mt-2.5 flex items-center justify-between px-1 text-xs text-[#5b5b63] dark:text-[#a1a1aa]">
          <span>
            {query.trim() || activeCategory !== 'all'
              ? announcement
              : `${totalCount} ${d.ui.toolsFound}`}
          </span>
          {(query || activeCategory !== 'all') && (
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1 text-[#e5322d] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e5322d] rounded"
            >
              <RotateCcw className="h-3 w-3" />
              <span>{d.ui.reset}</span>
            </button>
          )}
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="mb-8 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none max-w-full" aria-label="Filter tools by category">
        {CATEGORY_CONFIG.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          const count = categoryCounts[cat.id] ?? 0;
          const label = d.ui[cat.key as keyof typeof d.ui] as string;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              aria-pressed={isActive}
              className={`inline-flex shrink-0 items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#e5322d] border border-[#e5322d] text-white shadow-xs'
                  : 'bg-white dark:bg-[#18181b] border border-[#dddde2] dark:border-[#27272a] text-[#3d4655] dark:text-[#a1a1aa] hover:border-[#e5322d]'
              }`}
            >
              <Icon className="h-3.5 w-3.5 shrink-0" />
              <span>{label}</span>
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-[#f0f0f2] dark:bg-[#27272a] text-[#5b5b63] dark:text-[#a1a1aa]'
                }`}
              >
                {new Intl.NumberFormat(locale).format(count)}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tool Cards Grid */}
      {matches.length > 0 ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {matches.map((slug) => {
              const tool = d.tools[slug];
              const catSlug = toolCategoryMap.get(slug) || 'everyday-calculators';
              const catConfig = CATEGORY_CONFIG.find((c) => c.id === catSlug) || CATEGORY_CONFIG[7];
              const CatIcon = catConfig.icon;

              return (
                <Link
                  key={slug}
                  href={localizedPath(locale, slug)}
                  className="group relative flex flex-col justify-between rounded-xl border border-[#e4e4e8] dark:border-[#27272a] bg-white dark:bg-[#18181b] p-5 transition-all duration-150 hover:border-[#e5322d] hover:shadow-md min-h-[145px]"
                >
                  <div>
                    <div className="mb-3 flex items-start justify-between gap-2">
                      <span
                        className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[#fff1f1] dark:bg-[#e5322d]/10 text-xl text-[#e5322d]"
                        aria-hidden="true"
                      >
                        <CatIcon className="h-5 w-5" />
                      </span>
                      <span className="text-[#5b5b63] dark:text-[#a1a1aa] group-hover:text-[#e5322d] group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-all">
                        →
                      </span>
                    </div>
                    {/* Exactly one h2 per tool card - tested by test:i18n:browser */}
                    <h2 className="text-[17px] font-semibold text-[#18181b] dark:text-white transition-colors group-hover:text-[#e5322d] [overflow-wrap:anywhere] line-clamp-1">
                      {tool.title}
                    </h2>
                    <p className="mt-1.5 text-sm leading-relaxed text-[#5b5b63] dark:text-[#a1a1aa] line-clamp-2 [overflow-wrap:anywhere]">
                      {tool.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
          <p role="status" aria-live="polite" className="sr-only">
            {announcement}
          </p>
        </>
      ) : (
        /* Empty State */
        <div className="my-8 rounded-xl border border-[#e4e4e8] dark:border-[#27272a] bg-white dark:bg-[#18181b] p-10 text-center shadow-xs">
          <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-xl bg-[#fff1f1] dark:bg-[#e5322d]/10 text-[#e5322d]">
            <Search className="h-6 w-6" />
          </div>
          <p role="status" aria-live="polite" className="text-base font-semibold text-[#18181b] dark:text-white">
            {d.ui.noResults}
          </p>
          <p className="mt-1 text-sm text-[#5b5b63] dark:text-[#a1a1aa]">
            {d.ui.searchPlaceholder}
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#e5322d] hover:bg-[#c71f1e] px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition cursor-pointer"
          >
            <RotateCcw className="h-4 w-4" />
            <span>{d.ui.reset}</span>
          </button>
        </div>
      )}
    </section>
  );
}
