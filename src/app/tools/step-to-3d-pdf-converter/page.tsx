import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import StepTo3dPdfTool from '@/components/tools/cad/StepTo3dPdfTool';

export default function Page() {
  return (
    <ExpansionToolPage
      category="developer-tools"
      eyebrow="CAD & 3D Engineering"
      title="STEP to 3D PDF Converter"
      description="Convert STEP and STP CAD files to 3D PDF online with interactive PRC geometry."
    >
      <StepTo3dPdfTool />

      {/* Compact Above-the-Fold Workflow Strip */}
      <div className="mx-auto mt-6 max-w-4xl rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 text-center text-xs text-[var(--muted-foreground)]">
        <div className="flex flex-wrap items-center justify-center gap-1.5 font-medium text-[var(--foreground)] sm:gap-2">
          <span>STEP / STP</span>
          <span className="text-[var(--muted-foreground)]">→</span>
          <span>Conversion</span>
          <span className="text-[var(--muted-foreground)]">→</span>
          <span>Interactive 3D PDF</span>
          <span className="text-[var(--muted-foreground)]">→</span>
          <span>Download</span>
          <span className="text-[var(--muted-foreground)]">→</span>
          <span>Open in Compatible Desktop PDF Viewer</span>
        </div>
        <p className="mt-2 text-[var(--muted-foreground)]">
          Generates a genuine 3D PDF with embedded interactive PRC geometry rather than a static 2D snapshot. Open in Adobe Acrobat Reader desktop or another compatible viewer to orbit, pan, and zoom.
        </p>
      </div>
    </ExpansionToolPage>
  );
}
