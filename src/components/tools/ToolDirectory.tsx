'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Filter, Grid3x3, Search, X, RotateCcw } from 'lucide-react';
import { searchTools, type SearchableTool } from '@/lib/toolSearch';

export interface ToolDirectoryItem extends SearchableTool {
  categoryName: string;
  displayDescription: string;
  icon: string;
}

export interface ToolDirectoryCategory {
  slug: string;
  name: string;
}

export default function ToolDirectory({
  tools,
  categories,
}: {
  tools: ToolDirectoryItem[];
  categories: ToolDirectoryCategory[];
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredTools = useMemo(() => {
    const bySlug = new Map(tools.map((tool) => [tool.slug, tool]));
    const ranked = searchQuery.trim()
      ? searchTools(searchQuery, tools).flatMap(({ slug }) => {
          const tool = bySlug.get(slug);
          return tool ? [tool] : [];
        })
      : tools;
    return selectedCategory === 'all'
      ? ranked
      : ranked.filter((tool) => tool.category === selectedCategory);
  }, [searchQuery, selectedCategory, tools]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
  };

  return (
    <div className="pb-16 pt-8 text-[#18181b] dark:text-[#f4f4f5]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-[#fff1f1] dark:bg-[#e5322d]/10 p-3 text-[#e5322d]">
              <Grid3x3 className="size-6" aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#18181b] dark:text-white">
                All Tools
              </h1>
              <p className="mt-1 text-sm text-[#5b5b63] dark:text-[#a1a1aa]">
                {filteredTools.length} {filteredTools.length === 1 ? 'tool' : 'tools'} · Search and filter the active directory
              </p>
            </div>
          </div>
        </header>

        {/* Search & Filter Bar */}
        <div className="mb-8 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1 bg-white dark:bg-[#18181b] border border-[#d6d6dc] dark:border-[#27272a] rounded-lg shadow-xs focus-within:border-[#e5322d] focus-within:ring-2 focus-within:ring-[#e5322d]/20 transition-all">
            <Search
              className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#5b5b63] dark:text-[#a1a1aa]"
              aria-hidden="true"
            />
            <label htmlFor="tool-directory-search" className="sr-only">
              Search all tools
            </label>
            <input
              id="tool-directory-search"
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search tools by name, description, or keyword..."
              className="min-h-11 w-full bg-transparent py-2.5 pl-10 pr-10 text-sm text-[#18181b] dark:text-white outline-none placeholder:text-[#5b5b63] dark:placeholder:text-[#a1a1aa]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full text-[#5b5b63] hover:text-[#18181b] dark:hover:text-white"
                aria-label="Clear tool search"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            )}
          </div>

          <div className="relative bg-white dark:bg-[#18181b] border border-[#d6d6dc] dark:border-[#27272a] rounded-lg shadow-xs focus-within:border-[#e5322d] focus-within:ring-2 focus-within:ring-[#e5322d]/20 transition-all">
            <Filter
              className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#5b5b63] dark:text-[#a1a1aa] pointer-events-none"
              aria-hidden="true"
            />
            <label htmlFor="tool-directory-category" className="sr-only">
              Filter by category
            </label>
            <select
              id="tool-directory-category"
              value={selectedCategory}
              onChange={(event) => setSelectedCategory(event.target.value)}
              className="min-h-11 min-w-[200px] appearance-none bg-transparent py-2.5 pl-10 pr-9 text-sm font-semibold text-[#18181b] dark:text-white outline-none cursor-pointer"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category.slug} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[#5b5b63]">
              ▼
            </span>
          </div>
        </div>

        {/* Tool Cards Grid */}
        {filteredTools.length === 0 ? (
          <div className="py-16 text-center bg-white dark:bg-[#18181b] border border-[#e4e4e8] dark:border-[#27272a] rounded-xl my-6 p-8">
            <h2 className="text-lg font-bold text-[#18181b] dark:text-white mb-1">No tools found</h2>
            <p className="text-sm text-[#5b5b63] dark:text-[#a1a1aa] mb-4">
              Try adjusting your search terms or clearing the category filter.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-2 rounded-lg bg-[#e5322d] hover:bg-[#c71f1e] px-4 py-2 text-sm font-semibold text-white shadow-xs transition cursor-pointer"
            >
              <RotateCcw className="h-4 w-4" />
              Reset filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTools.map((tool) => (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className="group flex flex-col justify-between rounded-xl border border-[#e4e4e8] dark:border-[#27272a] bg-white dark:bg-[#18181b] p-5 transition-all duration-150 hover:border-[#e5322d] hover:shadow-md min-h-[145px]"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span
                      className="grid size-10 place-items-center rounded-lg bg-[#fff1f1] dark:bg-[#e5322d]/10 text-xl text-[#e5322d]"
                      aria-hidden="true"
                    >
                      {tool.icon}
                    </span>
                    <span className="text-[#5b5b63] dark:text-[#a1a1aa] group-hover:text-[#e5322d] group-hover:translate-x-0.5 transition-all">
                      →
                    </span>
                  </div>
                  <h2 className="text-[17px] font-semibold text-[#18181b] dark:text-white transition-colors group-hover:text-[#e5322d] line-clamp-2">
                    {tool.title}
                  </h2>
                  <p className="mt-1.5 line-clamp-3 text-sm leading-relaxed text-[#5b5b63] dark:text-[#a1a1aa]">
                    {tool.displayDescription}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#e4e4e8] dark:border-[#27272a]/60">
                  <span className="inline-block rounded-md bg-[#f0f0f2] dark:bg-[#202023] px-2.5 py-0.5 text-[11px] font-medium text-[#5b5b63] dark:text-[#a1a1aa]">
                    {tool.categoryName}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
