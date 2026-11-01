'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { BookOpen, Lightbulb, CheckCircle, AlertCircle, Grid3x3 } from 'lucide-react';
import { tools } from '@/data/registry';
import { getToolIcon } from '@/lib/toolIcons';
import { toolFAQs } from '@/data/faqs';
import FAQ from '@/components/ui/FAQ';
import { toolsUnderReview } from '@/lib/seo/toolReview';

interface ToolSEOWrapperProps {
  slug: string;
  children: ReactNode;
}

export default function ToolSEOWrapper({ slug, children }: ToolSEOWrapperProps) {
  const tool = tools.find(t => t.slug === slug);
  const faqs = toolFAQs[slug] || [];
  const icon = getToolIcon(slug);

  if (!tool) {
    return <>{children}</>;
  }

  const categoryName = tool.category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  
  const relatedTools = tools
    .filter(t => t.category === tool.category && t.slug !== tool.slug && !toolsUnderReview.has(t.slug))
    .slice(0, 6);

  const content = {
    advantages: [
      'Free with no hidden fees or subscriptions',
      'Processes directly in your browser — your files stay on your device',
      'No account, signup, or software installation needed',
      'Accurate calculations and immediate results',
      'Works across desktop, tablet, and mobile devices',
    ],
    limitations: [
      'Requires a modern web browser with JavaScript enabled',
      'Browser memory limits apply to very large files',
      'Results are based directly on the numbers and inputs provided',
    ],
  };

  return (
    <>
      <div className="pb-16 pt-8 text-[#18181b] dark:text-[#f4f4f5]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tool Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3.5 mb-2">
              <span className="grid size-12 place-items-center rounded-xl bg-[#fff1f1] dark:bg-[#e5322d]/10 text-2xl text-[#e5322d] shrink-0" aria-hidden="true">{icon}</span>
              <div>
                <h1 className="text-3xl sm:text-4xl font-black text-[#18181b] dark:text-white tracking-tight">{tool.title}</h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#5b5b63] dark:text-[#a1a1aa] bg-[#f0f0f2] dark:bg-[#202023] px-2.5 py-0.5 rounded-md">
                    {categoryName}
                  </span>
                </div>
              </div>
            </div>
            <p className="text-[#5b5b63] dark:text-[#a1a1aa] text-base leading-relaxed mt-2">{tool.description}</p>
          </div>

          {/* Tool UI */}
          <div className="mb-10">
            {children}
          </div>

          {/* SEO Content */}
          <div className="border-t border-[#e4e4e8] dark:border-[#27272a] pt-10 mt-8 space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-[#18181b] dark:text-white">About This Tool</h2>

            <div className="p-5 rounded-xl bg-white dark:bg-[#18181b] border border-[#e4e4e8] dark:border-[#27272a] shadow-xs">
              <h3 className="text-base font-bold text-[#18181b] dark:text-white mb-2 flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-[#e5322d]" />
                What is this tool?
              </h3>
              <p className="text-sm text-[#5b5b63] dark:text-[#a1a1aa] leading-relaxed">
                {tool.title} is a free online {categoryName.toLowerCase()} tool to help you complete tasks
                quickly. Where technically possible, processing runs locally on your device without transmitting data.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-white dark:bg-[#18181b] border border-[#e4e4e8] dark:border-[#27272a] shadow-xs">
              <h3 className="text-base font-bold text-[#18181b] dark:text-white mb-2 flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-amber-500" />
                How it works
              </h3>
              <p className="text-sm text-[#5b5b63] dark:text-[#a1a1aa] leading-relaxed">
                This tool applies verified formulas and standard file algorithms. Browser-based calculations
                run entirely within your browser session so you get immediate results without waiting.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-white dark:bg-[#18181b] border border-[#e4e4e8] dark:border-[#27272a] shadow-xs">
              <h3 className="text-base font-bold text-[#18181b] dark:text-white mb-2.5 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-600" />
                Advantages
              </h3>
              <ul className="space-y-1.5 text-xs sm:text-sm text-[#5b5b63] dark:text-[#a1a1aa]">
                {content.advantages.map((advantage, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-3.5 w-3.5 text-emerald-600 mt-1 shrink-0" />
                    <span>{advantage}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-5 rounded-xl border border-amber-500/25 bg-amber-500/5">
              <h3 className="text-base font-bold text-[#18181b] dark:text-white mb-2.5 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                Limitations
              </h3>
              <ul className="space-y-1.5 text-xs sm:text-sm text-[#5b5b63] dark:text-[#a1a1aa]">
                {content.limitations.map((limitation, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <AlertCircle className="h-3.5 w-3.5 text-amber-600 mt-1 shrink-0" />
                    <span>{limitation}</span>
                  </li>
                ))}
              </ul>
            </div>

            {faqs.length > 0 && <FAQ items={faqs} />}

            {relatedTools.length > 0 && (
              <div className="p-5 rounded-xl bg-white dark:bg-[#18181b] border border-[#e4e4e8] dark:border-[#27272a]">
                <h3 className="text-base font-bold text-[#18181b] dark:text-white mb-3 flex items-center gap-2">
                  <Grid3x3 className="h-4 w-4 text-[#e5322d]" />
                  Related Tools
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {relatedTools.map((relatedTool) => (
                    <Link
                      key={relatedTool.slug}
                      href={`/tools/${relatedTool.slug}`}
                      className="p-2.5 rounded-lg border border-[#e4e4e8] dark:border-[#27272a] bg-[#f7f7f8] dark:bg-[#202023] hover:border-[#e5322d] hover:text-[#e5322d] transition-colors text-xs font-semibold text-[#18181b] dark:text-white flex items-center gap-2"
                    >
                      <span>{getToolIcon(relatedTool.slug)}</span>
                      <span className="line-clamp-1">{relatedTool.title}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
