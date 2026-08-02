import Link from 'next/link';
import { ArrowRight, HeartPulse } from 'lucide-react';
import { tools } from '@/data/registry';

export const metadata = {
  title: "Health Calculators | Navorika Pro",
  description: "Advanced local utilities deployed within the Health Calculators workspace.",
};

export default function CategoryPage() {
  const targetTools = tools.filter(t => t.category === 'health-calculators');

  return (
    <main className="max-w-7xl mx-auto px-6 py-16 lg:px-8">
      <Link href="/categories" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-600 transition mb-8">
        <ArrowRight className="h-4 w-4" /> Back to Categories
      </Link>
      
      <div className="border-b border-slate-200 dark:border-slate-800 pb-8 mb-12">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
            <HeartPulse className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white">Health Calculators</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              {targetTools.length} zero-latency tools executing privately on your local machine.
            </p>
          </div>
        </div>
      </div>

      {targetTools.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 text-slate-400 text-sm font-medium">
          No utilities deployed under this workspace yet. Ready for additions.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {targetTools.map((tool) => (
            <Link
              key={tool.slug}
              href={`/tools/${tool.slug}`}
              className="group p-6 bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-black group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                  {tool.title}
                </h3>
                <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-rose-500 transition-colors" />
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {tool.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {tool.keywords && tool.keywords.slice(0, 3).map((keyword) => (
                  <span
                    key={keyword}
                    className="px-2 py-1 rounded-full bg-slate-100 dark:bg-white/5 text-[10px] font-bold uppercase tracking-wider text-slate-500"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
