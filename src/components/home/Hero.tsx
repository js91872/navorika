"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight, Star, Users, Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import { getAllTools } from "@/lib/toolRegistry";

export default function Hero() {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);

  // Get search suggestions
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

  // Handle click outside
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
    <section className="relative overflow-hidden py-20 lg:py-32">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50" />
      
      {/* Animated Blobs */}
      <div className="absolute top-20 left-1/4 h-64 w-64 rounded-full bg-blue-200 opacity-30 blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-1/4 h-96 w-96 rounded-full bg-indigo-200 opacity-20 blur-3xl animate-pulse delay-1000" />

      <Container className="relative">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 ring-1 ring-blue-200 mb-6">
            <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
            Trusted by 50,000+ users
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-7xl">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Your Smart Toolkit
            </span>
            <br />
            <span className="text-slate-900">for the Digital Age</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 sm:text-xl">
            Free online calculators, PDF tools, image utilities, and more — 
            beautifully designed, lightning fast, and always free.
          </p>

          {/* Search Bar */}
          <div className="mx-auto mt-10 max-w-xl" ref={searchRef}>
            <form onSubmit={handleSearch}>
              <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg ring-1 ring-slate-200/50 transition-all focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20">
                <Search className="ml-3 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search tools... (e.g., PDF, EMI, Inflation)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent px-2 py-3 text-sm outline-none placeholder:text-slate-400"
                  onFocus={() => searchQuery.length > 1 && setShowSuggestions(true)}
                />
                <Button 
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                >
                  Search
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>

              {/* Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-2 rounded-2xl bg-white shadow-xl border border-slate-200 overflow-hidden z-20">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left text-slate-700 transition hover:bg-slate-50"
                    >
                      <Search className="h-4 w-4 text-slate-400" />
                      <span>{suggestion}</span>
                    </button>
                  ))}
                  <button
                    onClick={() => router.push(`/search?q=${encodeURIComponent(searchQuery)}`)}
                    className="flex w-full items-center justify-center gap-2 border-t border-slate-100 px-4 py-3 text-sm text-blue-600 transition hover:bg-blue-50"
                  >
                    <Search className="h-4 w-4" />
                    View all results for "{searchQuery}"
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Trust Indicators */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-8 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-blue-600" />
              <span><strong>1s</strong> average response</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-600" />
              <span><strong>50K+</strong> active users</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-blue-600" />
              <span><strong>4.9/5</strong> user rating</span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
