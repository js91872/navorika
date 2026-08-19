'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { BookOpen, Lightbulb, CheckCircle, AlertCircle, Sparkles, Grid3x3 } from 'lucide-react';
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
      'Completely free with no hidden charges',
      '100% client-side — your data stays private',
      'No signup, no installation, no plugins required',
      'Instant results with high accuracy',
      'Works on all devices and browsers',
    ],
    limitations: [
      'Requires a modern browser with JavaScript enabled',
      'Limited to the capabilities of client-side JavaScript',
      'Results are based on the data provided by the user',
    ],
  };

  return (
    <>
      <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tool Header */}
          <div className="mb-6 pt-24">
            <div className="flex items-center gap-4 mb-3">
              <span className="text-5xl">{icon}</span>
              <div>
                <h1 className="text-3xl sm:text-4xl font-black">{tool.title}</h1>
                <div className="flex items-center gap-3 mt-1 flex-wrap">
                  <span className="text-xs font-medium uppercase tracking-wider text-[var(--muted-foreground)] bg-[var(--muted)] px-3 py-1 rounded-full">
                    {categoryName}
                  </span>
                  <span className="text-xs text-[var(--muted-foreground)] flex items-center gap-1">
                    <Sparkles className="h-3 w-3 text-amber-500" /> Free Online Tool
                  </span>
                </div>
              </div>
            </div>
            <p className="text-[var(--muted-foreground)] text-lg leading-relaxed">{tool.description}</p>
          </div>

          {/* Tool UI */}
          <div className="mb-12">
            {children}
          </div>

          {/* SEO Content */}
          <div className="border-t border-[var(--border)] pt-12 mt-8">
            <h2 className="text-2xl font-bold mb-6">About This Tool</h2>

            <div className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] mb-6">
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-indigo-500" />
                What is this tool?
              </h3>
              <p className="text-[var(--muted-foreground)] leading-relaxed">
                {tool.title} is a free online {categoryName.toLowerCase()} tool that helps you perform tasks
                quickly and efficiently. All processing happens locally in your browser, ensuring your data
                remains private and secure. No signup, no uploads, and completely free.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] mb-6">
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-amber-500" />
                How it works
              </h3>
              <p className="text-[var(--muted-foreground)] leading-relaxed">
                This tool uses standard formulas and logic to provide accurate results.
                All processing is performed in your browser using JavaScript, with no server
                communication. Your data never leaves your device.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] mb-6">
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-emerald-500" />
                Advantages
              </h3>
              <ul className="space-y-2 text-[var(--muted-foreground)]">
                {content.advantages.map((advantage, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-500 mt-1 shrink-0" />
                    <span>{advantage}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] mb-6">
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-amber-500" />
                Limitations
              </h3>
              <ul className="space-y-2 text-[var(--muted-foreground)]">
                {content.limitations.map((limitation, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-amber-500 mt-1 shrink-0" />
                    <span>{limitation}</span>
                  </li>
                ))}
              </ul>
            </div>

            {faqs.length > 0 && <FAQ items={faqs} />}

            {relatedTools.length > 0 && (
              <div className="mt-8 p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)]">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Grid3x3 className="h-5 w-5 text-indigo-500" />
                  Related Tools
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {relatedTools.map((relatedTool) => (
                    <Link
                      key={relatedTool.slug}
                      href={`/tools/${relatedTool.slug}`}
                      className="p-3 rounded-xl bg-[var(--muted)] hover:bg-[var(--muted)]/80 transition-colors text-[var(--muted-foreground)] hover:text-[var(--foreground)] flex items-center gap-2"
                    >
                      <span>{getToolIcon(relatedTool.slug)}</span>
                      {relatedTool.title}
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
