'use client';

import Link from 'next/link';
import { getToolIcon } from '@/lib/toolIcons';
import { Tool } from '@/data/registry';
import { seoContent } from '@/data/seo-content';
import ToolContent from './ToolContent';

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
  
  const hasFormula = meta.formulaExplanation && meta.formulaExplanation.length > 0;

  const lastUpdated = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Get data from seo-content (primary) or use defaults
  const intro = seo?.intro || `${toolName} is a free online tool that helps you with ${meta.slug.replace('-', ' ')}. Fast, private, and no signup required.`;
  const howItWorks = seo?.howItWorks || 'This tool processes your data entirely in your browser. No data is stored or transmitted.';
  const benefits = seo?.benefits || [
    '100% free to use',
    'Complete privacy - no data uploads',
    'Instant results in your browser',
    'No signup required',
    'Works on all devices',
    'Accurate and reliable'
  ];
  const useCases = seo?.useCases || [
    'Quick and accurate calculations',
    'Professional and personal use',
    'Educational and learning purposes',
    'Planning and decision making'
  ];
  const tips = seo?.tips || [
    'For accurate results, double-check your inputs',
    'Processing happens locally for maximum privacy',
    'Works offline once the page is loaded'
  ];
  const faqItems = (seo?.faq && seo.faq.length > 0) ? seo.faq : (meta?.faq || []);
  const stepByStep = seo?.stepByStep || [];
  const relatedTools = seo?.relatedTools || [];

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

        {/* Last Updated */}
        <div className="text-xs text-[var(--muted-foreground)] mb-4">
          Last updated: {lastUpdated}
        </div>

        {/* Header with Icon and Title */}
        <div className="mb-8">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-5xl">
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

        {/* ToolContent - Enhanced SEO content */}
        <ToolContent
          title={toolName}
          slug={meta.slug}
          category={meta.category}
          description={meta.description}
          intro={intro}
          howItWorks={howItWorks}
          benefits={benefits}
          useCases={useCases}
          tips={tips}
          stepByStep={stepByStep}
          faq={faqItems}
          relatedTools={relatedTools}
        />
      </div>
    </main>
  );
}
