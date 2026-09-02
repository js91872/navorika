'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Filter, Grid3x3, Search, X } from 'lucide-react';
import { searchTools, type SearchableTool } from '@/lib/toolSearch';

export interface ToolDirectoryItem extends SearchableTool {
  categoryName: string;
  displayDescription: string;
  icon: string;
}

export interface ToolDirectoryCategory { slug: string; name: string }

const colorMap: Record<string, string> = {
  'pdf-tools': 'hover:border-blue-500/50', 'image-tools': 'hover:border-purple-500/50',
  'finance-calculators': 'hover:border-emerald-500/50', 'health-calculators': 'hover:border-rose-500/50',
  'developer-tools': 'hover:border-amber-500/50', 'construction-calculators': 'hover:border-teal-500/50',
};

const categoryBadgeColors: Record<string, string> = {
  'pdf-tools': 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  'image-tools': 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
  'finance-calculators': 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  'health-calculators': 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
  'developer-tools': 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  'construction-calculators': 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20',
};

export default function ToolDirectory({ tools, categories }: { tools: ToolDirectoryItem[]; categories: ToolDirectoryCategory[] }) {
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
    return selectedCategory === 'all' ? ranked : ranked.filter((tool) => tool.category === selectedCategory);
  }, [searchQuery, selectedCategory, tools]);

  return <div className="min-h-screen bg-[var(--background)] pb-16 pt-24 text-[var(--foreground)]"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <header className="mb-10"><div className="flex items-center gap-3"><div className="rounded-2xl bg-indigo-500/10 p-3 text-indigo-600 dark:text-indigo-400"><Grid3x3 className="size-8" aria-hidden="true" /></div><div><h1 className="text-4xl font-black tracking-tight">All Tools</h1><p className="mt-1 text-[var(--muted-foreground)]">{filteredTools.length} tools · Search and filter the active directory</p></div></div></header>
    <div className="mb-10 flex flex-col gap-4 sm:flex-row"><div className="relative flex-1"><Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[var(--muted-foreground)]" aria-hidden="true" /><label htmlFor="tool-directory-search" className="sr-only">Search all tools</label><input id="tool-directory-search" type="search" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search tools by name or description..." className="min-h-12 w-full rounded-2xl border-2 border-[var(--border)] bg-[var(--card)] py-3.5 pl-12 pr-12 text-[var(--foreground)] shadow-sm outline-none transition focus:border-indigo-500" />{searchQuery && <button type="button" onClick={() => setSearchQuery('')} className="absolute right-1 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full text-[var(--muted-foreground)] hover:text-[var(--foreground)]" aria-label="Clear tool search"><X className="size-5" aria-hidden="true" /></button>}</div><div className="relative"><Filter className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[var(--muted-foreground)]" aria-hidden="true" /><label htmlFor="tool-directory-category" className="sr-only">Filter by category</label><select id="tool-directory-category" value={selectedCategory} onChange={(event) => setSelectedCategory(event.target.value)} className="min-h-12 min-w-[180px] appearance-none rounded-2xl border-2 border-[var(--border)] bg-[var(--card)] py-3.5 pl-11 pr-8 text-[var(--foreground)] shadow-sm outline-none transition focus:border-indigo-500"><option value="all">All Categories</option>{categories.map((category) => <option key={category.slug} value={category.slug}>{category.name}</option>)}</select></div></div>
    {filteredTools.length === 0 ? <div className="py-20 text-center text-[var(--muted-foreground)]"><div className="mb-4 text-6xl" aria-hidden="true">🔍</div><h2 className="mb-2 text-xl font-semibold">No tools found</h2><p className="text-sm">Try adjusting your search or filter.</p></div> : <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{filteredTools.map((tool) => <Link key={tool.slug} href={`/tools/${tool.slug}`} className={`group relative block overflow-hidden rounded-2xl border-2 border-[var(--border)] bg-[var(--card)] p-5 transition duration-300 hover:-translate-y-1 hover:shadow-xl ${colorMap[tool.category] ?? 'hover:border-indigo-500/50'}`}><div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 transition-opacity group-hover:opacity-100" /><div className="relative z-10"><div className="flex items-start gap-4"><span className="block rounded-xl bg-indigo-500/10 p-2.5 text-xl transition-transform group-hover:scale-110" aria-hidden="true">{tool.icon}</span><div className="min-w-0 flex-1"><h2 className="line-clamp-1 font-semibold transition-colors group-hover:text-indigo-600 dark:group-hover:text-indigo-400">{tool.title}</h2><p className="mt-1 line-clamp-2 text-sm leading-relaxed text-[var(--muted-foreground)]">{tool.displayDescription}</p></div></div><div className="mt-4 flex items-center justify-between border-t border-[var(--border)] pt-3"><span className={`rounded-full border px-2.5 py-1 text-[10px] font-medium ${categoryBadgeColors[tool.category] ?? 'bg-slate-500/10 text-slate-600 dark:text-slate-400'}`}>{tool.categoryName}</span><span className="rounded-full bg-[var(--muted)] p-1 transition-colors group-hover:bg-indigo-500/10"><ArrowRight className="size-3.5 text-[var(--muted-foreground)] transition group-hover:translate-x-0.5 group-hover:text-indigo-500" aria-hidden="true" /></span></div></div></Link>)}</div>}
  </div></div>;
}
