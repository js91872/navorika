'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Zap, Grid3x3, Filter } from 'lucide-react';
import { tools, categories } from '@/data/registry';
import { getToolIcon } from '@/lib/toolIcons';

const colorMap: Record<string, string> = {
  'pdf-tools': 'hover:border-blue-500/40',
  'image-tools': 'hover:border-purple-500/40',
  'finance-calculators': 'hover:border-emerald-500/40',
  'health-calculators': 'hover:border-rose-500/40',
  'developer-tools': 'hover:border-amber-500/40',
  'retirement-calculators': 'hover:border-indigo-500/40',
  'currency-converters': 'hover:border-cyan-500/40',
  'construction-calculators': 'hover:border-teal-500/40',
};

export default function AllToolsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredTools = useMemo(() => {
    let result = tools;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(t =>
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q)
      );
    }
    if (selectedCategory !== 'all') {
      result = result.filter(t => t.category === selectedCategory);
    }
    return result;
  }, [searchQuery, selectedCategory]);

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Grid3x3 className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tight">All Tools</h1>
              <p className="text-[var(--muted-foreground)] ml-0 mt-1">
                {filteredTools.length} tools · Instant execution
              </p>
            </div>
          </div>
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--muted-foreground)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tools by name or description..."
              className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-[var(--card)] border-2 border-[var(--border)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:border-indigo-500 transition-all shadow-sm hover:shadow-md"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="pl-11 pr-8 py-3.5 rounded-2xl bg-[var(--card)] border-2 border-[var(--border)] text-[var(--foreground)] focus:outline-none focus:border-indigo-500 transition-all appearance-none min-w-[180px] shadow-sm hover:shadow-md"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat.slug} value={cat.slug}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Tools Grid */}
        <AnimatePresence mode="wait">
          {filteredTools.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20 text-[var(--muted-foreground)]"
            >
              <p className="text-lg">No tools found</p>
              <p className="text-sm mt-1">Try adjusting your search or filter</p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
            >
              {filteredTools.map((tool, index) => {
                const borderColor = colorMap[tool.category] || 'hover:border-indigo-500/40';
                return (
                  <motion.div
                    key={tool.slug}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.025 }}
                    whileHover={{ y: -6, scale: 1.02 }}
                    className="group"
                  >
                    <Link
                      href={`/tools/${tool.slug}`}
                      className={`block p-6 rounded-2xl bg-[var(--card)] border-2 border-[var(--border)] ${borderColor} transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 h-full`}
                    >
                      <div className="flex items-start justify-between">
                        <span className="text-3xl group-hover:scale-110 transition-transform duration-300">
                          {getToolIcon(tool.slug)}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted-foreground)] bg-[var(--muted)] px-3 py-1 rounded-full">
                          {tool.category.split('-')[0]}
                        </span>
                      </div>
                      <h3 className="font-bold text-[var(--foreground)] group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mt-3 line-clamp-1">
                        {tool.title}
                      </h3>
                      <p className="text-sm text-[var(--muted-foreground)] group-hover:text-[var(--foreground)] transition-colors mt-1.5 line-clamp-2 leading-relaxed">
                        {tool.description}
                      </p>
                      <div className="mt-4 pt-4 border-t border-[var(--border)] flex items-center justify-between text-xs">
                        <span className="text-[var(--muted-foreground)] flex items-center gap-1.5">
                          <Zap className="h-3 w-3 text-indigo-500" /> Instant
                        </span>
                        <span className="text-[var(--muted-foreground)] group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:translate-x-1 transition-all duration-300">
                          →
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
