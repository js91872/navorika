import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import BusinessCalculatorTool from '@/components/tools/BusinessCalculatorTool';

export default function Page() {
  return (
    <ExpansionToolPage
      category="everyday-calculators"
      eyebrow="Home energy efficiency"
      title="Heat Pump vs Furnace Cost Calculator"
      description="Compare estimated annual heating energy costs for an electric heat pump and a fuel furnace using efficiency, energy prices and heating demand."
      slug="heat-pump-vs-furnace-cost-calculator"
    >
      <BusinessCalculatorTool slug="heat-pump-vs-furnace-cost-calculator" />
    </ExpansionToolPage>
  );
}
