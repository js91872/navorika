'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { tools } from '@/data/registry';
import { getToolIcon } from '@/lib/toolIcons';

export default function EnhancedToolGrid() {
  const featuredTools = tools.slice(0, 6);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {featuredTools.map((tool, index) => {
        const icon = getToolIcon(tool.slug);
        
        return (
          <motion.div
            key={tool.slug}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
          >
            <Link
              href={`/tools/${tool.slug}`}
              className="group block h-full p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] hover:border-indigo-500/40 transition-all hover:shadow-lg hover:-translate-y-1"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{icon}</span>
                <h3 className="font-semibold text-[var(--foreground)] group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {tool.title}
                </h3>
              </div>
              <p className="text-sm text-[var(--muted-foreground)] line-clamp-2">
                {tool.description}
              </p>
              <div className="mt-4 flex items-center text-sm text-indigo-500 opacity-0 group-hover:opacity-100 transition-all">
                <span>Use tool</span>
                <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
