import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { tools } from '@/data/registry';

export const metadata = {
  title: "Construction Calculators | Navorika Pro",
  description: "Advanced local utilities deployed within the Construction Calculators workspace.",
};

export default function CategoryPage() {
  const targetTools = tools.filter(t => t.category === 'construction-calculators');

  return (
    <main className="max-w-7xl mx-auto px-6 py-16 lg:px-8">
      <Link href="/categories" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-600 transition mb-8">
        <ArrowLeft className="h-4 w-4" /> Back to Categories
      </Link>
      <div className="border-b border-slate-200 dark:border-slate-800 pb-8 mb-12">
        <h1 className="text-4xl font-black text-slate-900 dark:text-white">Construction Calculators</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">Zero-latency tools executing privately on your local machine.</p>
      </div>

      {targetTools.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 text-slate-400 text-sm font-medium">
          No utilities deployed under this workspace yet. Ready for additions.
        </div>
      ) : (
        <div className="grid sm:grid-cols-3 gap-6">
          {/* Active tools render here dynamically */}
        </div>
      )}
    </main>
  );
}
