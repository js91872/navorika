import Link from 'next/link';
import { ArrowLeft, Wrench } from 'lucide-react';
import { tools } from '@/data/registry';

export const metadata = {
  title: "Construction Calculators | Navorika Pro",
  description: "20+ construction calculators for material estimation, cost planning, and project management.",
};

export default function CategoryPage() {
  const targetTools = tools.filter(t => t.category === 'construction-calculators');

  return (
    <main className="max-w-7xl mx-auto px-6 py-16 lg:px-8">
      <Link href="/categories" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-600 transition mb-8">
        <ArrowLeft className="h-4 w-4" /> Back to Categories
      </Link>
      <div className="border-b border-slate-200 dark:border-slate-800 pb-8 mb-12">
        <div className="flex items-center gap-3">
          <Wrench className="h-8 w-8 text-indigo-500" />
          <h1 className="text-4xl font-black text-slate-900 dark:text-white">Construction Calculators</h1>
        </div>
        <p className="text-slate-600 dark:text-slate-400 mt-2">20+ calculators for material estimation, cost planning, and project management. All calculations run locally in your browser.</p>
      </div>

      {targetTools.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 text-slate-400 text-sm font-medium">
          No tools found in this category. Check back soon!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {targetTools.map((tool) => (
            <Link
              key={tool.slug}
              href={`/tools/${tool.slug}`}
              className="group block p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 transition-all hover:shadow-lg hover:shadow-indigo-500/5 hover:-translate-y-1"
            >
              <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {tool.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm mt-2 leading-relaxed">
                {tool.description}
              </p>
              <div className="mt-4 flex items-center text-sm text-indigo-500 opacity-0 group-hover:opacity-100 transition-all">
                <span>Calculate now</span>
                <svg className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
