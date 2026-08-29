import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import BusinessCalculatorTool from '@/components/tools/BusinessCalculatorTool';

export default function Page() {
  return <ExpansionToolPage category="finance-calculators" eyebrow="Rental property planning" title="Cash-on-Cash Return Calculator" description="Compare annual pre-tax cash flow with total initial property cash invested."><BusinessCalculatorTool slug="cash-on-cash-return-calculator" /></ExpansionToolPage>;
}
