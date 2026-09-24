import Link from 'next/link';
import { ArrowRight, BookOpen, Eye, FileCode, FileImage, Layers } from 'lucide-react';
import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import CorelServerTool from '@/components/tools/coreldraw/CorelServerTool';
import { corelServerConfigs } from '@/components/tools/coreldraw/configs';

export default function Page() {
  return (
    <ExpansionToolPage
      category="developer-tools"
      eyebrow="CorelDRAW Document Bridge"
      title="PDF to CDR Converter"
      description="Convert and prepare PDF artwork for CorelDRAW. Generate verified multipage PDF, clean first-page SVG vector paths, or EPS interchange files ready to import and save as CDR."
    >
      {/* Above-the-fold workflow helper bar */}
      <div className="mb-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 text-xs text-[var(--muted-foreground)] shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-medium text-[var(--foreground)]">
            <span className="inline-flex size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Multi-Page Vector Bridge: Retains vector hierarchy and fonts for native CorelDRAW import</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
            <span className="text-[var(--muted-foreground)]">Related tools:</span>
            <Link
              href="/tools/cdr-viewer"
              className="inline-flex items-center gap-1 rounded-lg border border-[var(--border)] bg-[var(--background)] px-2.5 py-1 text-[var(--foreground)] transition-colors hover:border-indigo-500 hover:text-indigo-600"
            >
              <Eye className="size-3 text-indigo-500" />
              <span>CDR Viewer</span>
            </Link>
            <Link
              href="/tools/png-to-cdr-converter"
              className="inline-flex items-center gap-1 rounded-lg border border-[var(--border)] bg-[var(--background)] px-2.5 py-1 text-[var(--foreground)] transition-colors hover:border-indigo-500 hover:text-indigo-600"
            >
              <FileImage className="size-3 text-indigo-500" />
              <span>PNG to CDR</span>
            </Link>
            <Link
              href="/tools/svg-dimensions-checker"
              className="inline-flex items-center gap-1 rounded-lg border border-[var(--border)] bg-[var(--background)] px-2.5 py-1 text-[var(--foreground)] transition-colors hover:border-indigo-500 hover:text-indigo-600"
            >
              <Layers className="size-3 text-indigo-500" />
              <span>SVG Dimensions</span>
            </Link>
            <Link
              href="/guides/pdf-to-cdr-editing-guide"
              className="inline-flex items-center gap-1 rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-1 text-indigo-700 transition-colors hover:border-indigo-500 hover:bg-indigo-500/20 dark:text-indigo-300"
            >
              <BookOpen className="size-3" />
              <span>PDF to CDR Guide</span>
              <ArrowRight className="size-3" />
            </Link>
          </div>
        </div>
      </div>

      <CorelServerTool config={corelServerConfigs.pdf} />

      {/* Compact Above-the-Fold Workflow Strip */}
      <div className="mx-auto mt-6 max-w-5xl rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 text-center text-xs text-[var(--muted-foreground)]">
        <div className="flex flex-wrap items-center justify-center gap-1.5 font-medium text-[var(--foreground)] sm:gap-2">
          <span>PDF</span>
          <span className="text-[var(--muted-foreground)]">→</span>
          <span>Choose PDF / SVG / EPS</span>
          <span className="text-[var(--muted-foreground)]">→</span>
          <span>Import into CorelDRAW</span>
          <span className="text-[var(--muted-foreground)]">→</span>
          <span>Inspect Fonts &amp; Vectors</span>
          <span className="text-[var(--muted-foreground)]">→</span>
          <span>Save As CDR</span>
        </div>
        <p className="mt-2 text-[var(--muted-foreground)]">
          Navorika does not generate a native CDR file. It creates CorelDRAW-ready PDF, SVG, or EPS output that you can import into CorelDRAW and save as CDR.
        </p>
      </div>
    </ExpansionToolPage>
  );
}
