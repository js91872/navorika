'use client';

import { useState, useMemo, useId } from 'react';
import Link from 'next/link';
import {
  Search,
  X,
  ArrowRight,
  FileText,
  ImageIcon,
  Calculator,
  ArrowLeftRight,
  Volume2,
  Code2,
  Hammer,
  RotateCcw,
} from 'lucide-react';
import { searchTools } from '@/lib/toolSearch';
import type { Tool } from '@/data/registry';

export interface CatalogTool extends Tool {
  displayDescription: string;
}

const CATEGORIES = [
  { id: 'all', label: 'All Tools' },
  { id: 'pdf', label: 'PDF Tools' },
  { id: 'image', label: 'Image Tools' },
  { id: 'calculator', label: 'Calculators' },
  { id: 'converter', label: 'Converters' },
  { id: 'audio', label: 'Audio Tools' },
  { id: 'developer', label: 'Developer' },
  { id: 'construction', label: 'Construction' },
] as const;

function getToolSymbol(slug: string, category: string) {
  if (slug.includes('pdf') || category === 'pdf-tools') {
    return <FileText className="h-6 w-6 text-[#e5322d]" aria-hidden="true" />;
  }
  if (slug.includes('image') || slug.includes('jpg') || slug.includes('png') || slug.includes('webp') || slug.includes('svg') || slug.includes('heic') || category === 'image-tools') {
    return <ImageIcon className="h-6 w-6 text-[#e5322d]" aria-hidden="true" />;
  }
  if (slug.includes('converter') || slug.includes('-to-')) {
    return <ArrowLeftRight className="h-6 w-6 text-[#e5322d]" aria-hidden="true" />;
  }
  if (slug.includes('audio') || slug.includes('sound') || slug.includes('speaker') || slug.includes('mp3') || slug.includes('wav')) {
    return <Volume2 className="h-6 w-6 text-[#e5322d]" aria-hidden="true" />;
  }
  if (category === 'developer-tools' || slug.includes('json') || slug.includes('yaml') || slug.includes('jwt') || slug.includes('regex') || slug.includes('cron') || slug.includes('uuid')) {
    return <Code2 className="h-6 w-6 text-[#e5322d]" aria-hidden="true" />;
  }
  if (category === 'construction-calculators' || slug.includes('concrete') || slug.includes('roof') || slug.includes('deck') || slug.includes('brick') || slug.includes('stud')) {
    return <Hammer className="h-6 w-6 text-[#e5322d]" aria-hidden="true" />;
  }
  return <Calculator className="h-6 w-6 text-[#e5322d]" aria-hidden="true" />;
}

export default function HomeToolCatalog({ tools }: { tools: CatalogTool[] }) {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const searchInputId = useId();

  const filteredTools = useMemo(() => {
    let list = tools;

    // Filter by selected category pill
    if (selectedCategory !== 'all') {
      list = list.filter((tool) => {
        const cat = tool.category.toLowerCase();
        const slug = tool.slug.toLowerCase();
        if (selectedCategory === 'pdf') return cat === 'pdf-tools' || slug.includes('pdf');
        if (selectedCategory === 'image') return cat === 'image-tools' || slug.includes('image') || slug.includes('jpg') || slug.includes('png') || slug.includes('webp');
        if (selectedCategory === 'calculator') return cat.includes('calculator') || slug.includes('calculator');
        if (selectedCategory === 'converter') return slug.includes('converter') || slug.includes('-to-');
        if (selectedCategory === 'audio') return slug.includes('audio') || slug.includes('sound') || slug.includes('speaker') || slug.includes('mp3');
        if (selectedCategory === 'developer') return cat === 'developer-tools' || slug.includes('json') || slug.includes('yaml') || slug.includes('jwt') || slug.includes('regex');
        if (selectedCategory === 'construction') return cat === 'construction-calculators';
        return true;
      });
    }

    // Filter by search query
    if (query.trim()) {
      const bySlug = new Map(list.map((t) => [t.slug, t]));
      const searchItems = list.map((t) => ({
        slug: t.slug,
        title: t.title,
        description: t.displayDescription || t.description,
        category: t.category,
        keywords: [t.category, t.slug.replace(/-/g, ' ')],
      }));
      const ranked = searchTools(query, searchItems);
      list = ranked.flatMap(({ slug }) => {
        const item = bySlug.get(slug);
        return item ? [item] : [];
      });
    }

    return list;
  }, [tools, selectedCategory, query]);

  const resetFilters = () => {
    setQuery('');
    setSelectedCategory('all');
  };

  // Show a prominent set of popular tools when not actively searching
  const displayedTools = useMemo(() => {
    if (query.trim() || selectedCategory !== 'all') {
      return filteredTools;
    }
    // On default view, display top 24 popular tools
    return filteredTools.slice(0, 24);
  }, [filteredTools, query, selectedCategory]);

  return (
    <div className="w-full">
      {/* Search Bar matching approved preview */}
      <div className="max-w-2xl mx-auto mb-8">
        <form
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            document.getElementById('tools')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="flex w-full bg-white dark:bg-[#18181b] border border-[#d6d6dc] dark:border-[#27272a] rounded-lg overflow-hidden shadow-xs focus-within:border-[#e5322d] focus-within:ring-2 focus-within:ring-[#e5322d]/20 transition-all"
        >
          <div className="relative flex-1 flex items-center min-w-0">
            <Search className="absolute left-4 h-5 w-5 text-[#5b5b63] dark:text-[#a1a1aa] pointer-events-none" aria-hidden="true" />
            <input
              id={searchInputId}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tools — e.g. PDF, image, BMI, concrete"
              aria-label="Search tools"
              className="w-full min-w-0 py-3.5 sm:py-4 pl-12 pr-10 bg-transparent border-0 outline-none text-sm sm:text-base text-[#18181b] dark:text-white placeholder:text-[#5b5b63] dark:placeholder:text-[#a1a1aa]"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-3 p-1 rounded-full text-[#5b5b63] hover:text-[#18181b] dark:hover:text-white"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <button
            type="submit"
            className="bg-[#e5322d] hover:bg-[#c71f1e] text-white font-semibold px-5 sm:px-7 text-sm transition-colors cursor-pointer shrink-0"
          >
            Search
          </button>
        </form>
      </div>

      {/* Filter Pills matching approved preview */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-4 scrollbar-none" aria-label="Filter tools by category">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              aria-pressed={isActive}
              className={`shrink-0 border rounded-lg px-4 py-2 text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#e5322d] border-[#e5322d] text-white shadow-xs'
                  : 'bg-white dark:bg-[#18181b] border-[#dddde2] dark:border-[#27272a] text-[#3d4655] dark:text-[#a1a1aa] hover:border-[#e5322d]'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Section Header */}
      <div id="tools" className="flex items-center justify-between gap-4 mb-5 pt-2 scroll-mt-24">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#18181b] dark:text-white">
            {query.trim() || selectedCategory !== 'all' ? 'Matching Tools' : 'Popular Tools'}
          </h2>
          <p className="text-xs text-[#5b5b63] dark:text-[#a1a1aa] mt-0.5">
            {filteredTools.length} {filteredTools.length === 1 ? 'tool' : 'tools'} available
          </p>
        </div>
        <Link
          href="/tools"
          className="inline-flex items-center gap-1 text-sm font-semibold text-[#e5322d] hover:underline"
        >
          View all tools →
        </Link>
      </div>

      {/* Tool Cards Grid */}
      {displayedTools.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {displayedTools.map((tool) => (
            <Link
              key={tool.slug}
              href={`/tools/${tool.slug}`}
              className="group flex flex-col justify-between bg-white dark:bg-[#18181b] border border-[#e4e4e8] dark:border-[#27272a] rounded-xl p-5 min-h-[145px] hover:border-[#e5322d] hover:shadow-md transition-all duration-150"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="shrink-0">{getToolSymbol(tool.slug, tool.category)}</span>
                  <span className="text-[#5b5b63] dark:text-[#a1a1aa] group-hover:text-[#e5322d] group-hover:translate-x-0.5 transition-all">
                    →
                  </span>
                </div>
                <h3 className="text-[17px] font-semibold text-[#18181b] dark:text-white group-hover:text-[#e5322d] transition-colors leading-snug line-clamp-1">
                  {tool.title}
                </h3>
                <p className="mt-1.5 text-sm text-[#5b5b63] dark:text-[#a1a1aa] leading-relaxed line-clamp-2">
                  {tool.displayDescription || tool.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-12 px-4 bg-white dark:bg-[#18181b] border border-[#e4e4e8] dark:border-[#27272a] rounded-xl my-6">
          <p className="text-base font-medium text-[#18181b] dark:text-white">
            No matching tools found.
          </p>
          <p className="mt-1 text-sm text-[#5b5b63] dark:text-[#a1a1aa]">
            Try another search or select a different category.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#e5322d] hover:bg-[#c71f1e] text-white px-4 py-2 text-sm font-semibold transition-colors cursor-pointer"
          >
            <RotateCcw className="h-4 w-4" />
            Reset search & filters
          </button>
        </div>
      )}

      {/* When browsing default 24 tools, show button to see more */}
      {!query.trim() && selectedCategory === 'all' && filteredTools.length > 24 && (
        <div className="text-center mt-8">
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg border border-[#e4e4e8] dark:border-[#27272a] bg-white dark:bg-[#18181b] text-sm font-semibold text-[#18181b] dark:text-white hover:border-[#e5322d] hover:text-[#e5322d] transition-colors shadow-xs"
          >
            Browse all {filteredTools.length} tools →
          </Link>
        </div>
      )}
    </div>
  );
}
