import ToolLayout from "@/components/tool/ToolLayout";
import BMICalculator from "@/components/calculator/health/BMICalculator";
import { getToolBySlug } from "@/lib/toolRegistry";

export default function BMIPage() {
  const tool = getToolBySlug("bmi-calculator");

  if (!tool) {
    return <div>Tool not found.</div>;
  }

  return (
    <ToolLayout tool={tool}>
      <BMICalculator />
    </ToolLayout>
  );
}
