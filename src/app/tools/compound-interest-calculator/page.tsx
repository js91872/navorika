import ToolLayout from "@/components/tool/ToolLayout";
import CompoundInterestCalculator from "@/components/calculator/compound-interest/CompoundInterestCalculator";

import { toolRegistry } from "@/data/toolRegistry";

export default function CompoundInterestPage() {
  const tool = toolRegistry["compound-interest-calculator"];

  if (!tool) {
    return <div>Tool not found.</div>;
  }

  return (
    <ToolLayout tool={tool}>
      <CompoundInterestCalculator />
    </ToolLayout>
  );
}