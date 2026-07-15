import ToolLayout from "@/components/tool/ToolLayout";
import PPFCalculator from "@/components/calculator/ppf/PPFCalculator";

import { toolRegistry } from "@/data/toolRegistry";

export default function PPFPage() {
  const tool = toolRegistry["ppf-calculator"];

  if (!tool) {
    return <div>Tool not found.</div>;
  }

  return (
    <ToolLayout tool={tool}>
      <PPFCalculator />
    </ToolLayout>
  );
}