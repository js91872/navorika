import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import PdfPageSizeTool from '@/components/tools/PdfPageSizeTool';

export default function Page() {
  return (
    <ExpansionToolPage
      category="pdf-tools"
      eyebrow="PDF Page Dimensions & Standards"
      title="PDF Page Size Checker"
      description="Inspect page dimensions, orientation, and standard paper size matches across all pages of your PDF document 100% locally."
      slug="pdf-page-size-checker"
    >
      <PdfPageSizeTool />
    </ExpansionToolPage>
  );
}
