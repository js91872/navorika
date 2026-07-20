import ToolLayout from "@/components/tool/ToolLayout";
import PDFToWord from "@/components/calculator/pdf/PDFToWord";
import { getToolBySlug } from "@/lib/toolRegistry";

export default function PDFToWordPage() {
  const tool = getToolBySlug("pdf-to-word");

  if (!tool) {
    return <div>Tool not found.</div>;
  }

  return (
    <ToolLayout tool={tool}>
      <PDFToWord />
    </ToolLayout>
  );
}
