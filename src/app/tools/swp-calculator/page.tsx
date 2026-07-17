import ToolLayout from "@/components/tool/ToolLayout";
import SWPCalculator from "@/components/calculator/swp/SWPCalculator";

import { toolRegistry } from "@/data/toolRegistry";

export default function SWPPage() {
  const tool = toolRegistry["swp-calculator"];

  if (!tool) {
    return <div>Tool not found.</div>;
  }

  return (
    <ToolLayout tool={tool}>
      <SWPCalculator />
    </ToolLayout>
  );
}