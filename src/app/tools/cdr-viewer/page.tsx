import Link from 'next/link';
import { ArrowRight, BookOpen, FileCode, FileImage, Layers } from 'lucide-react';
import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import CorelServerTool from '@/components/tools/coreldraw/CorelServerTool';
import { corelServerConfigs } from '@/components/tools/coreldraw/configs';

export default function Page() {
  return (
    <ExpansionToolPage
      category="developer-tools"
      eyebrow="Online CorelDRAW Document Inspector"
      title="CDR Viewer"
      description="Open and preview supported CorelDRAW (.cdr) files online without installing software. Inspect drawings across multi-page PDF previews or export high-resolution SVG and PNG previews instantly."
    >
      {/* Above-the-fold workflow helper bar */}
      <div className="mb-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 text-xs text-[var(--muted-foreground)] shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-medium text-[var(--foreground)]">
            <span className="inline-flex size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Capability-Verified Reader: Inspect RIFF &amp; ZIP CorelDRAW drawings with zero software install</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
            <span className="text-[var(--muted-foreground)]">Related tools:</span>
            <Link
              href="/tools/png-to-cdr-converter"
              className="inline-flex items-center gap-1 rounded-lg border border-[var(--border)] bg-[var(--background)] px-2.5 py-1 text-[var(--foreground)] transition-colors hover:border-indigo-500 hover:text-indigo-600"
            >
              <FileImage className="size-3 text-indigo-500" />
              <span>PNG to CDR</span>
            </Link>
            <Link
              href="/tools/jpg-to-cdr-converter"
              className="inline-flex items-center gap-1 rounded-lg border border-[var(--border)] bg-[var(--background)] px-2.5 py-1 text-[var(--foreground)] transition-colors hover:border-indigo-500 hover:text-indigo-600"
            >
              <FileImage className="size-3 text-indigo-500" />
              <span>JPG to CDR</span>
            </Link>
            <Link
              href="/tools/pdf-to-cdr-converter"
              className="inline-flex items-center gap-1 rounded-lg border border-[var(--border)] bg-[var(--background)] px-2.5 py-1 text-[var(--foreground)] transition-colors hover:border-indigo-500 hover:text-indigo-600"
            >
              <Layers className="size-3 text-indigo-500" />
              <span>PDF to CDR</span>
            </Link>
            <Link
              href="/guides/open-cdr-without-coreldraw"
              className="inline-flex items-center gap-1 rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-1 text-indigo-700 transition-colors hover:border-indigo-500 hover:bg-indigo-500/20 dark:text-indigo-300"
            >
              <BookOpen className="size-3" />
              <span>How to Open CDR</span>
              <ArrowRight className="size-3" />
            </Link>
          </div>
        </div>
      </div>

      <CorelServerTool config={corelServerConfigs.viewer} />
    </ExpansionToolPage>
  );
}
