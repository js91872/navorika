import ToolLayout from "@/components/tool/ToolLayout";
import PPFCalculator from "@/components/calculator/ppf/PPFCalculator";
import { getToolBySlug } from "@/lib/toolRegistry";

export default function PPFCalculatorPage() {
  const tool = getToolBySlug("ppf-calculator");
  
  if (!tool) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Tool not found</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">The PPF calculator tool is not available.</p>
        </div>
      </div>
    );
  }
  
  return (
    <ToolLayout tool={tool}>
      <PPFCalculator />
    </ToolLayout>
  );
}
