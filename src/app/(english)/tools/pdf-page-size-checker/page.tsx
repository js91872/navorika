import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import PdfPageSizeTool from '@/components/tools/PdfPageSizeTool';

export default function Page() {
  return (
    <ExpansionToolPage
      category="pdf-tools"
      eyebrow="Check PDF Page Size & Dimensions"
      title="PDF Page Size Checker"
      description="Check PDF page size, dimensions and orientation online, and identify A4, A3, Letter, Legal or mixed page sizes."
      slug="pdf-page-size-checker"
    >
      <PdfPageSizeTool />
    </ExpansionToolPage>
  );
}
