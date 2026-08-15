'use client';

import Link from 'next/link';
import { getToolIcon } from '@/lib/toolIcons';
import { Tool } from '@/data/registry';
import { seoContent } from '@/data/seo-content';

interface EnhancedToolWrapperProps {
  meta?: Tool;
  children: React.ReactNode;
}

export default function EnhancedToolWrapper({ meta, children }: EnhancedToolWrapperProps) {
  if (!meta) {
    return <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] p-8">Tool not found</div>;
  }

  const icon = getToolIcon(meta.slug);
  const toolName = meta.title || 'Tool';
  const seo = seoContent[meta.slug];
  const hasFaq = meta.faq && meta.faq.length > 0;
  const hasFormula = meta.formulaExplanation && meta.formulaExplanation.length > 0;

  // Last updated date - you can make this dynamic
  const lastUpdated = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

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

        {/* Last Updated - NEW */}
        <div className="text-xs text-[var(--muted-foreground)] mb-4">
          Last updated: {lastUpdated}
        </div>

        {/* Header with Icon and Title */}
        <div className="mb-8">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-4xl">
              {icon}
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-black">{meta.heroTitle || meta.title}</h1>
              {meta.heroDescription && (
                <p className="text-base text-[var(--muted-foreground)] mt-2 max-w-3xl leading-relaxed">
                  {meta.heroDescription}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mb-8 flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm font-medium border border-emerald-500/20">
            <span className="text-lg">🔒</span> Private by Design
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

        {/* SEO Content Section */}
        <div className="border-t border-[var(--border)] pt-12 space-y-10">
          
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-bold mb-4">About {toolName}</h2>
            <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-6">
              <p className="text-[var(--muted-foreground)] leading-relaxed">
                {seo?.intro || `${toolName} is a free online tool that helps you with ${meta.slug.replace('-', ' ')}. Fast, private, and no signup required.`}
              </p>
            </div>
          </section>

          {/* How it Works */}
          <section>
            <h2 className="text-2xl font-bold mb-4">How It Works</h2>
            <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-6">
              <p className="text-[var(--muted-foreground)] leading-relaxed">
                {seo?.howItWorks || 'This tool processes your data entirely in your browser. No data is stored or transmitted.'}
              </p>
              {hasFormula && meta.formulaExplanation && (
                <div className="mt-4 space-y-2">
                  {meta.formulaExplanation.split('\n').filter((step: string) => step.trim()).map((step: string, index: number) => (
                    <div key={index} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </span>
                      <p className="text-sm text-[var(--muted-foreground)]">{step.replace(/^\d+\.\s*/, '')}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Step by Step Guide */}
          {seo?.stepByStep && seo.stepByStep.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-4">Step-by-Step Guide</h2>
              <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-6">
                <div className="space-y-3">
                  {seo.stepByStep.map((step: string, index: number) => (
                    <div key={index} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </span>
                      <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Benefits */}
          {seo?.benefits && seo.benefits.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-4">Key Benefits</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {seo.benefits.map((benefit: string, index: number) => (
                  <div key={index} className="flex items-start gap-3 p-4 rounded-xl bg-[var(--card)] border border-[var(--border)]">
                    <span className="text-green-500 text-xl flex-shrink-0 mt-0.5">✅</span>
                    <span className="text-sm text-[var(--foreground)] leading-relaxed">{benefit}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Use Cases */}
          {seo?.useCases && seo.useCases.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-4">Common Use Cases</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {seo.useCases.map((useCase: string, index: number) => (
                  <div key={index} className="flex items-start gap-3 p-4 rounded-xl bg-[var(--card)] border border-[var(--border)]">
                    <span className="text-blue-500 text-xl flex-shrink-0 mt-0.5">🎯</span>
                    <span className="text-sm text-[var(--foreground)] leading-relaxed">{useCase}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Tips */}
          {seo?.tips && seo.tips.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-4">Tips for Best Results</h2>
              <div className="bg-amber-50 dark:bg-amber-950/20 rounded-2xl border border-amber-200 dark:border-amber-800 p-6">
                <ul className="space-y-2">
                  {seo.tips.map((tip: string, index: number) => (
                    <li key={index} className="flex items-start gap-3 text-sm text-amber-700 dark:text-amber-400">
                      <span className="text-amber-500">💡</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )}

          {/* Related Tools */}
          {seo?.relatedTools && seo.relatedTools.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-4">Related Tools</h2>
              <div className="flex flex-wrap gap-3">
                {seo.relatedTools.map((toolSlug: string) => {
                  const toolTitle = toolSlug.replace('-', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
                  return (
                    <Link
                      key={toolSlug}
                      href={`/tools/${toolSlug}`}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--card)] border border-[var(--border)] hover:border-indigo-500/40 hover:bg-[var(--muted)] transition-all text-sm"
                    >
                      <span>🔗</span>
                      {toolTitle}
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          {/* FAQ Section */}
          {hasFaq && meta.faq && (
            <section>
              <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {meta.faq.map((item: { question: string; answer: string }, idx: number) => (
                  <div key={idx} className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-6">
                    <h3 className="font-semibold text-[var(--foreground)] mb-2">{item.question}</h3>
                    <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">{item.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}
