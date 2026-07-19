import ToolLayout from "@/components/tool/ToolLayout";
import RetirementCalculator from "@/components/calculator/retirement/RetirementCalculator";
import { toolRegistry } from "@/data/toolRegistry";

export default function RetirementPage() {
  const tool = toolRegistry["retirement-calculator"];

  if (!tool) {
    return <div>Tool not found.</div>;
  }

  return (
    <ToolLayout tool={tool}>
      <RetirementCalculator />
    </ToolLayout>
  );
}