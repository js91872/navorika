import Link from 'next/link';
import { tools } from '@/data/registry';
import { Wrench, ArrowRight, Sparkles } from 'lucide-react';

export default function AllToolsPage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#0A0A0B] text-slate-900 dark:text-slate-100 py-16 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Master Index</span>
          <h1 className="text-4xl font-black tracking-tight mt-2">All Tools & Calculators</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2 font-medium">
            Browse all {tools.length} high-performance client utilities spanning every category.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <Link 
              key={tool.slug} 
              href={`/tools/${tool.slug}`}
              className="group p-6 bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-wider">
                    {tool.category}
                  </span>
                  <Sparkles className="h-4 w-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                </div>
                <h2 className="text-lg font-black mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {tool.title}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium mb-6">
                  {tool.description}
                </p>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <span>Launch Utility</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform text-indigo-600 dark:text-indigo-400" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
