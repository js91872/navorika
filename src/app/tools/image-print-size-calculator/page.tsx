import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import BusinessCalculatorTool from '@/components/tools/BusinessCalculatorTool';

export default function Page() {
  return (
    <ExpansionToolPage
      category="image-tools"
      eyebrow="Pixels to Print Size"
      title="Image Print Size Calculator"
      description="Enter image dimensions in pixels to calculate the print size in inches or centimeters at your chosen PPI."
      slug="image-print-size-calculator"
    >
      <BusinessCalculatorTool slug="image-print-size-calculator" />
    </ExpansionToolPage>
  );
}
