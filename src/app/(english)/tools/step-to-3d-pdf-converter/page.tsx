import Link from 'next/link';
import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import StepTo3dPdfTool from '@/components/tools/cad/StepTo3dPdfTool';

export default function Page() {
  return (
    <ExpansionToolPage
      category="developer-tools"
      eyebrow="CAD & 3D Engineering"
      title="Free STEP to 3D PDF Converter Online"
      description="Convert STEP or STP CAD files to interactive 3D PDF online for free. Rotate and inspect models in a compatible desktop PDF viewer."
    >
      <div className="mx-auto mb-4 max-w-4xl rounded-xl border border-[var(--border)] bg-[var(--card)] p-3 text-sm text-[var(--foreground)]">
        <p className="font-semibold">Free STEP / STP to interactive 3D PDF · Up to 25 MB · No signup</p>
        <p className="mt-1 text-[var(--muted-foreground)]">Your CAD file is uploaded for conversion in an isolated temporary server workspace and removed after processing. The result contains interactive PRC geometry for compatible desktop PDF viewers; this tool does not create dimensioned 2D drawing sheets.</p>
      </div>
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
        <div className="mt-3 border-t border-[var(--border)] pt-2.5">
          <Link
            href="/guides/step-to-3d-pdf-conversion-guide"
            className="inline-flex items-center gap-1.5 font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
          >
            <span>Read our in-depth STEP to 3D PDF conversion & troubleshooting guide →</span>
          </Link>
        </div>
      </div>
    </ExpansionToolPage>
  );
}
