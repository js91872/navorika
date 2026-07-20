import ToolLayout from "@/components/tool/ToolLayout";
import LoanCalculator from "@/components/calculator/loan/LoanCalculator";
import { getToolBySlug } from "@/lib/toolRegistry";

export default function LoanPage() {
  const tool = getToolBySlug("loan-calculator");

  if (!tool) {
    return <div>Tool not found.</div>;
  }

  return (
    <ToolLayout tool={tool}>
      <LoanCalculator />
    </ToolLayout>
  );
}
