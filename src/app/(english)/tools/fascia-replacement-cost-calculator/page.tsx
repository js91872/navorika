import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import BusinessCalculatorTool from '@/components/tools/BusinessCalculatorTool';

export default function Page() {
  return (
    <ExpansionToolPage
      category="construction-calculators"
      eyebrow="Estimate Fascia Board Replacement Cost"
      title="Fascia Replacement Cost Calculator"
      description="Estimate fascia board replacement cost from linear feet, material cost, labor rate, waste and removal or disposal allowance."
      slug="fascia-replacement-cost-calculator"
    >
      <BusinessCalculatorTool slug="fascia-replacement-cost-calculator" />
    </ExpansionToolPage>
  );
}
