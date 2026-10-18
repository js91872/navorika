import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import BusinessCalculatorTool from '@/components/tools/BusinessCalculatorTool';

export default function Page() {
  return (
    <ExpansionToolPage
      category="construction-calculators"
      eyebrow="Calculate Bulk Material Volume"
      title="Cubic Yard Calculator"
      description="Calculate cubic yards from length, width and depth for concrete, gravel, soil, mulch and other bulk materials."
      slug="cubic-yard-calculator"
    >
      <BusinessCalculatorTool slug="cubic-yard-calculator" />
    </ExpansionToolPage>
  );
}
