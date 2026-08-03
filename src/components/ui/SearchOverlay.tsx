'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { tools } from '@/data/registry';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (!isOpen) onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const filteredTools = query.trim() === '' 
    ? [] 
    : tools.filter(t => 
        t.title.toLowerCase().includes(query.toLowerCase()) ||
        t.description.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xl"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 20, opacity: 0 }}
            className="max-w-2xl mx-auto mt-[20vh] px-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
              <div className="flex items-center gap-3 p-4 border-b border-white/5">
                <Search className="h-5 w-5 text-white/40" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search any tool..."
                  className="flex-1 bg-transparent outline-none text-white placeholder-white/30 text-lg"
                  autoFocus
                />
                <button onClick={onClose} className="p-2 rounded-full hover:bg-white/5 transition-colors">
                  <X className="h-5 w-5 text-white/40" />
                </button>
              </div>
              {filteredTools.length > 0 && (
                <div className="p-2 max-h-96 overflow-y-auto">
                  {filteredTools.map((tool) => (
                    <Link
                      key={tool.slug}
                      href={`/tools/${tool.slug}`}
                      onClick={onClose}
                      className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-white/5 transition-colors group"
                    >
                      <span className="text-white font-medium">{tool.title}</span>
                      <ArrowRight className="h-4 w-4 text-white/30 group-hover:text-white/60 transition-colors" />
                    </Link>
                  ))}
                </div>
              )}
              {query && filteredTools.length === 0 && (
                <div className="p-8 text-center text-white/30">No tools found</div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
