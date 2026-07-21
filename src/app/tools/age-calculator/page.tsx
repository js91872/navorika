import ToolLayout from "@/components/tool/ToolLayout";
import AgeCalculator from "@/components/calculator/productivity/AgeCalculator";
import { getToolBySlug } from "@/lib/toolRegistry";

export default function AgeCalculatorPage() {
  const tool = getToolBySlug("age-calculator");
  
  if (!tool) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-800">Tool not found</h1>
          <p className="text-slate-500 mt-2">The age calculator tool is not available.</p>
        </div>
      </div>
    );
  }
  
  return (
    <ToolLayout tool={tool}>
      <AgeCalculator />
    </ToolLayout>
  );
}
