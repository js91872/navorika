import ToolLayout from "@/components/tool/ToolLayout";
import CalorieCalculator from "@/components/calculator/health/CalorieCalculator";
import { getToolBySlug } from "@/lib/toolRegistry";

export default function CaloriePage() {
  const tool = getToolBySlug("calorie-calculator");

  if (!tool) {
    return <div>Tool not found.</div>;
  }

  return (
    <ToolLayout tool={tool}>
      <CalorieCalculator />
    </ToolLayout>
  );
}
