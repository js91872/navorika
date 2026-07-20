import ToolLayout from "@/components/tool/ToolLayout";
import JPGToPDF from "@/components/calculator/pdf/JPGToPDF";
import { getToolBySlug } from "@/lib/toolRegistry";

export default function JPGToPDFPage() {
  const tool = getToolBySlug("jpg-to-pdf");

  if (!tool) {
    return <div>Tool not found.</div>;
  }

  return (
    <ToolLayout tool={tool}>
      <JPGToPDF />
    </ToolLayout>
  );
}
