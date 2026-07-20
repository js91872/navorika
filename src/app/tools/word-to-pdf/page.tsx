import ToolLayout from "@/components/tool/ToolLayout";
import WordToPDF from "@/components/calculator/pdf/WordToPDF";
import { getToolBySlug } from "@/lib/toolRegistry";

export default function WordToPDFPage() {
  const tool = getToolBySlug("word-to-pdf");

  if (!tool) {
    return <div>Tool not found.</div>;
  }

  return (
    <ToolLayout tool={tool}>
      <WordToPDF />
    </ToolLayout>
  );
}
