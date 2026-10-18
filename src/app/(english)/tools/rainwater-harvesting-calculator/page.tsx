import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import BusinessCalculatorTool from '@/components/tools/BusinessCalculatorTool';

export default function Page() {
  return (
    <ExpansionToolPage
      category="construction-calculators"
      eyebrow="Catchment & Cistern Sizing"
      title="Rainwater Harvesting Calculator"
      description="Calculate harvestable rainwater volume from roof catchment area, annual rainfall, and roof material runoff coefficients, then size a storage tank."
      slug="rainwater-harvesting-calculator"
    >
      <BusinessCalculatorTool slug="rainwater-harvesting-calculator" />
    </ExpansionToolPage>
  );
}
