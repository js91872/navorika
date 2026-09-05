import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import BusinessCalculatorTool from '@/components/tools/BusinessCalculatorTool';

export default function Page() {
  return (
    <ExpansionToolPage
      category="image-tools"
      eyebrow="Print resolution & density"
      title="Image Print Size Calculator"
      description="Calculate physical print dimensions in inches and centimeters from pixel dimensions and PPI."
      slug="image-print-size-calculator"
    >
      <BusinessCalculatorTool slug="image-print-size-calculator" />
    </ExpansionToolPage>
  );
}
