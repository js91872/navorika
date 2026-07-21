import ToolLayout from "@/components/tool/ToolLayout";
import BMRCalculator from "@/components/calculator/health/BMRCalculator";
import { getToolBySlug } from "@/lib/toolRegistry";

export default function BMRPage() {
  const tool = getToolBySlug("bmr-calculator");

  if (!tool) {
    return <div>Tool not found.</div>;
  }

  return (
    <ToolLayout tool={tool}>
      <BMRCalculator />
    </ToolLayout>
  );
}
