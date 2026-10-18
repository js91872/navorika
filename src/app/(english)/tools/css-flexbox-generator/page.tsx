import Link from 'next/link';
import { ArrowRight, Code2, Layers, Sparkles, Type } from 'lucide-react';
import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import CssFlexboxGenerator from '@/components/tools/CssFlexboxGenerator';

export default function CssFlexboxGeneratorPage() {
  return (
    <ExpansionToolPage
      category="developer-tools"
      eyebrow="Visual CSS Layout Builder"
      title="CSS Flexbox Generator"
      description="Build, test, and preview responsive CSS Flexbox layouts with real-time visual controls. Adjust direction, alignment, wrapping, and modern gap spacing—then copy clean, production-ready CSS instantly into your stylesheets."
      slug="css-flexbox-generator"
    >
      {/* Above-the-fold workflow helper bar */}
      <div className="mb-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 text-xs text-[var(--muted-foreground)] shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-medium text-[var(--foreground)]">
            <span className="inline-flex size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Interactive Flexbox Playground: Instant CSS generation & live preview</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
            <span className="text-[var(--muted-foreground)]">Pair with:</span>
            <Link
              href="/tools/css-clamp-font-generator"
              className="inline-flex items-center gap-1 rounded-lg border border-[var(--border)] bg-[var(--background)] px-2.5 py-1 text-[var(--foreground)] transition-colors hover:border-indigo-500 hover:text-indigo-600"
            >
              <Type className="size-3 text-indigo-500" />
              <span>Fluid Typography</span>
            </Link>
            <Link
              href="/tools/aspect-ratio-padding-calculator"
              className="inline-flex items-center gap-1 rounded-lg border border-[var(--border)] bg-[var(--background)] px-2.5 py-1 text-[var(--foreground)] transition-colors hover:border-indigo-500 hover:text-indigo-600"
            >
              <Layers className="size-3 text-indigo-500" />
              <span>Aspect Ratio</span>
            </Link>
            <Link
              href="/tools/css-gradient-generator"
              className="inline-flex items-center gap-1 rounded-lg border border-[var(--border)] bg-[var(--background)] px-2.5 py-1 text-[var(--foreground)] transition-colors hover:border-indigo-500 hover:text-indigo-600"
            >
              <Sparkles className="size-3 text-indigo-500" />
              <span>CSS Gradients</span>
            </Link>
            <Link
              href="/tools/psd-to-html"
              className="inline-flex items-center gap-1 rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-1 text-indigo-700 transition-colors hover:border-indigo-500 hover:bg-indigo-500/20 dark:text-indigo-300"
            >
              <Code2 className="size-3" />
              <span>PSD to HTML</span>
              <ArrowRight className="size-3" />
            </Link>
          </div>
        </div>
      </div>

      <CssFlexboxGenerator />
    </ExpansionToolPage>
  );
}
