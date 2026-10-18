import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import BusinessCalculatorTool from '@/components/tools/BusinessCalculatorTool';

export default function Page() {
  return <ExpansionToolPage category="finance-calculators" eyebrow="Rental property planning" title="Rental Yield Calculator" description="Calculate annual rent plus gross and expense-adjusted rental yield." slug="rental-yield-calculator"><BusinessCalculatorTool slug="rental-yield-calculator" /></ExpansionToolPage>;
}
