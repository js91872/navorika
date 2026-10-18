import HtmlToImageConverterTool from '@/components/tools/HtmlToImageConverterTool';

export default function Page() {
  return (
    <HtmlToImageConverterTool
      title="HTML to PNG Converter"
      description="Convert HTML code or uploaded HTML files into crisp, lossless PNG images with alpha transparency support, custom width, and preview."
      fixedFormat="png"
      defaultFormat="png"
      currentSlug="html-to-png-converter"
    />
  );
}
