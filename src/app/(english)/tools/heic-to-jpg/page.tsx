import HeicConverterTool from '@/components/tools/HeicConverterTool';

export default function Page() {
  return <HeicConverterTool title="Convert HEIC to JPG" description="Decode a HEIC or HEIF image and export the first image as an adjustable-quality JPG." outputFormat="jpeg" />;
}
