import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import BusinessCalculatorTool from '@/components/tools/BusinessCalculatorTool';

export default function Page() {
  return (
    <ExpansionToolPage
      category="finance-calculators"
      eyebrow="Cost Accounting & Unit Economics"
      title="Break-Even Calculator"
      description="Calculate break-even sales volume in units and revenue, contribution margin per unit, margin ratio, and margin of safety."
      slug="break-even-calculator"
    >
      <BusinessCalculatorTool slug="break-even-calculator" />
    </ExpansionToolPage>
  );
}
