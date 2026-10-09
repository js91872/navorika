import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import BusinessCalculatorTool from '@/components/tools/BusinessCalculatorTool';

export default function Page() {
  return (
    <ExpansionToolPage
      category="construction-calculators"
      eyebrow="Calculate Roof Ridge Height from Span & Pitch"
      title="Roof Ridge Height Calculator"
      description="Calculate ridge rise and total roof ridge height for a symmetrical gable roof from building span, roof pitch and wall height."
      slug="roof-ridge-height-calculator"
    >
      <BusinessCalculatorTool slug="roof-ridge-height-calculator" />
    </ExpansionToolPage>
  );
}
