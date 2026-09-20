import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import CorelServerTool from '@/components/tools/coreldraw/CorelServerTool';
import { corelServerConfigs } from '@/components/tools/coreldraw/configs';

export default function Page() {
  return (
    <ExpansionToolPage
      category="developer-tools"
      eyebrow="CorelDRAW-ready document"
      title="PDF to CDR Converter"
      description="Convert and prepare PDF artwork for CorelDRAW using genuine PDF, SVG, or EPS output that you can import and save as CDR."
    >
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
