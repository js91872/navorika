import Link from 'next/link';
import { categories, tools } from '@/data/registry';
import { FileText, Image, Calculator, HeartPulse, Code, Hammer, ArrowRight } from 'lucide-react';

const iconMap: { [key: string]: any } = {
  FileText, Image, Calculator, HeartPulse, Code, Hammer,
};

export default function AllCategoriesPage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#0A0A0B] text-slate-900 dark:text-slate-100 py-16 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Directory</span>
          <h1 className="text-4xl font-black tracking-tight mt-2">All Tool Categories</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2 font-medium">
            Explore our complete suites of high-speed client utilities and calculators.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const Icon = iconMap[cat.icon] || FileText;
            const count = tools.filter(t => t.category === cat.slug).length;

            return (
              <Link 
                key={cat.slug} 
                href={`/categories/${cat.slug}`}
                className="group p-8 bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className={`p-3.5 rounded-2xl bg-gradient-to-br ${cat.color} text-white w-fit mb-6 shadow-md`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h2 className="text-xl font-black mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {cat.name}
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-8 font-medium">
                    {cat.description}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <span>{count} Tools Operational</span>
                  <div className="p-2 rounded-full bg-slate-100 dark:bg-white/5 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
