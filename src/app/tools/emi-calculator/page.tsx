import ToolLayout from "@/components/tool/ToolLayout";
import EMICalculator from "@/components/calculator/emi/EMICalculator";

import { toolRegistry } from "@/data/toolRegistry";

export default function EMIPage() {
  const tool = toolRegistry["emi-calculator"];

  if (!tool) {
    return <div>Tool not found.</div>;
  }

  return (
    <ToolLayout tool={tool}>
      <EMICalculator />
    </ToolLayout>
  );
}