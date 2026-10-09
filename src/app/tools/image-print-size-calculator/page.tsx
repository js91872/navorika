import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import BusinessCalculatorTool from '@/components/tools/BusinessCalculatorTool';

export default function Page() {
  return (
    <ExpansionToolPage
      category="image-tools"
      eyebrow="Pixels to Inches & Centimeters"
      title="Image Print Size Calculator"
      description="Enter image dimensions in pixels and PPI to calculate photo print size in inches or centimeters, including common 300 PPI printing."
      slug="image-print-size-calculator"
    >
      <BusinessCalculatorTool slug="image-print-size-calculator" />
    </ExpansionToolPage>
  );
}
