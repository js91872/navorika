"use client";

import { Suspense } from "react";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Search, ArrowLeft, X } from "lucide-react";
import Link from "next/link";
import { getAllTools } from "@/lib/toolRegistry";
import { ToolCard } from "@/components/ui/ToolCard";
import Container from "@/components/ui/Container";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [searchQuery, setSearchQuery] = useState(query);
  const [results, setResults] = useState([]);

  useEffect(() => {
    try {
      const tools = getAllTools();
      if (query) {
        const filtered = tools.filter((tool: any) =>
          tool.title?.toLowerCase().includes(query.toLowerCase()) ||
          tool.shortDescription?.toLowerCase().includes(query.toLowerCase()) ||
          tool.keywords?.some((k: string) => k.toLowerCase().includes(query.toLowerCase()))
        );
        setResults(filtered);
      } else {
        setResults(tools);
      }
    } catch (error) {
      console.error("Error searching tools:", error);
      setResults([]);
    }
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <Container>
      <div className="py-8 space-y-8">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Search Results</h1>
        </div>

        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for tools..."
            className="w-full pl-12 pr-12 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </form>

        {query && (
          <p className="text-slate-600 dark:text-slate-400">
            Found <strong className="text-slate-900 dark:text-slate-100">{results.length}</strong> results for "<span className="text-slate-900 dark:text-slate-100">{query}</span>"
          </p>
        )}

        {results.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((tool: any) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        ) : query ? (
          <div className="text-center py-12">
            <p className="text-slate-500 dark:text-slate-400">No tools found for "{query}"</p>
            <p className="text-sm text-slate-400 dark:text-slate-500 mt-2">Try a different search term</p>
          </div>
        ) : null}
      </div>
    </Container>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500 dark:text-slate-400">Loading search...</div>}>
      <SearchContent />
    </Suspense>
  );
}
