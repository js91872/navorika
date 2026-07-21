import ToolLayout from "@/components/tool/ToolLayout";
import Base64Tool from "@/components/calculator/developer/Base64Tool";
import { getToolBySlug } from "@/lib/toolRegistry";

export default function Base64Page() {
  const tool = getToolBySlug("base64-encoder");

  if (!tool) {
    return <div>Tool not found.</div>;
  }

  return (
    <ToolLayout tool={tool}>
      <Base64Tool />
    </ToolLayout>
  );
}
