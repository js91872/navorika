// src/app/tools/compound-interest-calculator/page.tsx
import ToolLayout from "@/components/tool/ToolLayout";
import CompoundInterestCalculator from "@/components/calculator/compound-interest/CompoundInterestCalculator";
import { getToolBySlug } from "@/lib/toolRegistry";

export default function CompoundInterestPage() {
  const tool = getToolBySlug("compound-interest-calculator");

  if (!tool) {
    return <div>Tool not found.</div>;
  }

  return (
    <ToolLayout tool={tool}>
      <CompoundInterestCalculator />
    </ToolLayout>
  );
}