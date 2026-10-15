import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BookOpen, Code2, FileImage, Layers, Printer } from 'lucide-react';
import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import RgbCmykImageTool from '@/components/tools/RgbCmykImageTool';

export const metadata: Metadata = {
  title: 'RGB or CMYK Image Checker – Check Image Color Mode Online',
  description: 'Is your image RGB or CMYK? Check JPG, PNG, TIFF, WebP or GIF color mode online for free. See detected color space instantly. No upload needed.',
  alternates: { canonical: 'https://navorika.com/tools/rgb-cmyk-image-checker' },
};

export default function Page() {
  return (
    <ExpansionToolPage
      category="image-tools"
      eyebrow="Check Image Color Mode Online"
      title="RGB or CMYK Image Checker – Check Image Color Mode Online"
      description="Is your image RGB or CMYK? Check its color mode online for free before printing or editing. Choose a JPG, PNG, TIFF, WebP or GIF to see the detected color space in seconds. Your file stays in your browser."
      slug="rgb-cmyk-image-checker"
    >
      {/* Above-the-fold workflow helper bar */}
      <div className="mb-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 text-xs text-[var(--muted-foreground)] shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-medium text-[var(--foreground)]">
            <span className="inline-flex size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Runs in Your Browser: Checks the original file headers instead of relying on browser-rendered color</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
            <span className="text-[var(--muted-foreground)]">Workflow tools:</span>
            <Link
              href="/tools/psd-to-html"
              className="inline-flex items-center gap-1 rounded-lg border border-[var(--border)] bg-[var(--background)] px-2.5 py-1 text-[var(--foreground)] transition-colors hover:border-indigo-500 hover:text-indigo-600"
            >
              <Code2 className="size-3 text-indigo-500" />
              <span>PSD to HTML Web Preflight</span>
            </Link>
            <Link
              href="/tools/svg-dimensions-checker"
              className="inline-flex items-center gap-1 rounded-lg border border-[var(--border)] bg-[var(--background)] px-2.5 py-1 text-[var(--foreground)] transition-colors hover:border-indigo-500 hover:text-indigo-600"
            >
              <Layers className="size-3 text-indigo-500" />
              <span>SVG Dimensions</span>
            </Link>
            <Link
              href="/tools/image-print-size-calculator"
              className="inline-flex items-center gap-1 rounded-lg border border-[var(--border)] bg-[var(--background)] px-2.5 py-1 text-[var(--foreground)] transition-colors hover:border-indigo-500 hover:text-indigo-600"
            >
              <Printer className="size-3 text-indigo-500" />
              <span>Print DPI Calculator</span>
            </Link>
            <Link
              href="/guides/rgb-vs-cmyk-for-printing"
              className="inline-flex items-center gap-1 rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-1 text-indigo-700 transition-colors hover:border-indigo-500 hover:bg-indigo-500/20 dark:text-indigo-300"
            >
              <BookOpen className="size-3" />
              <span>RGB vs CMYK Guide</span>
              <ArrowRight className="size-3" />
            </Link>
          </div>
        </div>
      </div>

      <RgbCmykImageTool />
    </ExpansionToolPage>
  );
}
