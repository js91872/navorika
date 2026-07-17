import ToolLayout from "@/components/tool/ToolLayout";
import LumpsumCalculator from "@/components/calculator/lumpsum/LumpsumCalculator";

import { toolRegistry } from "@/data/toolRegistry";

export default function LumpsumPage() {

  const tool = toolRegistry["lumpsum-calculator"];

  if (!tool) {
    return <div>Tool not found.</div>;
  }

  return (
    <ToolLayout tool={tool}>
      <LumpsumCalculator />
    </ToolLayout>
  );
}