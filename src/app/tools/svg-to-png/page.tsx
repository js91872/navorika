import ImageFormatConverterTool from '@/components/tools/ImageFormatConverterTool';
export default function Page() { return <ImageFormatConverterTool title="Convert SVG to PNG" description="Rasterize a browser-decodable SVG at its intrinsic dimensions and export a PNG preview." inputLabel="SVG image" inputMime="image/svg+xml" outputFormat="png" />; }
