'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { X, Search } from 'lucide-react';
import { tools } from '@/data/registry';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.length > 0) {
      const filtered = tools.filter(tool =>
        tool.title.toLowerCase().includes(query.toLowerCase()) ||
        tool.description.toLowerCase().includes(query.toLowerCase()) ||
        tool.keywords.some(k => k.toLowerCase().includes(query.toLowerCase()))
      );
      setResults(filtered.slice(0, 8));
    } else {
      setResults([]);
    }
  }, [query]);

  const handleSelect = (slug: string) => {
    onClose();
    router.push(`/tools/${slug}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-[var(--background)]/95 backdrop-blur-sm">
      <div className="max-w-3xl mx-auto px-4 pt-20">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search 100+ tools..."
            className="w-full px-6 py-4 pl-14 rounded-2xl bg-[var(--card)] border-2 border-[var(--border)] focus:border-indigo-500 outline-none text-lg"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--muted-foreground)]" />
          <button
            onClick={onClose}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-[var(--muted)] transition-colors"
          >
            <X className="h-6 w-6 text-[var(--muted-foreground)]" />
          </button>
        </div>

        {results.length > 0 && (
          <div className="mt-6 bg-[var(--card)] rounded-2xl border border-[var(--border)] overflow-hidden">
            {results.map((tool) => (
              <button
                key={tool.slug}
                onClick={() => handleSelect(tool.slug)}
                className="w-full px-6 py-4 text-left hover:bg-[var(--muted)] transition-colors flex items-center justify-between border-b border-[var(--border)] last:border-0"
              >
                <div>
                  <div className="font-medium">{tool.title}</div>
                  <div className="text-sm text-[var(--muted-foreground)]">{tool.description}</div>
                </div>
                <span className="text-sm text-[var(--muted-foreground)]">→</span>
              </button>
            ))}
          </div>
        )}

        {query.length > 0 && results.length === 0 && (
          <div className="mt-6 text-center text-[var(--muted-foreground)] py-8">
            <p>No results found for "{query}"</p>
            <button
              onClick={() => {
                onClose();
                router.push(`/search?q=${encodeURIComponent(query)}`);
              }}
              className="mt-2 text-indigo-500 hover:underline"
            >
              View all results
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
