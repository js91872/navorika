import HtmlToImageConverterTool from '@/components/tools/HtmlToImageConverterTool';

export default function Page() {
  return (
    <HtmlToImageConverterTool
      title="HTML to JPG Converter"
      description="Convert HTML code or uploaded HTML files directly into JPG images in your browser with adjustable compression quality, custom width, and preview."
      fixedFormat="jpeg"
      defaultFormat="jpeg"
      currentSlug="html-to-jpg-converter"
    />
  );
}
