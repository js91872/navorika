import ToolLayout from "@/components/tool/ToolLayout";
import CompressPDF from "@/components/calculator/pdf/CompressPDF";
import { getToolBySlug } from "@/lib/toolRegistry";

export default function CompressPDFPage() {
  const tool = getToolBySlug("compress-pdf");

  if (!tool) {
    return <div>Tool not found.</div>;
  }

  return (
    <ToolLayout tool={tool}>
      <CompressPDF />
    </ToolLayout>
  );
}
