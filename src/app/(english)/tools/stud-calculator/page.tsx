import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import BusinessCalculatorTool from '@/components/tools/BusinessCalculatorTool';

export default function Page() {
  return (
    <ExpansionToolPage
      category="construction-calculators"
      eyebrow="Estimate Wall Stud Quantity"
      title="Stud Calculator"
      description="Estimate how many wall studs you need from wall length, on-center spacing, extras and waste."
      slug="stud-calculator"
    >
      <BusinessCalculatorTool slug="stud-calculator" />
    </ExpansionToolPage>
  );
}
