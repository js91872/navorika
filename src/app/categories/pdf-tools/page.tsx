import Link from 'next/link';
import { FileText, ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';
import { tools } from '@/data/registry';

export const metadata = {
  title: "PDF Tools Suite | Local Document Processors",
  description: "Merge, split, and optimize PDF file structures with zero latency. 100% device-side data privacy.",
};

export default function PDFToolsCategoryPage() {
  const pdfTools = tools.filter(t => t.category === 'pdf-tools');

  return (
    <main className="max-w-7xl mx-auto px-6 py-16 lg:px-8">
      {/* Navigation Return Link */}
      <Link href="/categories" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition mb-8">
        <ArrowLeft className="h-4 w-4" /> Back to Categories
      </Link>

      {/* Hero Header Section */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-10 mb-12">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-red-600 to-rose-600 dark:from-red-400 dark:to-rose-400 text-white shadow-md">
            <FileText className="h-7 w-7" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            PDF Tools
          </h1>
        </div>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl">
          Secure, client-side document optimization and compilation utilities running purely inside your browser workspace.
        </p>
      </div>

      {/* Grid Grid Layout Matrix of Active Utilities */}
      {pdfTools.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 text-slate-400 text-sm font-medium">
          No tools deployed under this workspace yet.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pdfTools.map((tool) => (
            <Link key={tool.slug} href={`/tools/${tool.slug}`} className="group">
              <div className="h-full p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-indigo-500/50 dark:hover:border-indigo-500/30 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/10 uppercase tracking-wider">
                      Local Utility
                    </span>
                    <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                    {tool.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 line-clamp-2">
                    {tool.description}
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-2 text-sm font-bold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform">
                  Launch Tool <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
