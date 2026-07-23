"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { Menu, X, Search, Sun, Moon, Home } from "lucide-react";
import { useTheme } from "next-themes";
import { Logo } from "@/components/ui/Logo";
import { PremiumButton } from "@/components/ui/PremiumButton";
import { PremiumBadge } from "@/components/ui/PremiumBadge";
import { cn } from "@/lib/utils";
import { getAllTools } from "@/lib/toolRegistry";
import { Tool } from "@/types/tool";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "tools", href: "/tools" },
  { name: "categories", href: "/categories" },
  { name: "guides", href: "/guides" },
  { name: "about", href: "/about" },
];

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Tool[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.length > 1) {
        setIsSearching(true);
        const allTools = getAllTools();
        const results = allTools.filter((tool) => {
          const query = searchQuery.toLowerCase();
          return (
            tool.title.toLowerCase().includes(query) ||
            tool.shortDescription.toLowerCase().includes(query) ||
            tool.description.toLowerCase().includes(query) ||
            tool.keywords.some((keyword) => keyword.toLowerCase().includes(query)) ||
            tool.category.toLowerCase().includes(query)
          );
        });
        setSearchResults(results.slice(0, 10));
      } else {
        setIsSearching(false);
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsSearchOpen(false);
        setSearchQuery("");
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
        setSearchQuery("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
        setTimeout(() => inputRef.current?.focus(), 100);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSearchSelect = (slug: string) => {
    setIsSearchOpen(false);
    setSearchQuery("");
    router.push(`/tools/${slug}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.length > 1) {
      setIsSearchOpen(false);
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl dark:border-slate-700/80 dark:bg-slate-900/80">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />

        <nav className="hidden items-center gap-8 md:flex">
          {navigation.map((item) => {
            const isHome = item.name === "Home";
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-medium transition flex items-center gap-1.5 ${
                  active
                    ? 'text-brand-600 dark:text-brand-400'
                    : 'text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400'
                }`}
              >
                {isHome && <Home className="h-4 w-4" />}
                {isHome ? "Home" : t(`nav.${item.name}`)}
                {active && (
                  <span className="absolute -bottom-[1px] left-0 right-0 h-0.5 bg-brand-600 dark:bg-brand-400 rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden md:block" ref={searchRef}>
            <button
              onClick={() => {
                setIsSearchOpen(!isSearchOpen);
                if (!isSearchOpen) {
                  setTimeout(() => inputRef.current?.focus(), 100);
                }
              }}
              className="flex items-center gap-2 rounded-xl border border-slate-200/80 bg-slate-50/50 px-3.5 py-2 text-sm text-slate-500 transition hover:border-blue-300 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-400 dark:hover:border-blue-500 dark:hover:bg-slate-700"
            >
              <Search className="h-4 w-4" />
              <span className="hidden lg:inline">{t('nav.search')}</span>
              <kbd className="ml-1 rounded bg-slate-200 px-1.5 py-0.5 text-xs text-slate-500 dark:bg-slate-700 dark:text-slate-400">
                ⌘K
              </kbd>
            </button>

            {isSearchOpen && (
              <div className="absolute left-0 right-0 top-full mt-2 max-w-2xl mx-auto bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="p-4">
                  <form onSubmit={handleSearchSubmit}>
                    <div className="flex items-center gap-3 border-b border-slate-100 pb-3 dark:border-slate-700">
                      <Search className="h-5 w-5 text-slate-400" />
                      <input
                        ref={inputRef}
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={t('nav.search')}
                        className="flex-1 bg-transparent outline-none text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                        autoFocus
                      />
                      {searchQuery && (
                        <button
                          type="button"
                          onClick={() => setSearchQuery("")}
                          className="text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                      <PremiumButton type="submit" size="sm">
                        {t('home.searchButton')}
                      </PremiumButton>
                    </div>
                  </form>

                  {isSearching && (
                    <div className="mt-3 max-h-80 overflow-y-auto">
                      {searchResults.length > 0 ? (
                        <div className="space-y-1">
                          {searchResults.map((tool) => (
                            <button
                              key={tool.slug}
                              onClick={() => handleSearchSelect(tool.slug)}
                              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition hover:bg-slate-50 dark:hover:bg-slate-800"
                            >
                              <span className="text-2xl">{tool.icon || "🔧"}</span>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{tool.title}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">{tool.shortDescription}</p>
                              </div>
                              <PremiumBadge variant="gray" size="sm">
                                {tool.category}
                              </PremiumBadge>
                            </button>
                          ))}
                          <button
                            onClick={handleSearchSubmit}
                            className="flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm text-blue-600 hover:bg-blue-50 transition dark:text-blue-400 dark:hover:bg-blue-950/50"
                          >
                            <Search className="h-4 w-4" />
                            {t('search.viewAll') || 'View all results'}
                          </button>
                        </div>
                      ) : searchQuery.length > 1 ? (
                        <div className="py-8 text-center text-slate-500 dark:text-slate-400">
                          <p>{t('search.noResults')}</p>
                          <p className="text-sm mt-1">{t('search.tryAdjusting')}</p>
                        </div>
                      ) : (
                        <div className="py-8 text-center text-slate-400 dark:text-slate-500">
                          <p>Type at least 2 characters to search</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <LanguageSwitcher />

          <button
            onClick={toggleTheme}
            className="rounded-xl p-2 text-slate-600 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            aria-label="Toggle dark mode"
          >
            {mounted ? (
              theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )
            ) : (
              <div className="h-5 w-5" />
            )}
          </button>

          <button
            onClick={() => {
              setIsSearchOpen(!isSearchOpen);
              if (!isSearchOpen) {
                setTimeout(() => inputRef.current?.focus(), 100);
              }
            }}
            className="md:hidden rounded-xl p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            <Search className="h-5 w-5" />
          </button>

          <div className="hidden items-center gap-3 md:flex">
            <PremiumButton variant="ghost" size="sm">
              {t('nav.signIn')}
            </PremiumButton>
            <PremiumButton size="sm">
              {t('nav.getStarted')}
            </PremiumButton>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden rounded-xl p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "fixed inset-x-0 top-16 z-40 bg-white/95 backdrop-blur-xl border-b border-slate-200 transition-all duration-300 md:hidden dark:bg-slate-900/95 dark:border-slate-700",
          isMobileMenuOpen ? "max-h-[calc(100vh-4rem)] opacity-100" : "max-h-0 opacity-0 overflow-hidden"
        )}
      >
        <div className="flex flex-col space-y-1 p-4">
          {navigation.map((item) => {
            const isHome = item.name === "Home";
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`rounded-xl px-4 py-3 text-sm font-medium transition flex items-center gap-2 ${
                  active
                    ? 'bg-brand-50 text-brand-600 dark:bg-brand-950/30 dark:text-brand-400'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-blue-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-blue-400'
                }`}
              >
                {isHome && <Home className="h-4 w-4" />}
                {isHome ? "Home" : t(`nav.${item.name}`)}
                {active && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-brand-600 dark:bg-brand-400" />
                )}
              </Link>
            );
          })}
          <div className="flex flex-col gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
            <PremiumButton variant="ghost" size="sm" className="justify-center">
              {t('nav.signIn')}
            </PremiumButton>
            <PremiumButton size="sm" className="justify-center">
              {t('nav.getStarted')}
            </PremiumButton>
          </div>
        </div>
      </div>

      {/* Mobile Search Overlay */}
      {isSearchOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-white/95 backdrop-blur-xl dark:bg-slate-900/95">
          <div className="p-4">
            <form onSubmit={handleSearchSubmit}>
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3 dark:border-slate-700">
                <Search className="h-5 w-5 text-slate-400" />
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('nav.search')}
                  className="flex-1 bg-transparent outline-none text-slate-800 dark:text-slate-200 placeholder:text-slate-400 text-lg"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => {
                    setIsSearchOpen(false);
                    setSearchQuery("");
                  }}
                  className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </form>
            {searchQuery.length > 1 && (
              <div className="mt-4 max-h-[80vh] overflow-y-auto">
                {searchResults.length > 0 ? (
                  <div className="space-y-2">
                    {searchResults.map((tool) => (
                      <button
                        key={tool.slug}
                        onClick={() => handleSearchSelect(tool.slug)}
                        className="flex w-full items-center gap-3 rounded-xl p-3 text-left transition hover:bg-slate-50 dark:hover:bg-slate-800"
                      >
                        <span className="text-2xl">{tool.icon || "🔧"}</span>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{tool.title}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{tool.shortDescription}</p>
                        </div>
                      </button>
                    ))}
                    <button
                      onClick={handleSearchSubmit}
                      className="flex w-full items-center justify-center gap-2 rounded-xl p-3 text-sm text-blue-600 hover:bg-blue-50 transition dark:text-blue-400 dark:hover:bg-blue-950/50"
                    >
                      <Search className="h-4 w-4" />
                      {t('search.viewAll') || 'View all results'}
                    </button>
                  </div>
                ) : (
                  <div className="py-8 text-center text-slate-500 dark:text-slate-400">
                    <p>{t('search.noResults')}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
