import PdfPageToImageTool from '@/components/tools/PdfPageToImageTool';

export default function Page() {
  return <PdfPageToImageTool title="PDF to Image Converter" description="Convert a selected PDF page to PNG or JPG, choose the resolution, preview the result, and download the image." />;
}
