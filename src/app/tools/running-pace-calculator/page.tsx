import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import BusinessCalculatorTool from '@/components/tools/BusinessCalculatorTool';

export default function Page() {
  return (
    <ExpansionToolPage
      category="health-calculators"
      eyebrow="Athletic Pacing & Race Projections"
      title="Running Pace Calculator"
      description="Calculate running pace per kilometer and mile, race finish time, splits, and running speed for any distance from 5K to marathon."
      slug="running-pace-calculator"
    >
      <BusinessCalculatorTool slug="running-pace-calculator" />
    </ExpansionToolPage>
  );
}
