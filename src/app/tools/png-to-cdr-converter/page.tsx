import Link from 'next/link';
import { ArrowRight, BookOpen, Eye, FileImage, Layers } from 'lucide-react';
import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import RasterToCorelTool from '@/components/tools/coreldraw/RasterToCorelTool';

export default function Page() {
  return (
    <ExpansionToolPage
      category="developer-tools"
      eyebrow="Browser-Local CorelDRAW Workflow"
      title="PNG to CDR Converter"
      description="Convert PNG images for CorelDRAW entirely in your browser with zero server uploads. Choose Preserve Mode for transparent raster placement in layouts, or Vectorize Mode to trace logos, stamps, and icons into editable vector paths ready to import and save as CDR."
    >
      {/* Above-the-fold workflow helper bar */}
      <div className="mb-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 text-xs text-[var(--muted-foreground)] shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-medium text-[var(--foreground)]">
            <span className="inline-flex size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>100% Client-Side: Preserve alpha transparency or trace logos into editable vectors</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
            <span className="text-[var(--muted-foreground)]">Related tools:</span>
            <Link
              href="/tools/jpg-to-cdr-converter"
              className="inline-flex items-center gap-1 rounded-lg border border-[var(--border)] bg-[var(--background)] px-2.5 py-1 text-[var(--foreground)] transition-colors hover:border-indigo-500 hover:text-indigo-600"
            >
              <FileImage className="size-3 text-indigo-500" />
              <span>JPG to CDR</span>
            </Link>
            <Link
              href="/tools/svg-to-cdr-converter"
              className="inline-flex items-center gap-1 rounded-lg border border-[var(--border)] bg-[var(--background)] px-2.5 py-1 text-[var(--foreground)] transition-colors hover:border-indigo-500 hover:text-indigo-600"
            >
              <Layers className="size-3 text-indigo-500" />
              <span>SVG to CDR</span>
            </Link>
            <Link
              href="/tools/cdr-viewer"
              className="inline-flex items-center gap-1 rounded-lg border border-[var(--border)] bg-[var(--background)] px-2.5 py-1 text-[var(--foreground)] transition-colors hover:border-indigo-500 hover:text-indigo-600"
            >
              <Eye className="size-3 text-indigo-500" />
              <span>CDR Viewer</span>
            </Link>
            <Link
              href="/guides/raster-image-to-cdr-guide"
              className="inline-flex items-center gap-1 rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-1 text-indigo-700 transition-colors hover:border-indigo-500 hover:bg-indigo-500/20 dark:text-indigo-300"
            >
              <BookOpen className="size-3" />
              <span>Workflow Guide</span>
              <ArrowRight className="size-3" />
            </Link>
          </div>
        </div>
      </div>

      <RasterToCorelTool format="png" />

      {/* Compact Workflow Explanation */}
      <div className="mx-auto mt-6 max-w-5xl rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 text-center text-xs text-[var(--muted-foreground)]">
        <div className="flex flex-wrap items-center justify-center gap-1.5 font-medium text-[var(--foreground)] sm:gap-2">
          <span>PNG</span>
          <span className="text-[var(--muted-foreground)]">→</span>
          <span>Preserve or Vectorize</span>
          <span className="text-[var(--muted-foreground)]">→</span>
          <span>CorelDRAW-ready SVG/PDF</span>
          <span className="text-[var(--muted-foreground)]">→</span>
          <span>Import into CorelDRAW</span>
          <span className="text-[var(--muted-foreground)]">→</span>
          <span>Save as CDR</span>
        </div>
        <p className="mt-2 text-[var(--muted-foreground)]">
          Navorika does not generate a native CDR file. It creates CorelDRAW-ready SVG/PDF output processed locally in your browser that you can import into CorelDRAW and save as CDR.
        </p>
      </div>
    </ExpansionToolPage>
  );
}
