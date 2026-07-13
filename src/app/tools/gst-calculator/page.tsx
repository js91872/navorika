import ToolLayout from "@/components/tool/ToolLayout";
import GSTCalculator from "@/components/calculator/gst/GSTCalculator";

import { toolRegistry } from "@/data/toolRegistry";

export default function GSTPage() {
  const tool = toolRegistry["gst-calculator"];

  if (!tool) {
    return <div>Tool not found.</div>;
  }

  return (
    <ToolLayout tool={tool}>
      <GSTCalculator />
    </ToolLayout>
  );
}