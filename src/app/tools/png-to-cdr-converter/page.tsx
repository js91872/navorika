import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import RasterToCorelTool from '@/components/tools/coreldraw/RasterToCorelTool';

export default function Page() {
  return (
    <ExpansionToolPage
      category="developer-tools"
      eyebrow="CorelDRAW Workflow"
      title="PNG to CDR Converter"
      description="Convert and prepare PNG images for CorelDRAW right in your browser. Choose Preserve Mode to keep your original transparent graphic intact for layout placement, or Vectorize Mode to convert logos, icons, and line art into clean, editable vector curves ready to import and save as CDR."
    >
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
