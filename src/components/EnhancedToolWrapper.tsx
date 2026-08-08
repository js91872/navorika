'use client';

import Link from 'next/link';
import { getToolIcon } from '@/lib/toolIcons';
import { getToolSEOContent } from '@/lib/toolSEOContent';
import { Tool } from '@/data/registry';

interface EnhancedToolWrapperProps {
  meta?: Tool;
  children: React.ReactNode;
}

export default function EnhancedToolWrapper({ meta, children }: EnhancedToolWrapperProps) {
  if (!meta) {
    return <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] p-8">Tool not found</div>;
  }

  const seo = getToolSEOContent(meta.slug);
  const icon = getToolIcon(meta.slug);
  const toolName = meta.title || 'Tool';

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-[var(--muted-foreground)] mb-6 flex items-center gap-2 flex-wrap">
          <Link href="/" className="hover:text-[var(--foreground)] transition-colors">Home</Link>
          <span className="text-[var(--muted-foreground)]">/</span>
          <Link href="/tools" className="hover:text-[var(--foreground)] transition-colors">Tools</Link>
          <span className="text-[var(--muted-foreground)]">/</span>
          <span className="text-[var(--foreground)] font-medium">{toolName}</span>
        </nav>

        {/* Header with Icon and Title */}
        <div className="mb-8">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-4xl">
              {icon}
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-black">{seo?.h1 || meta.title}</h1>
              {seo && (
                <p className="text-base text-[var(--muted-foreground)] mt-2 max-w-3xl leading-relaxed">
                  {seo.description}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mb-8 flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm font-medium border border-emerald-500/20">
            <span className="text-lg">🔒</span> Client-Side Processing
          </span>
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm font-medium border border-blue-500/20">
            <span className="text-lg">📁</span> No Uploads
          </span>
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-sm font-medium border border-purple-500/20">
            <span className="text-lg">🚀</span> No Signup
          </span>
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-sm font-medium border border-amber-500/20">
            <span className="text-lg">💯</span> 100% Free
          </span>
        </div>

        {/* Tool UI */}
        <div className="mb-12">
          {children}
        </div>

        {/* SEO Content Section - ORDER: About → How it Works → Benefits → FAQ → Related Tools */}
        {seo && (
          <div className="border-t border-[var(--border)] pt-12 space-y-10">
            
            {/* 1. About Section */}
            {seo.intro && (
              <section className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-8">
                <h2 className="text-2xl font-bold mb-4">About {toolName}</h2>
                <p className="text-[var(--muted-foreground)] leading-relaxed text-base">
                  {seo.intro}
                </p>
              </section>
            )}

            {/* 2. How it Works */}
            {meta.formulaExplanation && (
              <section>
                <h2 className="text-2xl font-bold mb-4">How it Works</h2>
                <div className="bg-[var(--card)] p-6 rounded-2xl border border-[var(--border)]">
                  <p className="text-[var(--muted-foreground)] leading-relaxed">
                    {meta.formulaExplanation}
                  </p>
                </div>
              </section>
            )}

            {/* 3. Benefits */}
            {seo.benefits && seo.benefits.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-4">Key Benefits</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {seo.benefits.map((benefit, index) => (
                    <div 
                      key={index} 
                      className="flex items-start gap-3 p-4 rounded-xl bg-[var(--card)] border border-[var(--border)] hover:border-indigo-500/40 transition-colors"
                    >
                      <span className="text-green-500 text-xl flex-shrink-0 mt-0.5">✅</span>
                      <span className="text-sm text-[var(--foreground)] leading-relaxed">{benefit}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 4. FAQ Section */}
            {meta.faq && meta.faq.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
                <div className="space-y-4">
                  {meta.faq.map((item, idx) => (
                    <div key={idx} className="bg-[var(--card)] p-6 rounded-2xl border border-[var(--border)]">
                      <h3 className="font-semibold text-[var(--foreground)] mb-2">{item.question}</h3>
                      <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">{item.answer}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 5. Related Tools */}
            {seo.relatedTools && seo.relatedTools.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-4">Related Tools You Might Like</h2>
                <div className="flex flex-wrap gap-3">
                  {seo.relatedTools.map((slug) => {
                    const { tools } = require('@/data/registry');
                    const tool = tools.find((t: any) => t.slug === slug);
                    if (!tool) return null;
                    return (
                      <Link
                        key={slug}
                        href={`/tools/${slug}`}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--card)] hover:bg-[var(--muted)] text-[var(--foreground)] hover:text-indigo-600 dark:hover:text-indigo-400 transition-all text-sm border border-[var(--border)] hover:border-indigo-500/40 shadow-sm hover:shadow-md"
                      >
                        <span className="text-xl">{getToolIcon(slug)}</span>
                        {tool.title}
                      </Link>
                    );
                  })}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
