'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, User, CheckCircle, ArrowRight, FileText } from 'lucide-react';
import { guidesMetadata, getGuideMetadata } from '@/lib/guidesMetadata';
import { getGuideTools } from '@/lib/guideTools';
import { getGuideContent } from '@/lib/guideContent';
import { tools } from '@/data/registry';
import { getToolIcon } from '@/lib/toolIcons';
import Schema from '@/components/seo/Schema';

export default function GuidePage() {
  const params = useParams();
  const slug = params?.slug as string;
  const guide = getGuideMetadata(slug);
  const toolSlugs = getGuideTools(slug);
  const content = getGuideContent(slug);

  if (!guide) {
    return (
      <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pt-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold">Guide Not Found</h1>
          <p className="text-[var(--muted-foreground)] mt-2">The guide you're looking for doesn't exist.</p>
          <Link href="/guides" className="inline-block mt-4 text-indigo-600 hover:underline">← Back to Guides</Link>
        </div>
      </div>
    );
  }

  const relatedTools = toolSlugs
    .map(slug => tools.find(t => t.slug === slug))
    .filter(Boolean);

  // Generate FAQ schema
  const faqSchema = content?.faqs ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": content.faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  } : null;

  return (
    <>
      {/* Schema Markup */}
      <Schema />
      {content?.schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(content.schema) }}
        />
      )}
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Link */}
          <Link href="/guides" className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors mb-8">
            <ArrowLeft className="h-4 w-4" /> Back to Guides
          </Link>

          {/* Header */}
          <div className="mb-8">
            <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full">
              {guide.category}
            </span>
            <h1 className="text-4xl font-black mt-4">{guide.title}</h1>
            <p className="text-lg text-[var(--muted-foreground)] mt-4">{guide.description}</p>
            <div className="flex items-center gap-6 mt-4 text-sm text-[var(--muted-foreground)]">
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {guide.publishedDate}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {guide.readTime}
              </span>
              <span className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {guide.author}
              </span>
            </div>
          </div>

          {/* Main Content */}
          {content ? (
            <div className="prose prose-slate dark:prose-invert max-w-none mb-12">
              <p className="text-lg text-[var(--muted-foreground)] leading-relaxed">
                {content.intro}
              </p>

              {content.sections.map((section, index) => (
                <div key={index}>
                  <h2>{section.title}</h2>
                  <div className="whitespace-pre-wrap">{section.content}</div>
                </div>
              ))}

              {/* Summary Box */}
              <div className="p-6 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 mt-8">
                <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400">Summary</h3>
                <p className="text-[var(--muted-foreground)]">{content.summary}</p>
              </div>
            </div>
          ) : (
            <div className="prose prose-slate dark:prose-invert max-w-none mb-12">
              <p className="text-[var(--muted-foreground)]">
                This guide is being updated with comprehensive content. Check back soon for the complete article.
              </p>
            </div>
          )}

          {/* FAQ Section */}
          {content?.faqs && content.faqs.length > 0 && (
            <div className="border-t border-[var(--border)] pt-12 mb-12">
              <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {content.faqs.map((faq, index) => (
                  <div key={index} className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-6">
                    <h3 className="font-semibold text-[var(--foreground)] mb-2">{faq.question}</h3>
                    <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Related Tools Section */}
          {relatedTools.length > 0 && (
            <div className="border-t border-[var(--border)] pt-12">
              <h2 className="text-2xl font-bold mb-6">Related Tools</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {relatedTools.map((tool) => {
                  const icon = getToolIcon(tool!.slug);
                  return (
                    <Link
                      key={tool!.slug}
                      href={`/tools/${tool!.slug}`}
                      className="group p-4 bg-[var(--card)] border border-[var(--border)] rounded-xl hover:border-indigo-500/40 transition-all hover:-translate-y-1 hover:shadow-lg"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{icon || '🔧'}</span>
                        <div>
                          <h3 className="font-semibold group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            {tool!.title}
                          </h3>
                          <p className="text-xs text-[var(--muted-foreground)] line-clamp-1">{tool!.description}</p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-[var(--muted-foreground)] group-hover:text-indigo-500 group-hover:translate-x-1 transition-all ml-auto flex-shrink-0" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
