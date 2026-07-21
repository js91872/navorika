import ToolLayout from "@/components/tool/ToolLayout";
import DateCalculator from "@/components/calculator/productivity/DateCalculator";
import { getToolBySlug } from "@/lib/toolRegistry";

export default function DateCalculatorPage() {
  const tool = getToolBySlug("date-calculator");
  
  if (!tool) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-800">Tool not found</h1>
          <p className="text-slate-500 mt-2">The date calculator tool is not available.</p>
        </div>
      </div>
    );
  }
  
  return (
    <ToolLayout tool={tool}>
      <DateCalculator />
    </ToolLayout>
  );
}
