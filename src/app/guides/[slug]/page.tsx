'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Clock, Calendar, Tag, BookOpen } from 'lucide-react';
import { getGuideBySlug } from '@/data/guides';
import { useState, useEffect } from 'react';

export default function GuidePage() {
  const params = useParams();
  const slug = params?.slug as string;
  const guide = getGuideBySlug(slug);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!guide) {
    return (
      <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pt-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-6">
            <BookOpen className="h-16 w-16 text-[var(--muted-foreground)] mx-auto" />
          </div>
          <h1 className="text-3xl font-bold">Guide Not Found</h1>
          <p className="text-[var(--muted-foreground)] mt-2">The guide you're looking for doesn't exist.</p>
          <Link href="/guides" className="inline-block mt-6 text-indigo-600 hover:underline">
            ← Back to Guides
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  // Split content into paragraphs and filter out empty ones
  const paragraphs = guide.content.split('\n\n').filter(p => p.trim());

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/guides" className="inline-flex items-center gap-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to Guides
        </Link>

        <article>
          {/* Header – Title rendered once */}
          <header className="mb-8">
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-${guide.category}-500/10 text-${guide.category}-600 dark:text-${guide.category}-400`}>
                {guide.category}
              </span>
              <span className="flex items-center gap-1 text-sm text-[var(--muted-foreground)]">
                <Clock className="h-4 w-4" /> {guide.readTime} min read
              </span>
              <span className="flex items-center gap-1 text-sm text-[var(--muted-foreground)]">
                <Calendar className="h-4 w-4" /> {mounted ? formatDate(guide.date) : ''}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-4">
              {guide.title}
            </h1>
            <p className="text-lg text-[var(--muted-foreground)]">{guide.description}</p>
            <div className="flex flex-wrap gap-2 mt-4">
              {guide.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 rounded-full bg-[var(--muted)] text-xs text-[var(--muted-foreground)]">
                  <Tag className="h-3 w-3 inline mr-1" /> {tag}
                </span>
              ))}
            </div>
          </header>

          {/* Content – Skip first heading if it matches the title */}
          <div className="prose prose-slate dark:prose-invert max-w-none">
            {paragraphs.map((paragraph, index) => {
              // Skip the main title heading (starts with "# " and matches the title)
              if (paragraph.startsWith('# ') && paragraph.replace('# ', '').trim() === guide.title) {
                return null;
              }
              // Skip secondary title heading if it's just the title
              if (paragraph.startsWith('## ') && paragraph.replace('## ', '').trim() === guide.title) {
                return null;
              }

              // Handle headings
              if (paragraph.startsWith('# ')) {
                return <h1 key={index} className="text-3xl font-bold mt-8 mb-4">{paragraph.replace('# ', '')}</h1>;
              }
              if (paragraph.startsWith('## ')) {
                return <h2 key={index} className="text-2xl font-bold mt-8 mb-4">{paragraph.replace('## ', '')}</h2>;
              }
              if (paragraph.startsWith('### ')) {
                return <h3 key={index} className="text-xl font-bold mt-6 mb-3">{paragraph.replace('### ', '')}</h3>;
              }

              // Handle bullet lists
              if (paragraph.includes('\n') && (paragraph.includes('•') || paragraph.includes('-'))) {
                const items = paragraph.split('\n').filter(line => line.trim().startsWith('•') || line.trim().startsWith('-'));
                if (items.length > 0) {
                  return (
                    <ul key={index} className="list-disc pl-6 space-y-2 my-4">
                      {items.map((item, i) => (
                        <li key={i} className="text-[var(--muted-foreground)]">{item.replace(/[•-]\s*/, '')}</li>
                      ))}
                    </ul>
                  );
                }
              }

              // Regular paragraph
              return <p key={index} className="text-[var(--muted-foreground)] leading-relaxed mb-4">{paragraph}</p>;
            })}
          </div>

          <div className="mt-12 pt-8 border-t border-[var(--border)]">
            <Link href="/guides" className="inline-flex items-center gap-2 text-indigo-600 hover:underline">
              <ArrowLeft className="h-4 w-4" /> Browse all guides
            </Link>
          </div>
        </article>
      </div>
    </div>
  );
}
