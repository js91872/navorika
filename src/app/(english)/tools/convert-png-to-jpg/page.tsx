import ImageFormatConverterTool from '@/components/tools/ImageFormatConverterTool';

export default function Page() {
  return <ImageFormatConverterTool title="Convert PNG to JPG" description="Convert a PNG to JPG with transparent areas filled white." inputLabel="PNG image" inputMime="image/png" outputFormat="jpeg" />;
}
