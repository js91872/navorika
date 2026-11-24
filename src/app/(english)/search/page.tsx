'use client';

import { useMemo, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Search, X } from 'lucide-react';
import { toolSearchIndex } from '@/data/toolSearchIndex';
import { searchTools } from '@/lib/toolSearch';

function SearchResults() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(query);
  const results = useMemo(() => searchTools(query, toolSearchIndex), [query]);

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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-[#18181b] dark:text-[#f4f4f5]">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#5b5b63] dark:text-[#a1a1aa] hover:text-[#e5322d] transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </Link>

      <form onSubmit={handleSearch} className="relative mb-8">
        <div className="flex w-full bg-white dark:bg-[#18181b] border border-[#d6d6dc] dark:border-[#27272a] rounded-lg overflow-hidden shadow-xs focus-within:border-[#e5322d] focus-within:ring-2 focus-within:ring-[#e5322d]/20 transition-all">
          <div className="relative flex-1 flex items-center min-w-0">
            <Search className="absolute left-4 h-5 w-5 text-[#5b5b63] dark:text-[#a1a1aa] pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tools — e.g. PDF, image, BMI, concrete"
              className="w-full min-w-0 py-3.5 pl-12 pr-10 bg-transparent border-0 outline-none text-base text-[#18181b] dark:text-white placeholder:text-[#5b5b63]"
              autoFocus
            />
            {searchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3 p-1 rounded-full text-[#5b5b63] hover:text-[#18181b] dark:hover:text-white"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <button
            type="submit"
            className="bg-[#e5322d] hover:bg-[#c71f1e] text-white font-semibold px-6 text-sm transition-colors cursor-pointer shrink-0"
          >
            Search
          </button>
        </div>
      </form>

      {query && (
        <div>
          <p className="text-sm text-[#5b5b63] dark:text-[#a1a1aa] mb-4">
            Found {results.length} result{results.length !== 1 ? 's' : ''} for &ldquo;{query}&rdquo;
          </p>

          {results.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-[#18181b] border border-[#e4e4e8] dark:border-[#27272a] rounded-xl p-8">
              <Search className="h-12 w-12 text-[#5b5b63] dark:text-[#a1a1aa] mx-auto mb-3 opacity-30" />
              <h3 className="text-lg font-bold text-[#18181b] dark:text-white mb-1">No results found</h3>
              <p className="text-sm text-[#5b5b63] dark:text-[#a1a1aa] mb-4">
                Try adjusting your search terms or browse all categories.
              </p>
              <Link
                href="/tools"
                className="inline-block px-5 py-2 rounded-lg bg-[#e5322d] hover:bg-[#c71f1e] text-white text-sm font-semibold transition-colors"
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
                  className="group block p-4 rounded-xl bg-white dark:bg-[#18181b] border border-[#e4e4e8] dark:border-[#27272a] hover:border-[#e5322d] hover:shadow-xs transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-base text-[#18181b] dark:text-white group-hover:text-[#e5322d] transition-colors">
                        {tool.title}
                      </h3>
                      <p className="text-xs text-[#5b5b63] dark:text-[#a1a1aa] mt-1 line-clamp-2">{tool.description}</p>
                      <span className="inline-block mt-2 text-[11px] font-medium px-2 py-0.5 rounded-md bg-[#f0f0f2] dark:bg-[#202023] text-[#5b5b63] dark:text-[#a1a1aa]">
                        {tool.categoryName || tool.category.replaceAll('-', ' ')}
                      </span>
                    </div>
                    <span className="text-[#5b5b63] dark:text-[#a1a1aa] group-hover:text-[#e5322d] text-sm ml-4">→</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {!query && (
        <div className="mt-8">
          <h3 className="text-base font-bold text-[#18181b] dark:text-white mb-3">Popular Categories</h3>
          <div className="flex flex-wrap gap-2">
            {[
              { slug: 'pdf-tools', name: 'PDF Tools' },
              { slug: 'image-tools', name: 'Image Tools' },
              { slug: 'finance-calculators', name: 'Finance' },
              { slug: 'health-calculators', name: 'Health' },
              { slug: 'developer-tools', name: 'Developer' },
              { slug: 'construction-calculators', name: 'Construction' },
              { slug: 'everyday-calculators', name: 'Everyday' },
            ].map((cat) => (
              <Link
                key={cat.slug}
                href={`/categories/${cat.slug}`}
                className="px-3.5 py-1.5 rounded-lg border border-[#e4e4e8] dark:border-[#27272a] bg-white dark:bg-[#18181b] text-xs font-semibold text-[#5b5b63] dark:text-[#a1a1aa] hover:border-[#e5322d] hover:text-[#e5322d] transition-colors"
              >
                {cat.name}
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
    <Suspense fallback={<div className="p-8 text-center text-sm text-[#5b5b63]">Loading search...</div>}>
      <SearchResults />
    </Suspense>
  );
}
