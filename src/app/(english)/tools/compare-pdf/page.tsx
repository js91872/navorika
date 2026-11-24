import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import ComparePdfTool from '@/components/tools/ComparePdfTool';

export default function ComparePdfPage() {
  return (
    <ExpansionToolPage
      category="pdf-tools"
      eyebrow="Compare PDF Documents Online Free"
      title="Compare PDF Files Online Free"
      description="Compare two PDF files online for word-level and visual differences side by side. Inspect added, removed, and modified pages locally and privately without uploading documents."
      slug="compare-pdf"
    >
      <ComparePdfTool />
    </ExpansionToolPage>
  );
}
