import ToolLayout from "@/components/tool/ToolLayout";
import BackgroundRemover from "@/components/calculator/image/BackgroundRemover";
import { getToolBySlug } from "@/lib/toolRegistry";

export default function BackgroundRemoverPage() {
  const tool = getToolBySlug("background-remover");

  if (!tool) {
    return <div>Tool not found.</div>;
  }

  return (
    <ToolLayout tool={tool}>
      <BackgroundRemover />
    </ToolLayout>
  );
}
