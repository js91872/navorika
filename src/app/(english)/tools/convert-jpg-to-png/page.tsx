import ImageFormatConverterTool from '@/components/tools/ImageFormatConverterTool';

export default function Page() {
  return <ImageFormatConverterTool title="JPG to PNG Converter" description="Convert JPG or JPEG to PNG online, keep the decoded pixel dimensions, preview the result, and download a lossless PNG." inputLabel="JPG image" inputMime="image/jpeg" outputFormat="png" />;
}
