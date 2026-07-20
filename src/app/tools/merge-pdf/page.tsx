import ToolLayout from "@/components/tool/ToolLayout";
import MergePDF from "@/components/calculator/pdf/MergePDF";
import { getToolBySlug } from "@/lib/toolRegistry";

export default function MergePDFPage() {
  const tool = getToolBySlug("merge-pdf");

  if (!tool) {
    return <div>Tool not found.</div>;
  }

  return (
    <ToolLayout tool={tool}>
      <MergePDF />
    </ToolLayout>
  );
}
