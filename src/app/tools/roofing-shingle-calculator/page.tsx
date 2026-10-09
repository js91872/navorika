import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import BusinessCalculatorTool from '@/components/tools/BusinessCalculatorTool';

export default function Page() {
  return (
    <ExpansionToolPage
      category="construction-calculators"
      eyebrow="Estimate Roofing Squares & Bundles"
      title="Roofing Shingle Calculator"
      description="Estimate roofing squares and shingle bundles from roof surface area, waste allowance and bundles per square."
      slug="roofing-shingle-calculator"
    >
      <BusinessCalculatorTool slug="roofing-shingle-calculator" />
    </ExpansionToolPage>
  );
}
