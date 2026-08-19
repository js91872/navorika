import PdfPageToImageTool from '@/components/tools/PdfPageToImageTool';

export default function Page() {
  return <PdfPageToImageTool title="PDF to JPG" description="Render one selected PDF page as a downloadable JPG with adjustable resolution and quality." fixedFormat="jpeg" />;
}
