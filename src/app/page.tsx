'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Shield, 
  Zap, 
  Sparkles,
  Search,
  FileText,
  Image,
  Calculator,
  HeartPulse,
  Code,
  Wrench
} from 'lucide-react';
import { tools, categories } from '@/data/registry';

const categoryIcons: Record<string, any> = {
  'pdf-tools': FileText,
  'image-tools': Image,
  'finance-calculators': Calculator,
  'health-calculators': HeartPulse,
  'developer-tools': Code,
  'construction-calculators': Wrench,
};

const categoryColors: Record<string, string> = {
  'pdf-tools': 'from-blue-500 to-indigo-600',
  'image-tools': 'from-violet-500 to-purple-600',
  'finance-calculators': 'from-emerald-500 to-teal-600',
  'health-calculators': 'from-rose-500 to-pink-600',
  'developer-tools': 'from-amber-500 to-orange-600',
  'construction-calculators': 'from-cyan-500 to-blue-600',
};

export default function Home() {
  const totalTools = tools.length;
  const displayCount = totalTools >= 100 ? '100+' : '90+';

  return (
    <main className="flex-1 pt-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      <div className="bg-[var(--background)] text-[var(--foreground)]">
        <section className="relative overflow-hidden px-4 pt-24 pb-16 md:pt-32 md:pb-24">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-500/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-[600px] h-[300px] bg-purple-500/5 rounded-full blur-3xl"></div>
          </div>

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-400"></span>
              </span>
              Zero-latency · Local processing
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.1] mb-4">
              Free Online Tools, Calculators, PDF &amp; Image Tools
            </h1>

            <p className="text-2xl font-bold mb-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Fast. Free. No Signup.
            </p>

            <p className="text-lg text-[var(--muted-foreground)] max-w-2xl mx-auto leading-relaxed mb-8">
              {displayCount} free tools that run directly in your browser. Calculate, convert, compress, edit and transform files without uploading your data or creating an account.
            </p>

            <button className="flex items-center gap-3 max-w-lg mx-auto w-full p-3 rounded-full bg-[var(--card)] border border-[var(--border)] hover:border-indigo-400/50 transition-all text-left shadow-lg hover:shadow-indigo-500/10">
              <span className="pl-2 text-[var(--muted-foreground)]">🔍</span>
              <span className="flex-1 text-[var(--muted-foreground)]">Search {displayCount} tools...</span>
              <kbd className="px-2 py-1 rounded bg-[var(--muted)] text-[var(--muted-foreground)] text-xs font-mono">⌘K</kbd>
            </button>

            <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-sm text-[var(--muted-foreground)]">
              <span className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-indigo-500" />
                100% client-side
              </span>
              <span className="w-px h-4 bg-[var(--border)]"></span>
              <span className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-emerald-500" />
                No data uploaded
              </span>
              <span className="w-px h-4 bg-[var(--border)]"></span>
              <span className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-500" />
                {totalTools}+ tools
              </span>
              <span className="w-px h-4 bg-[var(--border)]"></span>
              <span className="flex items-center gap-2">🔒 No signup required</span>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold">Tool Categories</h2>
              <p className="text-[var(--muted-foreground)] text-sm mt-1">Explore our comprehensive collection of free online tools</p>
            </div>
            <Link className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1" href="/categories">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category, index) => {
              const Icon = categoryIcons[category.slug];
              const colorClass = categoryColors[category.slug] || 'from-indigo-500 to-purple-600';
              const categoryTools = tools.filter(t => t.category === category.slug);
              
              return (
                <motion.div
                  key={category.slug}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <Link
                    href={`/categories/${category.slug}`}
                    className="block h-full p-6 rounded-2xl bg-[var(--card)] border-2 border-[var(--border)] hover:border-indigo-500/50 transition-all duration-500 hover:shadow-lg hover:shadow-indigo-500/20 group"
                  >
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${colorClass} flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      {Icon && <Icon className="h-7 w-7 text-white" />}
                    </div>
                    <h3 className="text-xl font-bold text-[var(--foreground)] group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-[var(--muted-foreground)] mt-1.5 leading-relaxed line-clamp-2">
                      {category.description}
                    </p>
                    <div className="flex items-center justify-between mt-5 pt-4 border-t border-[var(--border)] text-xs text-[var(--muted-foreground)]">
                      <span className="font-medium flex items-center gap-1.5">{categoryTools.length} tools</span>
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Popular Tools Section */}
        <section className="bg-[var(--muted)]/30 border-y border-[var(--border)] py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold">Popular Free Tools</h2>
                <p className="text-[var(--muted-foreground)] text-sm mt-1">Jump straight into our most popular online utilities</p>
              </div>
              <Link className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1" href="/tools">
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {tools.slice(0, 12).map((tool) => (
                <Link
                  key={tool.slug}
                  href={`/tools/${tool.slug}`}
                  className="group p-4 rounded-xl bg-[var(--card)] border border-[var(--border)] hover:border-indigo-500/40 transition-all hover:shadow-lg hover:shadow-indigo-500/5 hover:-translate-y-1 duration-300"
                >
                  <div className="flex items-start justify-between">
                    <span className="text-3xl group-hover:scale-110 transition-transform duration-300">🔧</span>
                    <span className="text-[10px] font-medium uppercase tracking-wider text-[var(--muted-foreground)] bg-[var(--muted)] px-2.5 py-1 rounded-full">
                      {categories.find(c => c.slug === tool.category)?.name || tool.category}
                    </span>
                  </div>
                  <h3 className="font-semibold mt-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
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

        {/* CTA Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-8 sm:p-12 text-center">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-10"></div>
            <div className="relative z-10">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-layers h-12 w-12 text-white/80 mx-auto mb-4">
                <path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"></path>
                <path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12"></path>
                <path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17"></path>
              </svg>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Ready to try our free tools?</h2>
              <p className="text-white/80 max-w-2xl mx-auto mb-6">Explore all {totalTools}+ tools and find the perfect one for your needs.</p>
              <Link className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-gray-900 font-semibold hover:shadow-xl transition-all hover:scale-105" href="/tools">
                Browse all tools <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
