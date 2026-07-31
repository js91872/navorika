'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Master search index connecting every tool to various search keywords
const toolSearchIndex = [
  { keywords: ['tax', 'income', 'deduction', 'slab', 'tds'], path: '/tools/tax-calculators' },
  { keywords: ['business', 'profit', 'margin', 'break-even', 'pricing', 'revenue'], path: '/tools/business-calculators' },
  { keywords: ['save', 'saving', 'fd', 'rd', 'ppf', 'epf', 'nps', 'deposit'], path: '/tools/savings-calculators' },
  { keywords: ['loan', 'emi', 'mortgage', 'borrow', 'interest rate'], path: '/tools/loan-emi-calculator' },
  { keywords: ['retire', 'pension', 'golden years', 'retirement'], path: '/tools/retirement-calculators' },
  { keywords: ['credit', 'card', 'debt', 'payoff', 'apr'], path: '/tools/credit-card-calculators' },
  { keywords: ['bank', 'compound', 'banking', 'principal'], path: '/tools/banking-calculators' },
  { keywords: ['salary', 'ctc', 'compensation', 'take-home', 'paycheck'], path: '/tools/salary-calculators' },
  { keywords: ['insurance', 'policy', 'coverage', 'premium'], path: '/tools/insurance-calculators' },
  { keywords: ['invest', 'investment', 'roi', 'growth', 'returns'], path: '/tools/investment-calculators' },
  { keywords: ['encrypt', 'decrypt', 'password', 'security', 'lock', 'unlock', 'pdf protect'], path: '/tools/pdf-security' },
  { keywords: ['convert', 'format', 'image converter', 'pdf convert'], path: '/tools/pdf-converter' },
  { keywords: ['edit', 'modify', 'annotate', 'pdf edit'], path: '/tools/pdf-editor' },
  { keywords: ['optimize', 'compress', 'size', 'shrink pdf'], path: '/tools/pdf-optimizer' },
  { keywords: ['page', 'number', 'pagination', 'stamp'], path: '/tools/pdf-page-numbers' },
  { keywords: ['merge', 'split', 'pdf tools', 'combine pdf'], path: '/tools/pdf-tools' },
];

export default function SearchBox() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    const term = query.toLowerCase().trim();

    // Search through the index for any keyword match
    let matchedPath = '';
    for (const item of toolSearchIndex) {
      if (item.keywords.some(keyword => term.includes(keyword))) {
        matchedPath = item.path;
        break;
      }
    }

    if (matchedPath) {
      router.push(matchedPath);
    } else {
      // Fallback: if no specific keyword hits, scroll to tools grid
      const toolsSection = document.getElementById('tools');
      if (toolsSection) {
        toolsSection.scrollIntoView({ behavior: 'smooth' });
      } else {
        router.push('/#tools');
      }
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative flex items-center shadow-xl shadow-indigo-500/5 rounded-2xl p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-colors">
      <span className="pl-4 text-slate-400 dark:text-slate-500">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </span>
      <input 
        type="text" 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for any tool (e.g. Mortgage, PDF merge, BMI)..." 
        className="w-full bg-transparent border-none px-3 py-3 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none text-sm sm:text-base transition-colors"
      />
      <button type="submit" className="bg-indigo-600 text-white font-semibold px-6 py-3 rounded-xl text-sm hover:bg-indigo-700 transition-colors shadow-md">
        Search
      </button>
    </form>
  );
}
