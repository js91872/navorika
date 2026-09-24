import Link from 'next/link';
import { ArrowRight, Code2, FileCode, Layers, Sliders } from 'lucide-react';
import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import SvgDimensionsTool from '@/components/tools/SvgDimensionsTool';

export default function Page() {
  return (
    <ExpansionToolPage
      category="image-tools"
      eyebrow="Vector ViewBox & Dimensions Preflight"
      title="SVG Dimensions Checker"
      description="Inspect width, height, viewBox coordinate systems, aspect ratio, and declared physical CSS units (px, pt, mm, in) in SVG vector graphics without script execution or rasterization."
      slug="svg-dimensions-checker"
    >
      {/* Above-the-fold workflow helper bar */}
      <div className="mb-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 text-xs text-[var(--muted-foreground)] shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-medium text-[var(--foreground)]">
            <span className="inline-flex size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Secure Vector Preflight: Strips scripts and evaluates responsive viewBox geometry</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
            <span className="text-[var(--muted-foreground)]">Workflow tools:</span>
            <Link
              href="/tools/psd-to-html"
              className="inline-flex items-center gap-1 rounded-lg border border-[var(--border)] bg-[var(--background)] px-2.5 py-1 text-[var(--foreground)] transition-colors hover:border-indigo-500 hover:text-indigo-600"
            >
              <Code2 className="size-3 text-indigo-500" />
              <span>PSD to HTML Icon Slicing</span>
            </Link>
            <Link
              href="/tools/css-flexbox-generator"
              className="inline-flex items-center gap-1 rounded-lg border border-[var(--border)] bg-[var(--background)] px-2.5 py-1 text-[var(--foreground)] transition-colors hover:border-indigo-500 hover:text-indigo-600"
            >
              <Sliders className="size-3 text-indigo-500" />
              <span>Flexbox Container Layout</span>
            </Link>
            <Link
              href="/tools/svg-to-cdr-converter"
              className="inline-flex items-center gap-1 rounded-lg border border-[var(--border)] bg-[var(--background)] px-2.5 py-1 text-[var(--foreground)] transition-colors hover:border-indigo-500 hover:text-indigo-600"
            >
              <Layers className="size-3 text-indigo-500" />
              <span>SVG to CorelDRAW</span>
            </Link>
            <Link
              href="/tools/svg-to-png"
              className="inline-flex items-center gap-1 rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-1 text-indigo-700 transition-colors hover:border-indigo-500 hover:bg-indigo-500/20 dark:text-indigo-300"
            >
              <FileCode className="size-3" />
              <span>SVG to PNG Rasterizer</span>
              <ArrowRight className="size-3" />
            </Link>
          </div>
        </div>
      </div>

      <SvgDimensionsTool />
    </ExpansionToolPage>
  );
}
