"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight, Zap, Users, Star, CheckCircle, Shield } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import { getAllTools } from "@/lib/toolRegistry";

export default function Hero() {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchQuery.length > 1) {
      const allTools = getAllTools();
      const matches = allTools
        .filter((tool) => {
          const query = searchQuery.toLowerCase();
          return (
            tool.title.toLowerCase().includes(query) ||
            tool.shortDescription.toLowerCase().includes(query) ||
            tool.category.toLowerCase().includes(query)
          );
        })
        .slice(0, 5)
        .map((tool) => tool.title);
      setSuggestions(matches);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    router.push(`/search?q=${encodeURIComponent(suggestion)}`);
  };

  return (
    <section className="relative overflow-hidden py-16 sm:py-20 lg:py-28 bg-gradient-to-br from-brand-50 via-white to-accent-50 dark:from-slate-950 dark:via-slate-900 dark:to-brand-950/30">
      <div className="absolute top-0 right-0 h-[600px] w-[600px] rounded-full bg-brand-400/5 blur-3xl" />
      <div className="absolute bottom-0 left-0 h-[600px] w-[600px] rounded-full bg-accent-400/5 blur-3xl" />
      
      <Container className="relative">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-50/80 px-4 py-2 text-sm font-medium text-brand-700 ring-1 ring-brand-200/50 backdrop-blur-sm dark:bg-brand-950/50 dark:text-brand-300 dark:ring-brand-800/50 mb-6">
            <Zap className="h-4 w-4" />
            Smart. Simple. Reliable.
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-5xl lg:text-6xl">
            All the Tools You Need,
            <br />
            <span className="text-gradient">All in One Place.</span>
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
            Free online tools and calculators to make your life easier.
            <br />
            Smart. Simple. Reliable.
          </p>

          <div className="mx-auto mt-8 max-w-xl" ref={searchRef}>
            <form onSubmit={handleSearch}>
              <div className="relative">
                <div className="flex items-center gap-0 rounded-2xl bg-white dark:bg-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-slate-800/50 ring-1 ring-slate-200/50 dark:ring-slate-700/50 transition-all focus-within:ring-2 focus-within:ring-brand-500/50">
                  <Search className="ml-4 h-5 w-5 text-slate-400 dark:text-slate-500 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Search calculators, tools and converters..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 bg-transparent px-3 py-3.5 text-sm outline-none placeholder:text-slate-400 dark:text-slate-200 dark:placeholder:text-slate-500"
                    onFocus={() => searchQuery.length > 1 && setShowSuggestions(true)}
                  />
                  <Button 
                    type="submit"
                    className="mr-1.5 rounded-xl bg-gradient-to-r from-brand-600 to-accent-600 hover:from-brand-700 hover:to-accent-700"
                  >
                    Search
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>

                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute left-0 right-0 top-full mt-2 rounded-2xl bg-white dark:bg-slate-800 shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden z-20">
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="flex w-full items-center gap-3 px-4 py-3 text-left text-slate-700 dark:text-slate-300 transition hover:bg-brand-50 dark:hover:bg-brand-950/30"
                      >
                        <Search className="h-4 w-4 text-slate-400" />
                        <span>{suggestion}</span>
                      </button>
                    ))}
                    <button
                      onClick={() => router.push(`/search?q=${encodeURIComponent(searchQuery)}`)}
                      className="flex w-full items-center justify-center gap-2 border-t border-slate-100 dark:border-slate-700 px-4 py-3 text-sm text-brand-600 dark:text-brand-400 transition hover:bg-brand-50 dark:hover:bg-brand-950/30"
                    >
                      <Search className="h-4 w-4" />
                      View all results for "{searchQuery}"
                    </button>
                  </div>
                )}
              </div>
            </form>
          </div>

          {/* Trust Indicators */}
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="flex flex-col items-center gap-1">
              <div className="rounded-full bg-success-50 p-2 dark:bg-success-950/30">
                <CheckCircle className="h-5 w-5 text-success-600 dark:text-success-400" />
              </div>
              <span className="text-sm font-medium text-slate-900 dark:text-slate-100">100% Free</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">Always free to use</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="rounded-full bg-brand-50 p-2 dark:bg-brand-950/30">
                <Zap className="h-5 w-5 text-brand-600 dark:text-brand-400" />
              </div>
              <span className="text-sm font-medium text-slate-900 dark:text-slate-100">No Sign Up</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">Instant results</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="rounded-full bg-warning-50 p-2 dark:bg-warning-950/30">
                <Shield className="h-5 w-5 text-warning-600 dark:text-warning-400" />
              </div>
              <span className="text-sm font-medium text-slate-900 dark:text-slate-100">Accurate Results</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">You can rely on</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="rounded-full bg-accent-50 p-2 dark:bg-accent-950/30">
                <Shield className="h-5 w-5 text-accent-600 dark:text-accent-400" />
              </div>
              <span className="text-sm font-medium text-slate-900 dark:text-slate-100">Privacy First</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">Your data is safe</span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
