import Link from 'next/link';
import { ArrowRight, BookOpen, Layers } from 'lucide-react';
import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import BusinessCalculatorTool from '@/components/tools/BusinessCalculatorTool';

export default function Page() {
  return (
    <ExpansionToolPage
      category="image-tools"
      eyebrow="Print Layout & Bleed Margins"
      title="Print Bleed Calculator"
      description="Calculate required document dimensions, trim margins, total bleed area, and aspect ratio from finished print trim sizes and bleed allowances."
      slug="print-bleed-calculator"
    >
      <div className="mb-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 text-xs text-[var(--muted-foreground)] shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-medium text-[var(--foreground)]">
            <span className="inline-flex size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Prepress Geometry: Compute finished trim dimensions, bleed margins, and safe live areas</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
            <span className="text-[var(--muted-foreground)]">Workflow tools:</span>
            <Link
              href="/tools/pdf-bleed-trim-checker"
              className="inline-flex items-center gap-1 rounded-lg border border-[var(--border)] bg-[var(--background)] px-2.5 py-1 text-[var(--foreground)] transition-colors hover:border-indigo-500 hover:text-indigo-600"
            >
              <Layers className="size-3 text-indigo-500" />
              <span>PDF Bleed & Trim Checker</span>
            </Link>
            <Link
              href="/guides/print-bleed-trim-safe-area-guide"
              className="inline-flex items-center gap-1 rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-1 text-indigo-700 transition-colors hover:border-indigo-500 hover:bg-indigo-500/20 dark:text-indigo-300"
            >
              <BookOpen className="size-3" />
              <span>Bleed, Trim & Safe Area Guide</span>
              <ArrowRight className="size-3" />
            </Link>
          </div>
        </div>
      </div>
      <BusinessCalculatorTool slug="print-bleed-calculator" />
    </ExpansionToolPage>
  );
}
