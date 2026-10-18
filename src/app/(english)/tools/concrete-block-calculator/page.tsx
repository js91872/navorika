import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import BusinessCalculatorTool from '@/components/tools/BusinessCalculatorTool';

export default function Page() {
  return (
    <ExpansionToolPage
      category="construction-calculators"
      eyebrow="Masonry Takeoffs & Block Sizing"
      title="Concrete Block Calculator"
      description="Estimate CMU concrete blocks, mortar, core-fill grout, and waste allowance for block walls and foundations."
      slug="concrete-block-calculator"
    >
      <BusinessCalculatorTool slug="concrete-block-calculator" />
    </ExpansionToolPage>
  );
}
