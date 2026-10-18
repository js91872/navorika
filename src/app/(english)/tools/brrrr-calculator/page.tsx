import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import BusinessCalculatorTool from '@/components/tools/BusinessCalculatorTool';

export default function Page() {
  return <ExpansionToolPage category="finance-calculators" eyebrow="Real estate investing" title="BRRRR Calculator" description="Estimate project cash, refinance proceeds, cash left in the deal, and rental return." slug="brrrr-calculator"><BusinessCalculatorTool slug="brrrr-calculator" /></ExpansionToolPage>;
}
