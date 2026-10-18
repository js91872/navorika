import ImageFormatConverterTool from '@/components/tools/ImageFormatConverterTool';

export default function Page() {
  return <ImageFormatConverterTool title="WebP to PNG Converter" description="Convert a still WebP image to PNG online and preserve decoded transparency where supported." inputLabel="WebP image" inputMime="image/webp" outputFormat="png" />;
}
