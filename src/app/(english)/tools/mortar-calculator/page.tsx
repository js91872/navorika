import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import BusinessCalculatorTool from '@/components/tools/BusinessCalculatorTool';

export default function Page() {
  return (
    <ExpansionToolPage
      category="construction-calculators"
      eyebrow="Calculate Mortar for Brickwork & Block Walls"
      title="Mortar Calculator"
      description="Calculate mortar quantity for brickwork or concrete block walls, including estimated premix bags, cement, sand and waste."
      slug="mortar-calculator"
    >
      <BusinessCalculatorTool slug="mortar-calculator" />
    </ExpansionToolPage>
  );
}
