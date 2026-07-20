import ToolLayout from "@/components/tool/ToolLayout";
import CurrencyConverter from "@/components/calculator/currency-converter/CurrencyConverter";
import { getToolBySlug } from "@/lib/toolRegistry";

export default function CurrencyConverterPage() {
  const tool = getToolBySlug("currency-converter");

  if (!tool) {
    return <div>Tool not found.</div>;
  }

  return (
    <ToolLayout tool={tool}>
      <CurrencyConverter />
    </ToolLayout>
  );
}
