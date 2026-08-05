'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Zap, Shield, Sparkles, Layers } from 'lucide-react';
import { categories, tools } from '@/data/registry';
import { getToolIcon } from '@/lib/toolIcons';
import SearchOverlay from '@/components/SearchOverlay';

const iconMap: Record<string, string> = {
  FileText: '📄',
  Image: '🖼️',
  Calculator: '📊',
  HeartPulse: '❤️',
  Code: '⚡',
  PiggyBank: '💰',
  Globe: '🌍',
  Hammer: '🔨',
};

export default function HomePage() {
  const [searchOpen, setSearchOpen] = useState(false);
  const featuredTools = tools.slice(0, 12);

  return (
    <>
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      
      <div className="bg-[var(--background)] text-[var(--foreground)]">
        
        {/* ====== HERO SECTION – Premium ====== */}
        <section className="relative overflow-hidden px-4 pt-24 pb-16 md:pt-32 md:pb-24">
          {/* Background glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-500/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-[600px] h-[300px] bg-purple-500/5 rounded-full blur-3xl" />
          </div>

          <div className="max-w-4xl mx-auto text-center relative z-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-400"></span>
              </span>
              Zero-latency · Local processing
            </div>
            
            {/* Main Heading with Gradient */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.1] mb-4">
              200+ Free Online Calculators, PDF Tools, Image Tools &amp; Productivity Utilities
            </h1>
            
            {/* Subtitle */}
            <p className="text-2xl font-bold mb-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Fast. Free. No Signup.
            </p>
            
            {/* Description */}
            <p className="text-lg text-[var(--muted-foreground)] max-w-2xl mx-auto leading-relaxed mb-8">
              Navorika is a free, client-side suite of 200+ online tools including calculators,
              PDF editors, image converters, and developer utilities. Everything runs locally
              in your browser — no uploads, no signup, no tracking.
            </p>

            {/* Search */}
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-3 max-w-lg mx-auto w-full p-3 rounded-full bg-[var(--card)] border border-[var(--border)] hover:border-indigo-400/50 transition-all text-left shadow-lg hover:shadow-indigo-500/10"
            >
              <span className="pl-2 text-[var(--muted-foreground)]">🔍</span>
              <span className="flex-1 text-[var(--muted-foreground)]">Search 200+ tools...</span>
              <kbd className="px-2 py-1 rounded bg-[var(--muted)] text-[var(--muted-foreground)] text-xs font-mono">⌘K</kbd>
            </button>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-sm text-[var(--muted-foreground)]">
              <span className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-indigo-500" /> 100% client-side
              </span>
              <span className="w-px h-4 bg-[var(--border)]" />
              <span className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-emerald-500" /> No data uploaded
              </span>
              <span className="w-px h-4 bg-[var(--border)]" />
              <span className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-500" /> {tools.length}+ tools
              </span>
              <span className="w-px h-4 bg-[var(--border)]" />
              <span className="flex items-center gap-2">🔒 No signup required</span>
            </div>
          </div>
        </section>

        {/* ====== CATEGORIES SECTION – Premium Cards ====== */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold">
                Tool Categories
                <span className="text-[var(--muted-foreground)] font-normal ml-2">
                  — {categories.length} suites
                </span>
              </h2>
              <p className="text-[var(--muted-foreground)] text-sm mt-1">
                Explore our comprehensive collection of free online tools
              </p>
            </div>
            <Link
              href="/categories"
              className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {categories.map((category) => {
              const toolCount = tools.filter(t => t.category === category.slug).length;
              const icon = iconMap[category.icon] || '📁';
              return (
                <Link
                  key={category.slug}
                  href={`/categories/${category.slug}`}
                  className="group p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] hover:border-indigo-500/50 transition-all hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1 duration-300"
                >
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">{icon}</div>
                  <h3 className="font-bold text-lg group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-[var(--muted-foreground)] mt-1 line-clamp-2">
                    {category.description}
                  </p>
                  <div className="mt-4 pt-4 border-t border-[var(--border)] flex items-center justify-between text-xs text-[var(--muted-foreground)]">
                    <span className="font-medium">{toolCount} tools</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* ====== POPULAR TOOLS – Premium Cards ====== */}
        <section className="bg-[var(--muted)]/30 border-y border-[var(--border)] py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold">
                  Popular Free Tools
                  <span className="text-[var(--muted-foreground)] font-normal ml-2">
                    — most used
                  </span>
                </h2>
                <p className="text-[var(--muted-foreground)] text-sm mt-1">
                  Jump straight into our most popular online utilities
                </p>
              </div>
              <Link
                href="/tools"
                className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {featuredTools.map((tool) => (
                <Link
                  key={tool.slug}
                  href={`/tools/${tool.slug}`}
                  className="group p-4 rounded-xl bg-[var(--card)] border border-[var(--border)] hover:border-indigo-500/40 transition-all hover:shadow-lg hover:shadow-indigo-500/5 hover:-translate-y-1 duration-300"
                >
                  <div className="flex items-start justify-between">
                    <span className="text-3xl group-hover:scale-110 transition-transform duration-300">
                      {getToolIcon(tool.slug)}
                    </span>
                    <span className="text-[10px] font-medium uppercase tracking-wider text-[var(--muted-foreground)] bg-[var(--muted)] px-2.5 py-1 rounded-full">
                      {tool.category.split('-')[0]}
                    </span>
                  </div>
                  <h3 className="font-semibold mt-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-sm text-[var(--muted-foreground)] mt-1 line-clamp-2">
                    {tool.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ====== CTA SECTION ====== */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-8 sm:p-12 text-center">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-10" />
            
            <div className="relative z-10">
              <Layers className="h-12 w-12 text-white/80 mx-auto mb-4" />
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                Ready to try our free tools?
              </h2>
              <p className="text-white/80 max-w-2xl mx-auto mb-6">
                Explore all {tools.length}+ tools and find the perfect one for your needs.
              </p>
              <Link
                href="/tools"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-gray-900 font-semibold hover:shadow-xl transition-all hover:scale-105"
              >
                Browse all tools <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
