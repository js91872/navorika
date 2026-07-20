import ToolLayout from "@/components/tool/ToolLayout";
import InflationCalculator from "@/components/calculator/inflation/InflationCalculator";
import { getToolBySlug } from "@/lib/toolRegistry";

export default function InflationPage() {
  const tool = getToolBySlug("inflation-calculator");

  if (!tool) {
    return <div>Tool not found.</div>;
  }

  return (
    <ToolLayout tool={tool}>
      <InflationCalculator />
    </ToolLayout>
  );
}
