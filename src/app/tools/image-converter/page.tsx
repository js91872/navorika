import ImageFormatConverterTool from '@/components/tools/ImageFormatConverterTool';

export default function Page() {
  return <ImageFormatConverterTool title="Image Converter" description="Convert JPG, PNG, or WebP images to JPG, PNG, or WebP with an actual output preview." inputLabel="JPG, PNG, or WebP image" inputMime="image/jpeg,image/png,image/webp" />;
}
