import ImageFormatConverterTool from '@/components/tools/ImageFormatConverterTool';

export default function Page() {
  return <ImageFormatConverterTool title="Convert JPG to PNG" description="Decode a JPG and export the same pixels as a lossless PNG." inputLabel="JPG image" inputMime="image/jpeg" outputFormat="png" />;
}
