import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import BusinessCalculatorTool from '@/components/tools/BusinessCalculatorTool';

export default function Page() {
  return (
    <ExpansionToolPage
      category="construction-calculators"
      eyebrow="Ramp slope & length geometry"
      title="Shed Ramp Angle Calculator"
      description="Calculate shed ramp slope angle, grade percentage, rise-to-run ratio, and ramp surface length."
      slug="shed-ramp-angle-calculator"
    >
      <BusinessCalculatorTool slug="shed-ramp-angle-calculator" />
    </ExpansionToolPage>
  );
}
