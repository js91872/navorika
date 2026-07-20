import ToolLayout from "@/components/tool/ToolLayout";
import ImageCompressor from "@/components/calculator/image/ImageCompressor";
import { getToolBySlug } from "@/lib/toolRegistry";

export default function ImageCompressorPage() {
  const tool = getToolBySlug("image-compressor");

  if (!tool) {
    return <div>Tool not found.</div>;
  }

  return (
    <ToolLayout tool={tool}>
      <ImageCompressor />
    </ToolLayout>
  );
}
