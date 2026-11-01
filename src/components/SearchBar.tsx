'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

interface SearchBarProps {
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
}

export default function SearchBar({
  placeholder = 'Search tools — e.g. PDF, image, BMI, concrete',
  className = '',
}: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      role="search"
      className={`flex w-full bg-white dark:bg-[#18181b] border border-[#d6d6dc] dark:border-[#27272a] rounded-lg overflow-hidden shadow-xs focus-within:border-[#e5322d] focus-within:ring-2 focus-within:ring-[#e5322d]/20 transition-all ${className}`}
    >
      <div className="relative flex-1 flex items-center min-w-0">
        <Search className="absolute left-4 h-5 w-5 text-[#5b5b63] dark:text-[#a1a1aa] pointer-events-none" aria-hidden="true" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          aria-label="Search tools"
          className="w-full min-w-0 py-3.5 sm:py-4 pl-12 pr-4 bg-transparent border-0 outline-none text-sm sm:text-base text-[#18181b] dark:text-white placeholder:text-[#5b5b63] dark:placeholder:text-[#a1a1aa]"
        />
      </div>
      <button
        type="submit"
        className="bg-[#e5322d] hover:bg-[#c71f1e] text-white font-semibold px-5 sm:px-7 text-sm transition-colors cursor-pointer shrink-0"
      >
        Search
      </button>
    </form>
  );
}
