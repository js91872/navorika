import ToolLayout from "@/components/tool/ToolLayout";
import JSONFormatter from "@/components/calculator/developer/JSONFormatter";
import { getToolBySlug } from "@/lib/toolRegistry";

export default function JSONFormatterPage() {
  const tool = getToolBySlug("json-formatter");

  if (!tool) {
    return <div>Tool not found.</div>;
  }

  return (
    <ToolLayout tool={tool}>
      <JSONFormatter />
    </ToolLayout>
  );
}
