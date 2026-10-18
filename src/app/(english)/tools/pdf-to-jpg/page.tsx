import PdfPageToImageTool from '@/components/tools/PdfPageToImageTool';

export default function Page() {
  return <PdfPageToImageTool title="PDF to JPG Converter" description="Convert a selected PDF page to JPG or JPEG with adjustable resolution and quality, then preview and download the image." fixedFormat="jpeg" />;
}
