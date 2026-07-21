import ToolLayout from "@/components/tool/ToolLayout";
import URLEncoder from "@/components/calculator/developer/URLEncoder";
import { getToolBySlug } from "@/lib/toolRegistry";

export default function URLPage() {
  const tool = getToolBySlug("url-encoder");

  if (!tool) {
    return <div>Tool not found.</div>;
  }

  return (
    <ToolLayout tool={tool}>
      <URLEncoder />
    </ToolLayout>
  );
}
