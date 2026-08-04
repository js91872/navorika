'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, X, ArrowRight, Clock, Calendar, 
  BookOpen, FileText, HeartPulse, Calculator,
  Image, Code, Filter, Sparkles
} from 'lucide-react';
import { guides, getRecentGuides } from '@/data/guides';

const categoryIcons: Record<string, any> = {
  finance: Calculator,
  health: HeartPulse,
  pdf: FileText,
  image: Image,
  developer: Code,
  general: BookOpen,
};

const categoryColors: Record<string, string> = {
  finance: 'from-emerald-500/20 to-teal-500/20',
  health: 'from-rose-500/20 to-pink-500/20',
  pdf: 'from-blue-500/20 to-indigo-500/20',
  image: 'from-purple-500/20 to-violet-500/20',
  developer: 'from-amber-500/20 to-orange-500/20',
  general: 'from-slate-500/20 to-gray-500/20',
};

export default function GuidesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const recentGuides = getRecentGuides(6);

  const filteredGuides = guides.filter(guide => {
    const matchesSearch = guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          guide.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          guide.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || guide.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <BookOpen className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tight">Guides & Tutorials</h1>
              <p className="text-[var(--muted-foreground)] mt-1">
                {guides.length} in-depth guides to help you master your workflow
              </p>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--muted-foreground)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search guides by title, topic, or tags..."
                className="w-full pl-12 pr-4 py-3 rounded-2xl bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:border-indigo-500 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 rounded-2xl bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)] focus:outline-none focus:border-indigo-500 transition-all min-w-[180px]"
            >
              <option value="all">All Categories</option>
              <option value="finance">Finance</option>
              <option value="health">Health</option>
              <option value="pdf">PDF</option>
              <option value="image">Image</option>
              <option value="developer">Developer</option>
            </select>
          </div>
        </div>

        {/* Recent Guides */}
        {!searchQuery && selectedCategory === 'all' && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-500" />
              Recent Guides
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentGuides.map((guide) => (
                <Link
                  key={guide.id}
                  href={`/guides/${guide.slug}`}
                  className="group p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] hover:border-indigo-500/40 transition-all hover:shadow-lg hover:shadow-indigo-500/5"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-${guide.category}-500/10 text-${guide.category}-600 dark:text-${guide.category}-400`}>
                      {guide.category}
                    </span>
                    <span className="text-xs text-[var(--muted-foreground)] flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {guide.readTime} min
                    </span>
                  </div>
                  <h3 className="font-bold group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
                    {guide.title}
                  </h3>
                  <p className="text-sm text-[var(--muted-foreground)] mt-2 line-clamp-2">
                    {guide.description}
                  </p>
                  <div className="mt-4 pt-4 border-t border-[var(--border)] flex items-center justify-between text-xs text-[var(--muted-foreground)]">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> {new Date(guide.date).toLocaleDateString()}
                    </span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* All Guides Grid */}
        <AnimatePresence mode="wait">
          {filteredGuides.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20 text-[var(--muted-foreground)]"
            >
              <p className="text-lg">No guides found</p>
              <p className="text-sm mt-1">Try adjusting your search or filter</p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {filteredGuides.map((guide, index) => {
                const Icon = categoryIcons[guide.category] || BookOpen;
                return (
                  <motion.div
                    key={guide.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.04 }}
                    whileHover={{ y: -4 }}
                  >
                    <Link
                      href={`/guides/${guide.slug}`}
                      className="block p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] hover:border-indigo-500/40 transition-all hover:shadow-lg hover:shadow-indigo-500/5 h-full"
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <div className={`p-2 rounded-xl bg-${guide.category}-500/10 text-${guide.category}-600 dark:text-${guide.category}-400`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-${guide.category}-500/10 text-${guide.category}-600 dark:text-${guide.category}-400`}>
                              {guide.category}
                            </span>
                            <span className="text-xs text-[var(--muted-foreground)] flex items-center gap-1">
                              <Clock className="h-3 w-3" /> {guide.readTime} min
                            </span>
                          </div>
                        </div>
                      </div>
                      <h3 className="font-bold group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
                        {guide.title}
                      </h3>
                      <p className="text-sm text-[var(--muted-foreground)] mt-2 line-clamp-2">
                        {guide.description}
                      </p>
                      <div className="mt-4 pt-4 border-t border-[var(--border)] flex items-center justify-between text-xs text-[var(--muted-foreground)]">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> {new Date(guide.date).toLocaleDateString()}
                        </span>
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
