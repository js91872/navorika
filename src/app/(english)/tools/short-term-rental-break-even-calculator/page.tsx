import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import BusinessCalculatorTool from '@/components/tools/BusinessCalculatorTool';

export default function Page() {
  return (
    <ExpansionToolPage
      category="finance-calculators"
      eyebrow="Short-term rental economics"
      title="Short-Term Rental Break-Even Calculator"
      description="Estimate short-term rental revenue, operating costs, monthly profit and the occupancy rate required to break even."
      slug="short-term-rental-break-even-calculator"
    >
      <BusinessCalculatorTool slug="short-term-rental-break-even-calculator" />
    </ExpansionToolPage>
  );
}
