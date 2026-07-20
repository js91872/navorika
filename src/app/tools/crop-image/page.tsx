import ToolLayout from "@/components/tool/ToolLayout";
import CropImage from "@/components/calculator/image/CropImage";
import { getToolBySlug } from "@/lib/toolRegistry";

export default function CropImagePage() {
  const tool = getToolBySlug("crop-image");

  if (!tool) {
    return <div>Tool not found.</div>;
  }

  return (
    <ToolLayout tool={tool}>
      <CropImage />
    </ToolLayout>
  );
}
