import ToolLayout from "@/components/tool/ToolLayout";
import CAGRCalculator from "@/components/calculator/cagr/CAGRCalculator";

import { toolRegistry } from "@/data/toolRegistry";

export default function CAGRPage() {
  const tool = toolRegistry["cagr-calculator"];

  if (!tool) {
    return <div>Tool not found.</div>;
  }

  return (
    <ToolLayout tool={tool}>
      <CAGRCalculator />
    </ToolLayout>
  );
}