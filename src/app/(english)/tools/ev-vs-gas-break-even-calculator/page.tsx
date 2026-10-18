import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import BusinessCalculatorTool from '@/components/tools/BusinessCalculatorTool';

export default function Page() {
  return (
    <ExpansionToolPage
      category="finance-calculators"
      eyebrow="Automotive financial analysis"
      title="EV vs Gas Break-Even Calculator"
      description="Compare electric and gasoline vehicle purchase and operating costs and estimate when fuel and maintenance savings recover an EV price premium."
      slug="ev-vs-gas-break-even-calculator"
    >
      <BusinessCalculatorTool slug="ev-vs-gas-break-even-calculator" />
    </ExpansionToolPage>
  );
}
