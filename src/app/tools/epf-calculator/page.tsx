import ToolLayout from "@/components/tool/ToolLayout";
import EPFCalculator from "@/components/calculator/epf/EPFCalculator";

import { toolRegistry } from "@/data/toolRegistry";

export default function EPFPage() {
  const tool = toolRegistry["epf-calculator"];

  if (!tool) {
    return <div>Tool not found.</div>;
  }

  return (
    <ToolLayout tool={tool}>
      <EPFCalculator />
    </ToolLayout>
  );
}