import type { Metadata } from 'next';
import Link from 'next/link';
import { Grid3x3, ArrowRight } from 'lucide-react';
import { categories, tools } from '@/data/registry';
import { toolsUnderReview } from '@/lib/seo/toolReview';

export const metadata: Metadata = {
  title: 'All Tool Categories – Browse Free Online Tools',
  description: 'Explore free online tools organized by category: PDF, image, calculators, finance, construction, developer utilities, and everyday tools.',
  alternates: { canonical: 'https://navorika.com/categories' },
};

export default function CategoriesPage() {
  const activeTools = tools.filter((tool) => !toolsUnderReview.has(tool.slug));

  return (
    <div className="pb-16 pt-8 text-[#18181b] dark:text-[#f4f4f5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-xl bg-[#fff1f1] dark:bg-[#e5322d]/10 text-[#e5322d]">
              <Grid3x3 className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#18181b] dark:text-white">
                Tool Categories
              </h1>
              <p className="text-[#5b5b63] dark:text-[#a1a1aa] text-sm mt-0.5">
                {categories.length} categories · {activeTools.length} free online tools
              </p>
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {categories.map((category) => {
            const count = activeTools.filter((t) => t.category === category.slug).length;

            return (
              <Link
                key={category.slug}
                href={`/categories/${category.slug}`}
                className="group flex flex-col justify-between p-5 rounded-xl bg-white dark:bg-[#18181b] border border-[#e4e4e8] dark:border-[#27272a] hover:border-[#e5322d] hover:shadow-md transition-all duration-150 min-h-[160px]"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-xs font-bold text-[#e5322d] bg-[#fff1f1] dark:bg-[#e5322d]/10 px-2 py-0.5 rounded-md">
                      {count} {count === 1 ? 'tool' : 'tools'}
                    </span>
                    <span className="text-[#5b5b63] dark:text-[#a1a1aa] group-hover:text-[#e5322d] group-hover:translate-x-0.5 transition-all">
                      →
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-[#18181b] dark:text-white group-hover:text-[#e5322d] transition-colors leading-snug">
                    {category.name}
                  </h2>
                  <p className="text-sm text-[#5b5b63] dark:text-[#a1a1aa] mt-1.5 leading-relaxed line-clamp-2">
                    {category.description}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#e4e4e8] dark:border-[#27272a]/60 flex items-center justify-between text-xs font-semibold text-[#e5322d]">
                  <span>Explore category</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Information Callout */}
        <section className="mt-12 rounded-xl border border-[#e4e4e8] dark:border-[#27272a] bg-white dark:bg-[#18181b] p-6 sm:p-8 shadow-xs">
          <h2 className="text-xl font-bold text-[#18181b] dark:text-white mb-2">
            Choosing the right tool
          </h2>
          <div className="grid gap-4 text-sm leading-relaxed text-[#5b5b63] dark:text-[#a1a1aa] md:grid-cols-2">
            <p>
              Use PDF and image tools for daily document and image tasks such as compressing, resizing, converting, and merging. Construction and everyday calculators help calculate material takeoffs, financial estimates, health screening formulas, and unit conversions.
            </p>
            <p>
              Developer tools process JSON, YAML, Base64, regular expressions, and tokens locally in your browser. Choose any category above to see the complete list of tools, related workflow toolkits, and helpful guides.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
