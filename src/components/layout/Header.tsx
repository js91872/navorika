"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X, Search, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { getAllTools } from "@/lib/toolRegistry";
import { Tool } from "@/types/tool";

const navigation = [
  { name: "Tools", href: "/tools" },
  { name: "Categories", href: "/categories" },
  { name: "Guides", href: "/guides" },
  { name: "About", href: "/about" },
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
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // After mounting, we can safely show the theme toggle
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle search with debounce
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

  // Close search on escape
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

  // Handle click outside
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

  // Handle keyboard shortcut (Cmd+K or Ctrl+K)
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

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-lg dark:border-slate-700 dark:bg-slate-900/80">
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Logo />

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium text-slate-600 transition hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Search & CTA */}
        <div className="flex items-center gap-4">
          {/* Search - Desktop */}
          <div className="hidden md:block" ref={searchRef}>
            <button
              onClick={() => {
                setIsSearchOpen(!isSearchOpen);
                if (!isSearchOpen) {
                  setTimeout(() => inputRef.current?.focus(), 100);
                }
              }}
              className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-500 transition hover:border-blue-300 hover:bg-slate-50 min-w-[200px] dark:border-slate-700 dark:text-slate-400 dark:hover:border-blue-500 dark:hover:bg-slate-800"
            >
              <Search className="h-4 w-4" />
              <span>Search tools...</span>
              <kbd className="ml-auto rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                ⌘K
              </kbd>
            </button>

            {/* Search Dropdown */}
            {isSearchOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden dark:bg-slate-900 dark:border-slate-700">
                <div className="p-4">
                  <form onSubmit={handleSearchSubmit}>
                    <div className="flex items-center gap-3 border-b border-slate-100 pb-3 dark:border-slate-700">
                      <Search className="h-5 w-5 text-slate-400" />
                      <input
                        ref={inputRef}
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search for tools..."
                        className="flex-1 bg-transparent outline-none text-slate-800 placeholder:text-slate-400 dark:text-slate-200 dark:placeholder:text-slate-500"
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
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition"
                      >
                        Search
                      </button>
                    </div>
                  </form>

                  {/* Search Results */}
                  {isSearching && (
                    <div className="mt-3 max-h-80 overflow-y-auto">
                      {searchResults.length > 0 ? (
                        <div className="space-y-1">
                          {searchResults.map((tool) => (
                            <button
                              key={tool.slug}
                              onClick={() => handleSearchSelect(tool.slug)}
                              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition hover:bg-slate-50 dark:hover:bg-slate-800"
                            >
                              <span className="text-2xl">{tool.icon || "🔧"}</span>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                                  {tool.title}
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                  {tool.shortDescription}
                                </p>
                              </div>
                              <span className="text-xs capitalize text-slate-400 bg-slate-100 px-2 py-1 rounded dark:bg-slate-800 dark:text-slate-400">
                                {tool.category}
                              </span>
                            </button>
                          ))}
                          <button
                            onClick={handleSearchSubmit}
                            className="flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 transition dark:text-blue-400 dark:hover:bg-blue-950"
                          >
                            <Search className="h-4 w-4" />
                            View all results for "{searchQuery}"
                          </button>
                        </div>
                      ) : searchQuery.length > 1 ? (
                        <div className="py-8 text-center text-slate-500 dark:text-slate-400">
                          <p>No tools found for "{searchQuery}"</p>
                          <p className="text-sm mt-1">Try different keywords</p>
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

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 transition dark:text-slate-400 dark:hover:bg-slate-800"
            aria-label="Toggle dark mode"
          >
            {mounted ? (
              theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )
            ) : (
              <div className="h-5 w-5" /> // Placeholder while mounting
            )}
          </button>

          {/* Mobile Search Button */}
          <button
            onClick={() => {
              setIsSearchOpen(!isSearchOpen);
              if (!isSearchOpen) {
                setTimeout(() => inputRef.current?.focus(), 100);
              }
            }}
            className="md:hidden p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
          >
            <Search className="h-5 w-5" />
          </button>

          {/* Desktop CTA */}
          <div className="hidden items-center gap-4 md:flex">
            <Button variant="ghost" size="sm" className="dark:text-slate-300 dark:hover:text-white">
              Sign In
            </Button>
            <Button size="sm" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:from-blue-500 dark:to-blue-600 dark:hover:from-blue-600 dark:hover:to-blue-700">
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden dark:text-slate-400 dark:hover:bg-slate-800"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "fixed inset-x-0 top-20 z-40 bg-white/95 backdrop-blur-lg border-b border-slate-200 transition-all duration-300 md:hidden dark:bg-slate-900/95 dark:border-slate-700",
          isMobileMenuOpen ? "max-h-[calc(100vh-5rem)] opacity-100" : "max-h-0 opacity-0 overflow-hidden"
        )}
      >
        <div className="flex flex-col space-y-1 p-4">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="rounded-lg px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-blue-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-blue-400"
            >
              {item.name}
            </Link>
          ))}
          <div className="flex flex-col gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
            <Button variant="ghost" size="sm" className="justify-center dark:text-slate-300">
              Sign In
            </Button>
            <Button size="sm" className="justify-center bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:from-blue-500 dark:to-blue-600">
              Get Started
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Search Overlay */}
      {isSearchOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-white/95 backdrop-blur-sm dark:bg-slate-900/95">
          <div className="p-4">
            <form onSubmit={handleSearchSubmit}>
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3 dark:border-slate-700">
                <Search className="h-5 w-5 text-slate-400" />
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for tools..."
                  className="flex-1 bg-transparent outline-none text-slate-800 placeholder:text-slate-400 text-lg dark:text-slate-200 dark:placeholder:text-slate-500"
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
                        className="flex w-full items-center gap-3 rounded-lg p-3 text-left transition hover:bg-slate-50 dark:hover:bg-slate-800"
                      >
                        <span className="text-2xl">{tool.icon || "🔧"}</span>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                            {tool.title}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {tool.shortDescription}
                          </p>
                        </div>
                      </button>
                    ))}
                    <button
                      onClick={handleSearchSubmit}
                      className="flex w-full items-center justify-center gap-2 rounded-lg p-3 text-sm text-blue-600 hover:bg-blue-50 transition dark:text-blue-400 dark:hover:bg-blue-950"
                    >
                      <Search className="h-4 w-4" />
                      View all results for "{searchQuery}"
                    </button>
                  </div>
                ) : (
                  <div className="py-8 text-center text-slate-500 dark:text-slate-400">
                    <p>No tools found for "{searchQuery}"</p>
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
