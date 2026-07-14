import ToolLayout from "@/components/tool/ToolLayout";
import RDCalculator from "@/components/calculator/rd/RDCalculator";

import { toolRegistry } from "@/data/toolRegistry";

export default function RDPage() {

  const tool =
    toolRegistry["rd-calculator"];

  if (!tool) {
    return <div>Tool not found.</div>;
  }

  return (
    <ToolLayout tool={tool}>
      <RDCalculator />
    </ToolLayout>
  );
}