"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Search, ArrowLeft, X } from "lucide-react";
import { getAllTools } from "@/lib/toolRegistry";
import { Tool } from "@/types/tool";
import Container from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") || "";
  const [searchQuery, setSearchQuery] = useState(query);
  const [results, setResults] = useState<Tool[]>([]);
  const [allTools, setAllTools] = useState<Tool[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const tools = getAllTools();
    setAllTools(tools);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (searchQuery.length > 1) {
      const filtered = allTools.filter((tool) => {
        const q = searchQuery.toLowerCase();
        return (
          tool.title.toLowerCase().includes(q) ||
          tool.shortDescription.toLowerCase().includes(q) ||
          tool.description.toLowerCase().includes(q) ||
          tool.keywords.some((keyword) => keyword.toLowerCase().includes(q)) ||
          tool.category.toLowerCase().includes(q)
        );
      });
      setResults(filtered);
      
      // Update URL
      const params = new URLSearchParams();
      params.set("q", searchQuery);
      router.replace(`/search?${params.toString()}`);
    } else {
      setResults([]);
    }
  }, [searchQuery, allTools, router]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is already handled by useEffect
  };

  const clearSearch = () => {
    setSearchQuery("");
    router.push("/search");
  };

  if (isLoading) {
    return (
      <Container>
        <div className="flex items-center justify-center py-20">
          <div className="text-slate-400">Loading...</div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="py-12">
        {/* Back button */}
        <Link
          href="/tools"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 transition mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Tools
        </Link>

        <h1 className="text-3xl font-bold text-slate-900 mb-8">Search Results</h1>

        {/* Search input */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for tools..."
              className="w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-12 py-4 text-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              autoFocus
            />
            {searchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
          <p className="text-sm text-slate-500 mt-2">
            {searchQuery.length > 1 ? (
              <>Found {results.length} result{results.length !== 1 ? 's' : ''} for "{searchQuery}"</>
            ) : (
              <>Type at least 2 characters to search</>
            )}
          </p>
        </form>

        {/* Results */}
        {searchQuery.length > 1 && (
          <div className="space-y-4">
            {results.length > 0 ? (
              results.map((tool) => (
                <Link
                  key={tool.slug}
                  href={`/tools/${tool.slug}`}
                  className="block rounded-2xl border border-slate-200 bg-white p-6 transition hover:shadow-lg hover:border-blue-200"
                >
                  <div className="flex items-start gap-4">
                    <span className="text-3xl">{tool.icon || "🔧"}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h2 className="text-xl font-semibold text-slate-900">{tool.title}</h2>
                        <span className="text-xs capitalize bg-slate-100 text-slate-600 px-2 py-1 rounded">
                          {tool.category}
                        </span>
                      </div>
                      <p className="text-slate-600">{tool.shortDescription}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {tool.keywords.slice(0, 4).map((keyword) => (
                          <span
                            key={keyword}
                            className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="flex-shrink-0">
                      View Tool →
                    </Button>
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center py-12">
                <Search className="h-16 w-16 mx-auto text-slate-300 mb-4" />
                <h3 className="text-lg font-medium text-slate-800">No tools found</h3>
                <p className="text-slate-500 mt-1">
                  Try adjusting your search terms or browse our <Link href="/tools" className="text-blue-600 hover:underline">all tools</Link>
                </p>
              </div>
            )}
          </div>
        )}

        {/* Suggestions when no search */}
        {!searchQuery && (
          <div className="text-center py-12">
            <Search className="h-16 w-16 mx-auto text-slate-300 mb-4" />
            <h3 className="text-lg font-medium text-slate-800">Start searching</h3>
            <p className="text-slate-500 mt-1">
              Search for any tool by name, category, or keyword
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {["calculator", "converter", "generator", "PDF", "image", "health", "finance"].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setSearchQuery(suggestion)}
                  className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm hover:bg-blue-100 hover:text-blue-600 transition"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </Container>
  );
}
