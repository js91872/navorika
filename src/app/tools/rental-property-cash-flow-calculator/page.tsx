import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import BusinessCalculatorTool from '@/components/tools/BusinessCalculatorTool';

export default function Page() {
  return <ExpansionToolPage category="finance-calculators" eyebrow="Rental property planning" title="Rental Property Cash Flow Calculator" description="Estimate effective income, operating expenses, NOI, debt service, and cash flow."><BusinessCalculatorTool slug="rental-property-cash-flow-calculator" /></ExpansionToolPage>;
}
