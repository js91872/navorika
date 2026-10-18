import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import ImageToBase64Tool from '@/components/tools/image/ImageToBase64Tool';

export default function ImageToBase64ConverterPage() {
  return (
    <ExpansionToolPage
      category="image-tools"
      eyebrow="Image Encoding & Conversion"
      title="Image to Base64 Converter"
      description="Convert JPG, PNG, WebP, GIF, and SVG images to plain Base64 strings or HTML/CSS Data URLs locally in your browser with zero server uploads."
      slug="image-to-base64-converter"
    >
      <ImageToBase64Tool />
    </ExpansionToolPage>
  );
}
