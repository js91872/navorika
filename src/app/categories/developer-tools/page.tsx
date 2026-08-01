'use client';

import Link from 'next/link';
import { ArrowLeft, FileText, Calculator, HeartPulse, Code, Hammer, ArrowRight } from 'lucide-react';
import { categories, tools } from '@/data/registry';

const iconMap: { [key: string]: any } = {
  FileText: FileText,
  Calculator: Calculator,
  HeartPulse: HeartPulse,
  Code: Code,
  Hammer: Hammer,
};

export default function DeveloperToolsCategoryPage() {
  const category = categories.find((c) => c.slug === 'developer-tools')!;
  const categoryTools = tools.filter((t) => t.category === 'developer-tools');
  const HeaderIcon = iconMap[category.icon] || Code;

  return (
    <main className="max-w-7xl mx-auto px-6 py-12 lg:px-8 min-h-screen">
      <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-600 transition mb-10">
        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
      </Link>
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-2 rounded-lg bg-gradient-to-br ${category.color} text-white shadow-sm`}>
              <HeaderIcon className="h-6 w-6" />
            </div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{category.name}</h1>
          </div>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mt-4">
            {category.description}
          </p>
        </div>
        <div className="bg-slate-100 dark:bg-slate-800/50 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 h-fit">
          <span className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">{categoryTools.length} Utilities Active</span>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categoryTools.map((tool) => {
          const ToolIcon = iconMap[tool.icon] || Code;
          
          return (
            <Link 
              key={tool.slug} 
              href={`/tools/${tool.slug}`}
              className="group p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm hover:shadow-xl hover:border-indigo-500/50 transition-all flex flex-col justify-between hover:-translate-y-1 overflow-hidden relative"
            >
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                    <ToolIcon className="h-5 w-5" />
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">{tool.title}</h2>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6 line-clamp-2">
                  {tool.description}
                </p>
              </div>
              
              <div className="relative z-10 flex justify-end">
                <div className="h-8 w-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/30 transition-colors">
                  <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
