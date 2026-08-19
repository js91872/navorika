import ImageFormatConverterTool from '@/components/tools/ImageFormatConverterTool';

export default function Page() {
  return <ImageFormatConverterTool title="Convert WebP to PNG" description="Decode a still WebP image and export it as a lossless PNG." inputLabel="WebP image" inputMime="image/webp" outputFormat="png" />;
}
