import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import BusinessCalculatorTool from '@/components/tools/BusinessCalculatorTool';

export default function Page() {
  return <ExpansionToolPage category="finance-calculators" eyebrow="SaaS performance metric" title="Rule of 40 Calculator" description="Add revenue growth and profitability margin and compare the score with 40."><BusinessCalculatorTool slug="rule-of-40-calculator" /></ExpansionToolPage>;
}
