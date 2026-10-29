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
  Wrench,
  Globe,
  Sparkles,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';
import { localizedPath, translatedTools, type Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/dictionaries';
import { tools } from '@/data/registry';

const toolCategoryMap = new Map(tools.map((t) => [t.slug, t.category]));

const CATEGORY_CONFIG = [
  { id: 'all', key: 'catAll', icon: Sparkles, color: 'text-indigo-600 dark:text-indigo-400 bg-indigo-500/10' },
  { id: 'pdf-tools', key: 'catPdf', icon: FileText, color: 'text-blue-600 dark:text-blue-400 bg-blue-500/10' },
  { id: 'image-tools', key: 'catImage', icon: ImageIcon, color: 'text-purple-600 dark:text-purple-400 bg-purple-500/10' },
  { id: 'finance-calculators', key: 'catFinance', icon: Calculator, color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10' },
  { id: 'health-calculators', key: 'catHealth', icon: HeartPulse, color: 'text-rose-600 dark:text-rose-400 bg-rose-500/10' },
  { id: 'developer-tools', key: 'catDeveloper', icon: Code2, color: 'text-amber-600 dark:text-amber-400 bg-amber-500/10' },
  { id: 'construction-calculators', key: 'catConstruction', icon: Wrench, color: 'text-cyan-600 dark:text-cyan-400 bg-cyan-500/10' },
  { id: 'everyday-calculators', key: 'catEveryday', icon: Globe, color: 'text-sky-600 dark:text-sky-400 bg-sky-500/10' },
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

  return (
    <section id="tools" className="mt-8 scroll-mt-24">
      {/* Search Header */}
      <div className="max-w-2xl mx-auto mb-8">
        <label htmlFor="tool-search" className="mb-2 block text-sm font-semibold text-[var(--foreground)]">
          {d.ui.search}
        </label>
        <div className="relative flex items-center">
          <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-4 text-[var(--muted-foreground)]">
            <Search className="h-5 w-5" aria-hidden="true" />
          </div>
          <input
            id="tool-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={d.ui.searchPlaceholder}
            className="w-full rounded-2xl border border-[var(--border)] bg-[var(--card)] py-3.5 ps-11 pe-11 text-base shadow-sm transition placeholder:text-[var(--muted-foreground)] focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
          {query.length > 0 && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute inset-y-0 end-0 flex items-center pe-3.5 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition"
              aria-label={d.ui.clearSearch}
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
        <div className="mt-2.5 flex items-center justify-between px-1 text-xs text-[var(--muted-foreground)]">
          <span>
            {matches.length} {d.ui.toolsFound}
          </span>
          {(query || activeCategory !== 'all') && (
            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              <RotateCcw className="h-3 w-3" />
              <span>{d.ui.reset}</span>
            </button>
          )}
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="mb-8 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORY_CONFIG.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          const count = categoryCounts[cat.id] ?? 0;
          const label = d.ui[cat.key as keyof typeof d.ui] as string;

          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-all duration-200 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25 scale-[1.02]'
                  : 'bg-[var(--card)] border border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:border-indigo-500/40'
              }`}
            >
              <Icon className="h-3.5 w-3.5 shrink-0" />
              <span>{label}</span>
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-[var(--muted)] text-[var(--muted-foreground)]'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tool Cards Grid */}
      {matches.length > 0 ? (
        <>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {matches.map((slug) => {
              const tool = d.tools[slug];
              const catSlug = toolCategoryMap.get(slug) || 'everyday-calculators';
              const catConfig = CATEGORY_CONFIG.find((c) => c.id === catSlug) || CATEGORY_CONFIG[7];
              const CatIcon = catConfig.icon;
              const catLabel = d.ui[catConfig.key as keyof typeof d.ui] as string;

              return (
                <Link
                  key={slug}
                  href={localizedPath(locale, slug)}
                  className="group relative flex flex-col justify-between rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/50 hover:shadow-xl sm:p-6"
                >
                  <div>
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${catConfig.color}`}
                      >
                        <CatIcon className="h-3.5 w-3.5 shrink-0" />
                        <span>{catLabel}</span>
                      </span>
                    </div>
                    <h2 className="text-lg font-bold text-[var(--foreground)] transition-colors group-hover:text-indigo-600 dark:group-hover:text-indigo-400 [overflow-wrap:anywhere]">
                      {tool.title}
                    </h2>
                    <p className="mt-2.5 text-sm leading-relaxed text-[var(--muted-foreground)] line-clamp-3 [overflow-wrap:anywhere]">
                      {tool.description}
                    </p>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-[var(--border)]/60 pt-3 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                    <span>{d.ui.exploreCategory}</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
                  </div>
                </Link>
              );
            })}
          </div>
          <p role="status" className="sr-only" />
        </>
      ) : (
        /* Empty State */
        <div className="my-10 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-12 text-center shadow-sm">
          <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <Search className="h-6 w-6 opacity-75" />
          </div>
          <p role="status" className="text-base font-semibold text-[var(--foreground)]">
            {d.ui.noResults}
          </p>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            {d.ui.searchPlaceholder}
          </p>
          <button
            onClick={resetFilters}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
          >
            <RotateCcw className="h-4 w-4" />
            <span>{d.ui.reset}</span>
          </button>
        </div>
      )}
    </section>
  );
}
