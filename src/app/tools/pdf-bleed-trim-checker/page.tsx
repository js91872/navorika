import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import PdfBleedTrimTool from '@/components/tools/PdfBleedTrimTool';

export default function Page() {
  return (
    <ExpansionToolPage
      category="pdf-tools"
      eyebrow="PDF Prepress & Geometry"
      title="PDF Bleed & Trim Checker"
      description="Inspect PDF page geometry boxes including MediaBox, CropBox, BleedBox, and TrimBox locally to verify commercial print preparation."
      slug="pdf-bleed-trim-checker"
    >
      <PdfBleedTrimTool />
    </ExpansionToolPage>
  );
}
