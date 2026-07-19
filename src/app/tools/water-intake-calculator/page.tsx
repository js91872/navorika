import ToolLayout from "@/components/tool/ToolLayout";
import WaterIntakeCalculator from "@/components/calculator/water-intake/WaterIntakeCalculator";
import { getToolBySlug } from "@/lib/toolRegistry";

export default function WaterIntakePage() {
  const tool = getToolBySlug("water-intake-calculator");

  if (!tool) {
    return <div>Tool not found.</div>;
  }

  return (
    <ToolLayout tool={tool}>
      <WaterIntakeCalculator />
    </ToolLayout>
  );
}
