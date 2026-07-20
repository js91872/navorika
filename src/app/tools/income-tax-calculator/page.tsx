import ToolLayout from "@/components/tool/ToolLayout";
import IncomeTaxCalculator from "@/components/calculator/income-tax/IncomeTaxCalculator";
import { getToolBySlug } from "@/lib/toolRegistry";

export default function IncomeTaxPage() {
  const tool = getToolBySlug("income-tax-calculator");

  if (!tool) {
    return <div>Tool not found.</div>;
  }

  return (
    <ToolLayout tool={tool}>
      <IncomeTaxCalculator />
    </ToolLayout>
  );
}
