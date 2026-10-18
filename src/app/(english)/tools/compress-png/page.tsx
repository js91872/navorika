import ImageFormatConverterTool from '@/components/tools/ImageFormatConverterTool';
export default function Page() { return <ImageFormatConverterTool title="Optimize PNG" description="Decode and re-encode a PNG losslessly, then compare the actual output size before downloading." inputLabel="PNG image" inputMime="image/png" outputFormat="png" />; }
