import ToolLayout from "@/components/tool/ToolLayout";
import ImageResizer from "@/components/calculator/image/ImageResizer";
import { getToolBySlug } from "@/lib/toolRegistry";

export default function ImageResizerPage() {
  const tool = getToolBySlug("image-resizer");

  if (!tool) {
    return <div>Tool not found.</div>;
  }

  return (
    <ToolLayout tool={tool}>
      <ImageResizer />
    </ToolLayout>
  );
}
