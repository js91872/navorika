import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import BusinessCalculatorTool from '@/components/tools/BusinessCalculatorTool';

export default function Page() {
  return (
    <ExpansionToolPage
      category="construction-calculators"
      eyebrow="Structural beam & floor stiffness"
      title="Joist Deflection Calculator"
      description="Estimate simple beam or joist deflection under uniformly distributed load and compare against L/360 limits."
      slug="joist-deflection-calculator"
    >
      <BusinessCalculatorTool slug="joist-deflection-calculator" />
    </ExpansionToolPage>
  );
}
