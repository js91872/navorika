'use client';

import Link from 'next/link';

interface ToolContentProps {
  title: string;
  slug: string;
  category: string;
  description: string;
  benefits?: string[];
  useCases?: string[];
  tips?: string[];
  faq?: Array<{ question: string; answer: string }>;
  intro?: string;
  howItWorks?: string;
  stepByStep?: string[];
  relatedTools?: string[];
}

export default function ToolContent({
  title,
  slug,
  category,
  description,
  benefits = [],
  useCases = [],
  tips = [],
  faq = [],
  intro,
  howItWorks,
  stepByStep = [],
  relatedTools = []
}: ToolContentProps) {
  const displayName = title || slug.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
  
  // If no SEO content, don't render anything
  const hasContent = intro || howItWorks || stepByStep.length > 0 || benefits.length > 0 || 
                     useCases.length > 0 || tips.length > 0 || faq.length > 0 || relatedTools.length > 0;
  
  if (!hasContent) {
    return null;
  }

  return (
    <div className="border-t border-[var(--border)] pt-12 space-y-10">
      {/* Introduction */}
      {intro && (
        <section>
          <h2 className="text-2xl font-bold mb-4">About {displayName}</h2>
          <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-6">
            <p className="text-[var(--muted-foreground)] leading-relaxed">{intro}</p>
          </div>
        </section>
      )}

      {/* How it Works */}
      {howItWorks && (
        <section>
          <h2 className="text-2xl font-bold mb-4">How It Works</h2>
          <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-6">
            <p className="text-[var(--muted-foreground)] leading-relaxed">{howItWorks}</p>
          </div>
        </section>
      )}

      {/* Step by Step Guide */}
      {stepByStep.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4">Step-by-Step Guide</h2>
          <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-6">
            <div className="space-y-3">
              {stepByStep.map((step, index) => (
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
      {benefits.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4">Key Benefits</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3 p-4 rounded-xl bg-[var(--card)] border border-[var(--border)]">
                <span className="text-green-500 text-xl flex-shrink-0 mt-0.5">✅</span>
                <span className="text-sm text-[var(--foreground)] leading-relaxed">{benefit}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Use Cases */}
      {useCases.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4">Common Use Cases</h2>
          <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-6">
            <ul className="space-y-3">
              {useCases.map((useCase, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-blue-500 text-lg">🎯</span>
                  <span className="text-[var(--muted-foreground)]">{useCase}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Tips */}
      {tips.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4">Tips for Best Results</h2>
          <div className="bg-amber-50 dark:bg-amber-950/20 rounded-2xl border border-amber-200 dark:border-amber-800 p-6">
            <ul className="space-y-2">
              {tips.map((tip, index) => (
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
      {relatedTools.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4">Related Tools</h2>
          <div className="flex flex-wrap gap-3">
            {relatedTools.map((toolSlug) => {
              const toolTitle = toolSlug.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase());
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
      {faq.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faq.map((item, index) => (
              <div key={index} className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-6">
                <h3 className="font-semibold text-[var(--foreground)] mb-2">{item.question}</h3>
                <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
