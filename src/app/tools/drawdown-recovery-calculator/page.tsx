import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import BusinessCalculatorTool from '@/components/tools/BusinessCalculatorTool';

export default function Page() {
  return <ExpansionToolPage category="finance-calculators" eyebrow="Investment decision planning" title="Drawdown Recovery Calculator" description="Calculate the percentage gain needed to recover from a portfolio loss."><BusinessCalculatorTool slug="drawdown-recovery-calculator" /></ExpansionToolPage>;
}
