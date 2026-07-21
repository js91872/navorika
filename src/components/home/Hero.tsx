"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight, Star, Users, Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import { getAllTools } from "@/lib/toolRegistry";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Hero() {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

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
    <section className="relative overflow-hidden py-20 lg:py-32">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-blue-950 dark:via-slate-900 dark:to-indigo-950" />
      <div className="absolute top-20 left-1/4 h-64 w-64 rounded-full bg-blue-200 opacity-30 blur-3xl animate-pulse dark:bg-blue-900" />
      <div className="absolute bottom-20 right-1/4 h-96 w-96 rounded-full bg-indigo-200 opacity-20 blur-3xl animate-pulse delay-1000 dark:bg-indigo-900" />

      <Container className="relative">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 ring-1 ring-blue-200 mb-6 dark:bg-blue-950 dark:text-blue-300 dark:ring-blue-800">
            <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse dark:bg-blue-400" />
            {t('home.trusted')}
          </div>

          <h1 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-7xl">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400">
              {t('home.title').split('for')[0]}
            </span>
            <br />
            <span className="text-slate-900 dark:text-slate-100">for the Digital Age</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 sm:text-xl dark:text-slate-400">
            {t('home.subtitle')}
          </p>

          <div className="mx-auto mt-10 max-w-xl" ref={searchRef}>
            <form onSubmit={handleSearch}>
              <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg ring-1 ring-slate-200/50 transition-all focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:ring-slate-700/50">
                <Search className="ml-3 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  placeholder={t('home.searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent px-2 py-3 text-sm outline-none placeholder:text-slate-400 dark:text-slate-200 dark:placeholder:text-slate-500"
                  onFocus={() => searchQuery.length > 1 && setShowSuggestions(true)}
                />
                <Button 
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:from-blue-500 dark:to-blue-600 dark:hover:from-blue-600 dark:hover:to-blue-700"
                >
                  {t('home.searchButton')}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>

              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-2 rounded-2xl bg-white shadow-xl border border-slate-200 overflow-hidden z-20 dark:bg-slate-800 dark:border-slate-700">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left text-slate-700 transition hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700"
                    >
                      <Search className="h-4 w-4 text-slate-400" />
                      <span>{suggestion}</span>
                    </button>
                  ))}
                  <button
                    onClick={() => router.push(`/search?q=${encodeURIComponent(searchQuery)}`)}
                    className="flex w-full items-center justify-center gap-2 border-t border-slate-100 px-4 py-3 text-sm text-blue-600 transition hover:bg-blue-50 dark:border-slate-700 dark:text-blue-400 dark:hover:bg-blue-950"
                  >
                    <Search className="h-4 w-4" />
                    {t('search.viewAll') || 'View all results'} "{searchQuery}"
                  </button>
                </div>
              )}
            </form>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-8 text-sm text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span>{t('home.responseTime')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span>{t('home.activeUsers')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span>{t('home.rating')}</span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
