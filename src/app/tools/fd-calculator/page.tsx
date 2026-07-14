import ToolLayout from "@/components/tool/ToolLayout";
import FDCalculator from "@/components/calculator/fd/FDCalculator";

import { toolRegistry } from "@/data/toolRegistry";

export default function FDPage() {
  const tool = toolRegistry["fd-calculator"];

  if (!tool) {
    return <div>Tool not found.</div>;
  }

  return (
    <ToolLayout tool={tool}>
      <FDCalculator />
    </ToolLayout>
  );
}