import ToolLayout from "@/components/tool/ToolLayout";
import ProteinCalculator from "@/components/calculator/health/ProteinCalculator";
import { getToolBySlug } from "@/lib/toolRegistry";

export default function ProteinPage() {
  const tool = getToolBySlug("protein-calculator");

  if (!tool) {
    return <div>Tool not found.</div>;
  }

  return (
    <ToolLayout tool={tool}>
      <ProteinCalculator />
    </ToolLayout>
  );
}
