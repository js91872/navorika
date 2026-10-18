import HtmlToImageConverterTool from '@/components/tools/HtmlToImageConverterTool';

export default function Page() {
  return (
    <HtmlToImageConverterTool
      title="HTML to JPG Converter"
      description="Convert HTML code or an HTML file to JPG online. Set the image width and JPG quality, preview the result, and download the JPEG directly from your browser."
      fixedFormat="jpeg"
      defaultFormat="jpeg"
      currentSlug="html-to-jpg-converter"
    />
  );
}
