import ImageFormatConverterTool from '@/components/tools/ImageFormatConverterTool';

export default function Page() {
  return <ImageFormatConverterTool title="Image Converter – JPG, PNG & WebP" description="Convert JPG, PNG or WebP images to another supported image format, preview the result, and download it directly from your browser." inputLabel="JPG, PNG, or WebP image" inputMime="image/jpeg,image/png,image/webp" />;
}
