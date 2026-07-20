import ToolLayout from "@/components/tool/ToolLayout";
import PDFToJPG from "@/components/calculator/pdf/PDFToJPG";
import { getToolBySlug } from "@/lib/toolRegistry";

export default function PDFToJPGPage() {
  const tool = getToolBySlug("pdf-to-jpg");

  if (!tool) {
    return <div>Tool not found.</div>;
  }

  return (
    <ToolLayout tool={tool}>
      <PDFToJPG />
    </ToolLayout>
  );
}
