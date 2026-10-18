import HeicConverterTool from '@/components/tools/HeicConverterTool';

export default function Page() {
  return <HeicConverterTool title="Convert HEIC to PNG" description="Decode a HEIC or HEIF image and export the first image as a PNG." outputFormat="png" />;
}
