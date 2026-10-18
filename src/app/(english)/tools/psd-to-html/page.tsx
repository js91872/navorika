import Link from 'next/link';
import { ArrowRight, BookOpen, Code2, Mail, Smartphone } from 'lucide-react';
import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import PsdToHtmlTool from '@/components/tools/PsdToHtmlTool';

export default function PsdToHtmlPage() {
  return (
    <ExpansionToolPage
      category="developer-tools"
      eyebrow="Design Handoff & Code Generator"
      title="PSD to HTML Converter"
      description="Inspect PSD mockups, verify color space and canvas dimensions, generate clean semantic HTML5/CSS flexbox templates or responsive email code, and export developer-ready handoff briefs."
      slug="psd-to-html"
    >
      {/* Above-the-fold workflow helper bar */}
      <div className="mb-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 text-xs text-[var(--muted-foreground)] shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-medium text-[var(--foreground)]">
            <span className="inline-flex size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>100% Client-Side: Zero server uploads, local binary header inspection &amp; responsive scaffolding</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
            <span className="text-[var(--muted-foreground)]">Workflow guides:</span>
            <Link
              href="/guides/psd-to-html-conversion-guide"
              className="inline-flex items-center gap-1 rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-1 text-indigo-700 transition-colors hover:border-indigo-500 hover:bg-indigo-500/20 dark:text-indigo-300"
            >
              <BookOpen className="size-3" />
              <span>Conversion Guide</span>
            </Link>
            <Link
              href="/guides/psd-to-responsive-html"
              className="inline-flex items-center gap-1 rounded-lg border border-[var(--border)] bg-[var(--background)] px-2.5 py-1 text-[var(--foreground)] transition-colors hover:border-indigo-500 hover:text-indigo-600"
            >
              <Smartphone className="size-3 text-indigo-500" />
              <span>Responsive HTML</span>
            </Link>
            <Link
              href="/guides/psd-to-html-email"
              className="inline-flex items-center gap-1 rounded-lg border border-[var(--border)] bg-[var(--background)] px-2.5 py-1 text-[var(--foreground)] transition-colors hover:border-indigo-500 hover:text-indigo-600"
            >
              <Mail className="size-3 text-indigo-500" />
              <span>HTML Email</span>
            </Link>
            <Link
              href="/tools/css-flexbox-generator"
              className="inline-flex items-center gap-1 rounded-lg border border-[var(--border)] bg-[var(--background)] px-2.5 py-1 text-[var(--foreground)] transition-colors hover:border-indigo-500 hover:text-indigo-600"
            >
              <Code2 className="size-3 text-indigo-500" />
              <span>CSS Flexbox</span>
              <ArrowRight className="size-3" />
            </Link>
          </div>
        </div>
      </div>

      <PsdToHtmlTool />
    </ExpansionToolPage>
  );
}
