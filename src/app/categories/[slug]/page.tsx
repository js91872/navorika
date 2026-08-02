'use client';

import { useParams } from 'next/navigation';
import { tools, categories } from '@/data/registry';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';

export default function CategoryDynamicPage() {
  const params = useParams();
  const currentSlug = params?.slug as string;
  
  // Cross-reference metadata directly from the master registry configurations
  const categoryMeta = categories.find(c => c.slug === currentSlug);
  
  // Dynamic parsing logic maps every active operational utility matching the route slug
  const categoryTools = tools.filter(t => t.category === currentSlug);

  if (!categoryMeta) {
    return (
      <div className="text-center py-24 font-mono text-slate-500 text-sm">
        <h2 className="text-xl font-bold text-red-500 mb-2">Category Mismatch Protocol</h2>
        The specified category routing path standard does not exist.
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-12 lg:px-8 min-h-screen">
      <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 transition mb-8">
        <ArrowLeft className="h-4 w-4" /> Back to Portal
      </Link>

      <div className="mb-12 border-b border-slate-100 dark:border-slate-800 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-4 border border-indigo-500/20">
          <ShieldCheck className="h-4 w-4" /> Local Processing Active
        </div>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">{categoryMeta.name}</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">{categoryMeta.description}</p>
      </div>

      {categoryTools.length === 0 ? (
        <div className="p-16 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl text-slate-400 font-bold uppercase text-xs tracking-widest">
          Zero operational tools mapped onto this dynamic category matrix.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryTools.map((tool) => (
            <Link 
              key={tool.slug} 
              href={tool.category === 'finance-calculators' && tool.slug !== 'sip-calculator' ? `/tools/${tool.slug}` : `/tools/${tool.slug}`} 
              className="block group"
            >
              <div className="h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 hover:shadow-xl transition-all hover:-translate-y-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6 line-clamp-2">
                    {tool.description}
                  </p>
                </div>
                <div className="flex items-center justify-end text-xs font-bold uppercase tracking-wider text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 pt-4 border-t border-slate-50 dark:border-slate-800/40">
                  <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
