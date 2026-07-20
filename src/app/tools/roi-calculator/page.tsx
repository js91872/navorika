import ToolLayout from "@/components/tool/ToolLayout";
import ROICalculator from "@/components/calculator/roi/ROICalculator";
import { getToolBySlug } from "@/lib/toolRegistry";

export default function ROIPage() {
  const tool = getToolBySlug("roi-calculator");

  if (!tool) {
    return <div>Tool not found.</div>;
  }

  return (
    <ToolLayout tool={tool}>
      <ROICalculator />
    </ToolLayout>
  );
}
