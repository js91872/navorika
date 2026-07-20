import ToolLayout from "@/components/tool/ToolLayout";
import ImageConverter from "@/components/calculator/image/ImageConverter";
import { getToolBySlug } from "@/lib/toolRegistry";

export default function ImageConverterPage() {
  const tool = getToolBySlug("image-converter");

  if (!tool) {
    return <div>Tool not found.</div>;
  }

  return (
    <ToolLayout tool={tool}>
      <ImageConverter />
    </ToolLayout>
  );
}
