'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Grid3x3, Sparkles } from 'lucide-react';
import { categories, tools } from '@/data/registry';
import { toolsUnderReview } from '@/lib/seo/toolReview';

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

const colorMap: Record<string, { bg: string; border: string; glow: string; iconBg: string }> = {
  'pdf-tools': {
    bg: 'from-blue-600/20 to-indigo-600/20',
    border: 'hover:border-blue-500/50',
    glow: 'shadow-blue-500/20',
    iconBg: 'bg-blue-500/20 text-blue-400',
  },
  'image-tools': {
    bg: 'from-purple-600/20 to-violet-600/20',
    border: 'hover:border-purple-500/50',
    glow: 'shadow-purple-500/20',
    iconBg: 'bg-purple-500/20 text-purple-400',
  },
  'finance-calculators': {
    bg: 'from-emerald-600/20 to-teal-600/20',
    border: 'hover:border-emerald-500/50',
    glow: 'shadow-emerald-500/20',
    iconBg: 'bg-emerald-500/20 text-emerald-400',
  },
  'health-calculators': {
    bg: 'from-rose-600/20 to-pink-600/20',
    border: 'hover:border-rose-500/50',
    glow: 'shadow-rose-500/20',
    iconBg: 'bg-rose-500/20 text-rose-400',
  },
  'developer-tools': {
    bg: 'from-amber-600/20 to-orange-600/20',
    border: 'hover:border-amber-500/50',
    glow: 'shadow-amber-500/20',
    iconBg: 'bg-amber-500/20 text-amber-400',
  },
  'retirement-calculators': {
    bg: 'from-indigo-600/20 to-purple-600/20',
    border: 'hover:border-indigo-500/50',
    glow: 'shadow-indigo-500/20',
    iconBg: 'bg-indigo-500/20 text-indigo-400',
  },
  'currency-converters': {
    bg: 'from-blue-600/20 to-cyan-600/20',
    border: 'hover:border-blue-500/50',
    glow: 'shadow-blue-500/20',
    iconBg: 'bg-blue-500/20 text-blue-400',
  },
  'construction-calculators': {
    bg: 'from-cyan-600/20 to-blue-600/20',
    border: 'hover:border-cyan-500/50',
    glow: 'shadow-cyan-500/20',
    iconBg: 'bg-cyan-500/20 text-cyan-400',
  },
};

export default function CategoriesPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Grid3x3 className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tight">Categories</h1>
              <p className="text-[var(--muted-foreground)] mt-1">
                {categories.length} workspaces · {tools.filter((tool) => !toolsUnderReview.has(tool.slug)).length} tools
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)] mt-2 ml-14">
            <Sparkles className="h-4 w-4 text-amber-500" />
            <span>Organized collections of tools for your workflow</span>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {categories.map((category, index) => {
            const categoryTools = tools.filter(t => t.category === category.slug && !toolsUnderReview.has(t.slug));
            const icon = iconMap[category.icon] || '📁';
            const colors = colorMap[category.slug] || {
              bg: 'from-indigo-600/20 to-purple-600/20',
              border: 'hover:border-indigo-500/50',
              glow: 'shadow-indigo-500/20',
              iconBg: 'bg-indigo-500/20 text-indigo-400',
            };
            const hasTools = categoryTools.length > 0;

            return (
              <motion.div
                key={category.slug}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.06 }}
                whileHover={hasTools ? { y: -8, scale: 1.02 } : {}}
                className="group"
              >
                <Link
                  href={hasTools ? `/categories/${category.slug}` : '#'}
                  className={`block h-full ${!hasTools ? 'cursor-not-allowed opacity-60' : ''}`}
                >
                  <div className={`relative p-6 rounded-2xl bg-gradient-to-br ${colors.bg} bg-[var(--card)] border-2 border-[var(--border)] ${hasTools ? colors.border : ''} transition-all duration-500 h-full overflow-hidden shadow-lg ${hasTools ? `hover:shadow-2xl ${colors.glow}` : ''}`}>
                    {/* Animated glow on hover */}
                    {hasTools && (
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                        <div className={`absolute inset-0 bg-gradient-to-r ${colors.bg} blur-2xl rounded-2xl`} />
                      </div>
                    )}

                    <div className="relative z-10">
                      <div className={`w-14 h-14 rounded-2xl ${colors.iconBg} flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        {icon}
                      </div>
                      <h3 className="text-xl font-bold text-[var(--foreground)] group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-sm text-[var(--muted-foreground)] mt-1.5 leading-relaxed line-clamp-2">
                        {category.description}
                      </p>
                      <div className="flex items-center justify-between mt-5 pt-4 border-t border-[var(--border)] text-xs text-[var(--muted-foreground)]">
                        <span className="font-medium flex items-center gap-1.5">
                          {hasTools ? `${categoryTools.length} tools` : 'Coming soon'}
                        </span>
                        {hasTools && (
                          <span className="group-hover:translate-x-1 transition-transform">→</span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
