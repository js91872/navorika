import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import BusinessCalculatorTool from '@/components/tools/BusinessCalculatorTool';

export default function Page() {
  return (
    <ExpansionToolPage
      category="construction-calculators"
      eyebrow="Calculate Rafter Length from Pitch & Run"
      title="Rafter Length Calculator"
      description="Calculate common rafter length, rise and roof angle from horizontal run, roof pitch and optional overhang."
      slug="rafter-length-calculator"
    >
      <BusinessCalculatorTool slug="rafter-length-calculator" />
    </ExpansionToolPage>
  );
}
