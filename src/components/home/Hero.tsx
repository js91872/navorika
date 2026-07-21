"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight, Zap, Users, Star, Sparkles, Shield, Clock } from "lucide-react";
import { PremiumButton } from "@/components/ui/PremiumButton";
import { PremiumBadge } from "@/components/ui/PremiumBadge";
import { PremiumGradient } from "@/components/ui/PremiumGradient";
import { PremiumHeading } from "@/components/ui/PremiumHeading";
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
    <PremiumGradient variant="hero" className="py-20 sm:py-28 lg:py-36">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="flex justify-center mb-6">
          <PremiumBadge variant="blue" size="md" icon={<Zap className="h-3.5 w-3.5" />}>
            {t('home.trusted')}
          </PremiumBadge>
        </div>

        <PremiumHeading level="h1" gradient className="mb-6">
          {t('home.title')}
        </PremiumHeading>

        <p className="mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-300 mb-10">
          {t('home.subtitle')}
        </p>

        {/* Search Bar */}
        <div className="mx-auto max-w-xl" ref={searchRef}>
          <form onSubmit={handleSearch}>
            <div className="relative">
              <div className="flex items-center gap-0 rounded-2xl bg-white dark:bg-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-slate-800/50 ring-1 ring-slate-200/50 dark:ring-slate-700/50 transition-all focus-within:ring-2 focus-within:ring-blue-500/50">
                <Search className="ml-4 h-5 w-5 text-slate-400 dark:text-slate-500 flex-shrink-0" />
                <input
                  type="text"
                  placeholder={t('home.searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent px-3 py-3.5 text-sm outline-none placeholder:text-slate-400 dark:text-slate-200 dark:placeholder:text-slate-500"
                  onFocus={() => searchQuery.length > 1 && setShowSuggestions(true)}
                />
                <PremiumButton 
                  type="submit"
                  size="md"
                  icon={<ArrowRight className="h-4 w-4" />}
                  iconPosition="right"
                  className="mr-1.5 rounded-xl"
                >
                  {t('home.searchButton')}
                </PremiumButton>
              </div>

              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-2 rounded-2xl bg-white dark:bg-slate-800 shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden z-20">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left text-slate-700 dark:text-slate-300 transition hover:bg-slate-50 dark:hover:bg-slate-700"
                    >
                      <Search className="h-4 w-4 text-slate-400" />
                      <span>{suggestion}</span>
                    </button>
                  ))}
                  <button
                    onClick={() => router.push(`/search?q=${encodeURIComponent(searchQuery)}`)}
                    className="flex w-full items-center justify-center gap-2 border-t border-slate-100 dark:border-slate-700 px-4 py-3 text-sm text-blue-600 dark:text-blue-400 transition hover:bg-blue-50 dark:hover:bg-blue-950/50"
                  >
                    <Search className="h-4 w-4" />
                    {t('search.viewAll') || 'View all results'} "{searchQuery}"
                  </button>
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Trust Indicators */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-8 text-sm text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-2.5">
            <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-2">
              <Zap className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <span>{t('home.responseTime')}</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="rounded-full bg-emerald-100 dark:bg-emerald-900/30 p-2">
              <Users className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <span>{t('home.activeUsers')}</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="rounded-full bg-amber-100 dark:bg-amber-900/30 p-2">
              <Star className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
            <span>{t('home.rating')}</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="rounded-full bg-purple-100 dark:bg-purple-900/30 p-2">
              <Shield className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
            <span>Privacy First</span>
          </div>
        </div>
      </div>
    </PremiumGradient>
  );
}
