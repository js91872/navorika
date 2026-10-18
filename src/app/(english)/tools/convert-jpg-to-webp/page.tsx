import ImageFormatConverterTool from '@/components/tools/ImageFormatConverterTool';

export default function Page() {
  return <ImageFormatConverterTool title="Convert JPG to WebP" description="Re-encode a JPG as WebP with adjustable browser quality." inputLabel="JPG image" inputMime="image/jpeg" outputFormat="webp" />;
}
