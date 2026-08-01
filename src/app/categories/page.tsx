import Link from 'next/link';
import { FileText, Calculator, Image as ImageIcon, HeartPulse, Code, Hammer, ArrowRight } from 'lucide-react';
import { categories } from '@/data/registry';

export const metadata = {
  title: "Browse Utility Categories | Navorika Pro",
  description: "Explore our organized workspace of fast productivity utilities and high-fidelity local calculators.",
};

const iconMap: Record<string, any> = {
  FileText,
  ImageIcon,
  Calculator,
  HeartPulse,
  Code,
  Hammer,
};

export default function CategoriesIndexPage() {
  return (
    <main className="max-w-7xl mx-auto px-6 py-16 lg:px-8">
      <div className="max-w-3xl mb-12">
        <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white sm:text-5xl">
          Utility Suite Hubs
        </h1>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
          Select a dedicated ecosystem to access our advanced local browser tool modules.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => {
          const IconComponent = iconMap[cat.icon] || FileText;
          return (
            <Link key={cat.slug} href={`/categories/${cat.slug}`} className="group">
              <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-indigo-500/50 dark:hover:border-indigo-500/30 transition-all h-full flex flex-col justify-between">
                <div>
                  <div className={`p-4 rounded-2xl bg-gradient-to-br ${cat.color} text-white w-fit shadow-md mb-6`}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                    {cat.name}
                  </h2>
                  <p className="mt-3 text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                    {cat.description}
                  </p>
                </div>
                <div className="mt-8 flex items-center gap-2 text-sm font-bold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform">
                  Explore Tools <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
