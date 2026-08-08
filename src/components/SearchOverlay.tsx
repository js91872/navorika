'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Zap, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { tools } from '@/data/registry';
import { getToolIcon } from '@/lib/toolIcons';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<typeof tools>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.trim().length === 0) {
      setResults([]);
      return;
    }

    const q = query.toLowerCase();
    const filtered = tools.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.keywords?.some((k) => k.toLowerCase().includes(q))
    );
    setResults(filtered.slice(0, 8));
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="max-w-2xl mx-auto mt-24 p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[var(--card)] rounded-2xl shadow-2xl border border-[var(--border)] overflow-hidden">
              <div className="flex items-center gap-3 p-4 border-b border-[var(--border)]">
                <Search className="h-5 w-5 text-[var(--muted-foreground)]" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search all tools..."
                  className="flex-1 bg-transparent border-none outline-none text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]"
                />
                <button
                  onClick={onClose}
                  className="p-1 rounded hover:bg-[var(--muted)] transition-colors"
                >
                  <X className="h-5 w-5 text-[var(--muted-foreground)]" />
                </button>
              </div>

              <div className="max-h-[60vh] overflow-y-auto p-2">
                {results.length === 0 && query.length > 0 && (
                  <div className="p-8 text-center text-[var(--muted-foreground)]">
                    <Zap className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No tools found for &quot;{query}&quot;</p>
                  </div>
                )}

                {results.length > 0 && (
                  <div className="space-y-1">
                    {results.map((tool) => (
                      <Link
                        key={tool.slug}
                        href={`/tools/${tool.slug}`}
                        onClick={onClose}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--muted)] transition-colors group"
                      >
                        <span className="text-2xl">{getToolIcon(tool.slug)}</span>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-[var(--foreground)] group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            {tool.title}
                          </div>
                          <div className="text-sm text-[var(--muted-foreground)] truncate">
                            {tool.description}
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-[var(--muted-foreground)] group-hover:text-indigo-500 transition-colors" />
                      </Link>
                    ))}
                  </div>
                )}

                {results.length === 0 && query.length === 0 && (
                  <div className="p-8 text-center text-[var(--muted-foreground)]">
                    <p className="text-sm">Type to search for tools...</p>
                    <p className="text-xs mt-2">Press ESC to close</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
