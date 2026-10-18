import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import PdfBleedTrimTool from '@/components/tools/PdfBleedTrimTool';

export default function Page() {
  return (
    <ExpansionToolPage
      category="pdf-tools"
      eyebrow="Check PDF Bleed & Trim for Printing"
      title="PDF Bleed & Trim Checker"
      description="Check PDF bleed and trim settings by inspecting MediaBox, CropBox, BleedBox and TrimBox before sending a file to print."
      slug="pdf-bleed-trim-checker"
    >
      <PdfBleedTrimTool />
    </ExpansionToolPage>
  );
}
