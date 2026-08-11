'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Grid3x3, Filter, ArrowRight } from 'lucide-react';
import { tools, categories } from '@/data/registry';
import { getToolIcon } from '@/lib/toolIcons';
import { toolDescriptions } from '@/lib/toolDescriptions';

const colorMap: Record<string, string> = {
  'pdf-tools': 'hover:border-blue-500/50',
  'image-tools': 'hover:border-purple-500/50',
  'finance-calculators': 'hover:border-emerald-500/50',
  'health-calculators': 'hover:border-rose-500/50',
  'developer-tools': 'hover:border-amber-500/50',
  'retirement-calculators': 'hover:border-indigo-500/50',
  'currency-converters': 'hover:border-cyan-500/50',
  'construction-calculators': 'hover:border-teal-500/50',
};

const categoryBadgeColors: Record<string, string> = {
  'pdf-tools': 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  'image-tools': 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
  'finance-calculators': 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  'health-calculators': 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
  'developer-tools': 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  'construction-calculators': 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20',
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
        (toolDescriptions[t.slug] || t.description || '').toLowerCase().includes(q)
      );
    }
    if (selectedCategory !== 'all') {
      result = result.filter(t => t.category === selectedCategory);
    }
    return result;
  }, [searchQuery, selectedCategory]);

  const getDescription = (slug: string, fallback: string) => {
    return toolDescriptions[slug] || fallback;
  };

  // Get category name from slug
  const getCategoryName = (categorySlug: string) => {
    const cat = categories.find(c => c.slug === categorySlug);
    return cat?.name || categorySlug;
  };

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
                {filteredTools.length} tools · Instant browser processing
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

        {/* Tools Grid - with distinctive styling */}
        <AnimatePresence mode="wait">
          {filteredTools.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20 text-[var(--muted-foreground)]"
            >
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">No tools found</h3>
              <p className="text-sm">Try adjusting your search or filter</p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filteredTools.map((tool, index) => {
                const icon = getToolIcon(tool.slug);
                const description = getDescription(tool.slug, tool.description);
                const colorClass = colorMap[tool.category] || 'hover:border-indigo-500/50';
                const badgeColor = categoryBadgeColors[tool.category] || 'bg-slate-500/10 text-slate-600 dark:text-slate-400';
                const categoryName = getCategoryName(tool.category);
                
                return (
                  <motion.div
                    key={tool.slug}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.03 }}
                  >
                    <Link
                      href={`/tools/${tool.slug}`}
                      className={`group relative block p-5 rounded-2xl bg-[var(--card)] border-2 border-[var(--border)] ${colorClass} transition-all hover:shadow-xl hover:-translate-y-1 duration-300 overflow-hidden`}
                    >
                      {/* Shine effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                      
                      {/* Top accent line */}
                      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                      <div className="relative z-10">
                        <div className="flex items-start gap-4">
                          <div className="p-2.5 rounded-xl bg-indigo-500/10 group-hover:bg-indigo-500/20 transition-colors duration-300">
                            <span className="text-xl group-hover:scale-110 transition-transform duration-300 block">
                              {icon || '🔧'}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-[var(--foreground)] group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                              {tool.title}
                            </h3>
                            <p className="text-sm text-[var(--muted-foreground)] mt-1 line-clamp-2 leading-relaxed">
                              {description}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-[var(--border)]">
                          <span className={`text-[10px] font-medium px-2.5 py-1 rounded-full border ${badgeColor}`}>
                            {categoryName}
                          </span>
                          <span className="p-1 rounded-full bg-[var(--muted)] group-hover:bg-indigo-500/10 transition-colors duration-300">
                            <ArrowRight className="h-3.5 w-3.5 text-[var(--muted-foreground)] group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all" />
                          </span>
                        </div>
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
