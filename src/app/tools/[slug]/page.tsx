import { notFound } from "next/navigation";
import { getToolBySlug } from "@/lib/toolRegistry";
import ToolLayout from "@/components/tool/ToolLayout";
import { getToolIcon } from "@/lib/toolIcons";

interface ToolPageProps {
  params: {
    slug: string;
  };
}

export default function ToolPage({ params }: ToolPageProps) {
  const tool = getToolBySlug(params.slug);
  
  if (!tool) {
    notFound();
  }

  // Get the icon component
  const Icon = getToolIcon(tool.slug);

  return (
    <ToolLayout tool={tool}>
      <div className="p-6 lg:p-8">
        {/* Tool content will be rendered here */}
        <div className="prose dark:prose-invert max-w-none">
          <p>{tool.description}</p>
          
          {tool.formula && (
            <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-700/30 rounded-xl">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Formula</h3>
              <code className="text-sm text-slate-800 dark:text-slate-200 font-mono">{tool.formula}</code>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
