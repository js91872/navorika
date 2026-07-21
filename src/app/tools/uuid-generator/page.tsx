import ToolLayout from "@/components/tool/ToolLayout";
import UUIDGenerator from "@/components/calculator/developer/UUIDGenerator";
import { getToolBySlug } from "@/lib/toolRegistry";

export default function UUIDPage() {
  const tool = getToolBySlug("uuid-generator");

  if (!tool) {
    return <div>Tool not found.</div>;
  }

  return (
    <ToolLayout tool={tool}>
      <UUIDGenerator />
    </ToolLayout>
  );
}
