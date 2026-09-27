import HtmlToImageConverterTool from '@/components/tools/HtmlToImageConverterTool';

export default function Page() {
  return (
    <HtmlToImageConverterTool
      title="HTML to Image Converter"
      description="Convert HTML code or uploaded HTML files into clean PNG or JPG images with an isolated rendering sandbox, custom width, and scale controls."
      currentSlug="html-to-image"
    />
  );
}
