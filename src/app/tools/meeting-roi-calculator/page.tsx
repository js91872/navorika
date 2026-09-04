import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import BusinessCalculatorTool from '@/components/tools/BusinessCalculatorTool';

export default function Page() {
  return (
    <ExpansionToolPage
      category="finance-calculators"
      eyebrow="Meeting cost & break-even"
      title="Meeting ROI Calculator"
      description="Calculate the labor cost of a meeting from attendees, compensation, overhead, duration and frequency, then compare the cost with estimated value created."
      slug="meeting-roi-calculator"
    >
      <BusinessCalculatorTool slug="meeting-roi-calculator" />
    </ExpansionToolPage>
  );
}
