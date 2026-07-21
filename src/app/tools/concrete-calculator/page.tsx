import ToolLayout from "@/components/tool/ToolLayout";
import ConcreteCalculator from "@/components/calculator/construction/ConcreteCalculator";
import { getToolBySlug } from "@/lib/toolRegistry";

export default function ConcreteCalculatorPage() {
  const tool = getToolBySlug("concrete-calculator");
  
  if (!tool) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Tool not found</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">The concrete calculator tool is not available.</p>
        </div>
      </div>
    );
  }
  
  return (
    <ToolLayout tool={tool}>
      <ConcreteCalculator />
    </ToolLayout>
  );
}
