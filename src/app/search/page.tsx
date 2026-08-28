'use client';

import { useMemo, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Search, X } from 'lucide-react';
import { categories, tools, type RegisteredTool } from '@/data/registry';
import { getClusterForTool, getToolkitsForTool } from '@/data/taxonomy';
import { toolsUnderReview } from '@/lib/seo/toolReview';

function SearchResults() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(query);
  const results: RegisteredTool[] = useMemo(() => {
    if (!query) return [];
    const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
    return tools.filter((tool) => {
      if (toolsUnderReview.has(tool.slug)) return false;
      const category = categories.find((item) => item.slug === tool.category);
      const cluster = getClusterForTool(tool.slug);
      const toolkitTerms = getToolkitsForTool(tool.slug).flatMap((toolkit) => [toolkit.name, toolkit.description]);
      const searchText = [tool.title, tool.description, category?.name, category?.description, cluster?.name, cluster?.description, ...tool.keywords, ...toolkitTerms].filter(Boolean).join(' ').toLowerCase();
      return terms.every((term) => searchText.includes(term));
    });
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    router.push('/');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </Link>

      <form onSubmit={handleSearch} className="relative mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--muted-foreground)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for tools..."
            className="w-full px-12 py-4 rounded-2xl bg-[var(--card)] border-2 border-[var(--border)] focus:border-indigo-500 outline-none transition-all text-lg"
            autoFocus
          />
          {searchQuery && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-24 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-[var(--muted)] transition-colors"
            >
              <X className="h-5 w-5 text-[var(--muted-foreground)]" />
            </button>
          )}
        </div>
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium text-sm hover:shadow-lg transition-all"
        >
          Search
        </button>
      </form>

      {query && (
        <div>
          <p className="text-sm text-[var(--muted-foreground)] mb-4">
            Found {results.length} result{results.length !== 1 ? 's' : ''} for &ldquo;{query}&rdquo;
          </p>

          {results.length === 0 ? (
            <div className="text-center py-12">
              <Search className="h-16 w-16 text-[var(--muted-foreground)] mx-auto mb-4 opacity-30" />
              <h3 className="text-xl font-bold mb-2">No results found</h3>
              <p className="text-[var(--muted-foreground)]">
                Try adjusting your search terms or browse our categories
              </p>
              <Link
                href="/tools"
                className="inline-block mt-4 px-6 py-2 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20 transition-colors"
              >
                Browse all tools
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {results.map((tool) => (
                <Link
                  key={tool.slug}
                  href={`/tools/${tool.slug}`}
                  className="block p-4 rounded-xl bg-[var(--card)] border border-[var(--border)] hover:border-indigo-500/50 hover:shadow-lg transition-all hover:-translate-y-0.5"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-lg group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {tool.title}
                      </h3>
                      <p className="text-sm text-[var(--muted-foreground)] mt-1">{tool.description}</p>
                      <span className="inline-block mt-2 text-xs font-medium px-2 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                        {tool.category.replace('-', ' ').replace('calculators', '').replace('tools', '').trim() || tool.category}
                      </span>
                    </div>
                    <span className="text-[var(--muted-foreground)] text-sm ml-4">→</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {!query && (
        <div className="mt-8">
          <h3 className="text-lg font-bold mb-4">Popular Categories</h3>
          <div className="flex flex-wrap gap-3">
            {['pdf-tools', 'image-tools', 'finance-calculators', 'health-calculators', 'developer-tools', 'construction-calculators'].map((cat) => (
              <Link
                key={cat}
                href={`/categories/${cat}`}
                className="px-4 py-2 rounded-full bg-[var(--card)] border border-[var(--border)] hover:border-indigo-500/50 hover:bg-[var(--muted)] transition-all text-sm"
              >
                {cat.replace('-', ' ').replace('calculators', 'Calc').replace('tools', 'Tools')}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pt-24 pb-16">
      <Suspense fallback={<div className="text-center py-12">Loading...</div>}>
        <SearchResults />
      </Suspense>
    </main>
  );
}
