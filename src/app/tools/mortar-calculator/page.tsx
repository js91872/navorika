import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import BusinessCalculatorTool from '@/components/tools/BusinessCalculatorTool';

export default function Page() {
  return (
    <ExpansionToolPage
      category="construction-calculators"
      eyebrow="Mortar for Brick & Block Walls"
      title="Mortar Calculator"
      description="Calculate how much mortar you need for brick or concrete block walls, including estimated bags, cement, sand, and waste."
      slug="mortar-calculator"
    >
      <BusinessCalculatorTool slug="mortar-calculator" />
    </ExpansionToolPage>
  );
}
