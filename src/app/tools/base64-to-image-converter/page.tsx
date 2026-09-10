import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import Base64ToImageTool from '@/components/tools/image/Base64ToImageTool';

export default function Base64ToImageConverterPage() {
  return (
    <ExpansionToolPage
      category="image-tools"
      eyebrow="Image Encoding & Conversion"
      title="Base64 to Image Converter"
      description="Decode Base64 strings and Data URLs into downloadable PNG, JPG, WebP, GIF, or SVG images with live preview and format auto-detection."
      slug="base64-to-image-converter"
    >
      <Base64ToImageTool />
    </ExpansionToolPage>
  );
}
