import ToolLayout from "@/components/tool/ToolLayout";
import QRCodeGenerator from "@/components/calculator/productivity/QRCodeGenerator";
import { getToolBySlug } from "@/lib/toolRegistry";

export default function QRCodeGeneratorPage() {
  const tool = getToolBySlug("qr-code-generator");
  
  if (!tool) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-800">Tool not found</h1>
          <p className="text-slate-500 mt-2">The QR code generator tool is not available.</p>
        </div>
      </div>
    );
  }
  
  return (
    <ToolLayout tool={tool}>
      <QRCodeGenerator />
    </ToolLayout>
  );
}
