"use client";

import { Suspense } from "react";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Search, ArrowLeft, X } from "lucide-react";
import Link from "next/link";
import { getAllTools } from "@/lib/toolRegistry";
import { ToolCard } from "@/components/ui/ToolCard";
import Container from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [searchQuery, setSearchQuery] = useState(query);
  const [results, setResults] = useState([]);
  const [allTools, setAllTools] = useState([]);

  useEffect(() => {
    const tools = getAllTools();
    setAllTools(tools);
    
    if (query) {
      const filtered = tools.filter((tool) =>
        tool.title.toLowerCase().includes(query.toLowerCase()) ||
        tool.shortDescription.toLowerCase().includes(query.toLowerCase()) ||
        tool.keywords?.some((k) => k.toLowerCase().includes(query.toLowerCase()))
      );
      setResults(filtered);
    } else {
      setResults(tools);
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
          <Link href="/" className="text-slate-600 hover:text-slate-900">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Search Results</h1>
        </div>

        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for tools..."
            className="w-full pl-12 pr-12 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </form>

        {query && (
          <p className="text-slate-600">
            Found <strong>{results.length}</strong> results for "{query}"
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>

        {results.length === 0 && query && (
          <div className="text-center py-12">
            <p className="text-slate-500">No tools found for "{query}"</p>
            <p className="text-sm text-slate-400 mt-2">Try a different search term</p>
          </div>
        )}
      </div>
    </Container>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}
