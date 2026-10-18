import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import BusinessCalculatorTool from '@/components/tools/BusinessCalculatorTool';

export default function Page() {
  return (
    <ExpansionToolPage
      category="construction-calculators"
      eyebrow="Energy retrofit ROI"
      title="Attic Insulation Payback Calculator"
      description="Estimate attic insulation project cost, annual energy savings, and simple payback period."
      slug="attic-insulation-payback-calculator"
    >
      <BusinessCalculatorTool slug="attic-insulation-payback-calculator" />
    </ExpansionToolPage>
  );
}
