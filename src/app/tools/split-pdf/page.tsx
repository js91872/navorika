import ToolLayout from "@/components/tool/ToolLayout";
import SplitPDF from "@/components/calculator/pdf/SplitPDF";
import { getToolBySlug } from "@/lib/toolRegistry";

export default function SplitPDFPage() {
  const tool = getToolBySlug("split-pdf");

  if (!tool) {
    return <div>Tool not found.</div>;
  }

  return (
    <ToolLayout tool={tool}>
      <SplitPDF />
    </ToolLayout>
  );
}
