'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { toolSearchIndex } from '@/data/toolSearchIndex';
import { searchTools } from '@/lib/toolSearch';
import { parseRecentTools, RECENT_TOOLS_STORAGE_KEY } from '@/lib/recentTools';
import { toolsUnderReview } from '@/lib/seo/toolReview';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const validSlugs = new Set(toolSearchIndex.map((tool) => tool.slug));

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [recentSlugs, setRecentSlugs] = useState<string[]>([]);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const results = useMemo(() => searchTools(query, toolSearchIndex, 8), [query]);
  const recent = recentSlugs.flatMap((slug) => {
    const tool = toolSearchIndex.find((candidate) => candidate.slug === slug);
    return tool ? [tool] : [];
  });
  const displayed = query.trim() ? results : recent;

  useEffect(() => {
    if (!isOpen) return;
    returnFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const timer = window.setTimeout(() => {
      setQuery('');
      setActiveIndex(0);
      try {
        setRecentSlugs(parseRecentTools(localStorage.getItem(RECENT_TOOLS_STORAGE_KEY), validSlugs, toolsUnderReview).map(({ slug }) => slug));
      } catch {
        setRecentSlugs([]);
      }
      inputRef.current?.focus();
    }, 0);
    document.body.style.overflow = 'hidden';
    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = '';
      returnFocusRef.current?.focus();
    };
  }, [isOpen]);

  const select = (slug: string) => {
    onClose();
    router.push(`/tools/${slug}`);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      onClose();
      return;
    }
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      if (!displayed.length) return;
      if (event.key === 'Home') setActiveIndex(0);
      else if (event.key === 'End') setActiveIndex(displayed.length - 1);
      else setActiveIndex((current) => event.key === 'ArrowDown' ? (current + 1) % displayed.length : (current - 1 + displayed.length) % displayed.length);
      return;
    }
    if (event.key === 'Enter' && displayed[activeIndex]) {
      event.preventDefault();
      select(displayed[activeIndex].slug);
      return;
    }
    if (event.key === 'Tab' && dialogRef.current) {
      const focusable = [...dialogRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), a[href]')];
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  };

  if (!isOpen) return null;
  const status = query.trim()
    ? `${results.length} result${results.length === 1 ? '' : 's'} found.`
    : recent.length ? `${recent.length} recent tool${recent.length === 1 ? '' : 's'}.` : 'Type to search all tools.';

  return <div className="fixed inset-0 z-[100] bg-black/60 p-3 pt-12 backdrop-blur-sm sm:pt-20" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="tool-search-title" className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--background)] shadow-2xl" onKeyDown={handleKeyDown}>
      <h2 id="tool-search-title" className="sr-only">Find a Navorika tool</h2>
      <div className="relative border-b border-[var(--border)]">
        <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[var(--muted-foreground)]" aria-hidden="true" />
        <input ref={inputRef} type="search" role="combobox" aria-expanded="true" aria-controls="tool-search-results" aria-autocomplete="list" aria-activedescendant={displayed[activeIndex] ? `tool-search-option-${displayed[activeIndex].slug}` : undefined} value={query} onChange={(event) => { setQuery(event.target.value); setActiveIndex(0); }} placeholder="Search tools, for example roof, JSON, or EMI" className="min-h-16 w-full bg-transparent py-4 pl-12 pr-14 text-base outline-none sm:text-lg" />
        <button type="button" onClick={onClose} className="absolute right-2 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full hover:bg-[var(--muted)]" aria-label="Close tool search"><X className="size-5" aria-hidden="true" /></button>
      </div>
      <p className="sr-only" role="status" aria-live="polite">{status}</p>
      {!query.trim() && recent.length > 0 && <p className="px-5 pt-4 text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">Recent tools</p>}
      {displayed.length > 0 ? <div id="tool-search-results" role="listbox" aria-label="Tool search results" className="max-h-[60vh] overflow-y-auto p-2">
        {displayed.map((tool, index) => <button id={`tool-search-option-${tool.slug}`} role="option" aria-selected={index === activeIndex} key={tool.slug} type="button" onMouseEnter={() => setActiveIndex(index)} onClick={() => select(tool.slug)} className={`flex min-h-16 w-full items-center justify-between gap-4 rounded-xl px-4 py-3 text-left ${index === activeIndex ? 'bg-indigo-500/10 ring-1 ring-indigo-500/30' : 'hover:bg-[var(--muted)]'}`}><span><span className="block font-semibold">{tool.title}</span><span className="mt-0.5 block text-sm text-[var(--muted-foreground)]">{tool.description}</span></span><span className="shrink-0 text-xs text-[var(--muted-foreground)]">↵</span></button>)}
      </div> : query.trim() ? <div className="p-8 text-center text-[var(--muted-foreground)]"><p>No matching tools found.</p><button type="button" onClick={() => { onClose(); router.push(`/search?q=${encodeURIComponent(query.trim())}`); }} className="mt-3 min-h-11 rounded-xl px-4 font-semibold text-indigo-600 hover:bg-indigo-500/10">View the full search page</button></div> : <p className="p-8 text-center text-[var(--muted-foreground)]">Start typing to search all tools.</p>}
      <div className="hidden border-t border-[var(--border)] px-4 py-3 text-xs text-[var(--muted-foreground)] sm:flex sm:gap-4"><span>↑↓ navigate</span><span>Enter open</span><span>Esc close</span></div>
    </div>
  </div>;
}
