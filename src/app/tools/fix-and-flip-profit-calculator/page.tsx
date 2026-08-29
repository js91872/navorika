import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import BusinessCalculatorTool from '@/components/tools/BusinessCalculatorTool';

export default function Page() {
  return <ExpansionToolPage category="finance-calculators" eyebrow="Real estate investing" title="Fix and Flip Profit Calculator" description="Estimate cost basis, sale proceeds, profit, ROI, margin, and break-even price."><BusinessCalculatorTool slug="fix-and-flip-profit-calculator" /></ExpansionToolPage>;
}
