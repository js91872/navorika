'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { Grid3x3 } from 'lucide-react';
import { getRelatedTools } from '@/data/taxonomy';
import { tools } from '@/data/registry';
import { getToolIcon } from '@/lib/toolIcons';
import { toolFAQs } from '@/data/faqs';
import FAQ from '@/components/ui/FAQ';

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
  
  const relatedTools = getRelatedTools(slug, 6);


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

          {/* Support content is shown only when the tool has specific FAQs or relevant links.
              Do not introduce generic claims about file handling or verified algorithms. */}
          {(faqs.length > 0 || relatedTools.length > 0) && <div className="border-t border-[#e4e4e8] dark:border-[#27272a] pt-10 mt-8 space-y-6">
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
          </div>}
        </div>
      </div>
    </>
  );
}
