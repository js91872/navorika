'use client';
import { useParams } from 'next/navigation';
import { tools, categories } from '@/data/registry';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Grid3X3 } from 'lucide-react';

export default function CategoryDynamicPage() {
  const params = useParams();
  const currentSlug = params?.slug as string;
  const categoryMeta = categories.find(c => c.slug === currentSlug);
  const categoryTools = tools.filter(t => t.category === currentSlug);

  if (!categoryMeta) return null;

  return (
    <main className="h-[calc(100dvh-80px)] w-full bg-slate-50 dark:bg-[#0A0A0B] transition-colors duration-500 overflow-hidden flex flex-col p-6">
      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col min-h-0">
        
        <div className="mb-8 shrink-0">
           <div className="flex items-center gap-3 mb-2">
             <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-lg"><Grid3X3 className="h-5 w-5"/></div>
             <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white uppercase">{categoryMeta.name}</h1>
           </div>
           <p className="text-slate-500 dark:text-slate-400 font-medium">{categoryMeta.description}</p>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar pb-10">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoryTools.map((tool) => (
              <Link 
                key={tool.slug} 
                href={`/tools/${tool.slug}`} 
                className="group flex flex-col justify-between p-6 bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-[2rem] hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 backdrop-blur-xl h-48"
              >
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">{tool.title}</h3>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2">{tool.description}</p>
                </div>
                <div className="flex justify-end">
                   <div className="p-2 rounded-full bg-slate-100 dark:bg-white/5 group-hover:bg-indigo-600 transition-all">
                     <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-white" />
                   </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
