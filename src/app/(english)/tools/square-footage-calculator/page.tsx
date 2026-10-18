import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import BusinessCalculatorTool from '@/components/tools/BusinessCalculatorTool';

export default function Page() {
  return (
    <ExpansionToolPage
      category="construction-calculators"
      eyebrow="Calculate Area in Square Feet"
      title="Square Footage Calculator"
      description="Calculate square footage from length and width, then see square yards and square meters."
      slug="square-footage-calculator"
    >
      <BusinessCalculatorTool slug="square-footage-calculator" />
    </ExpansionToolPage>
  );
}
