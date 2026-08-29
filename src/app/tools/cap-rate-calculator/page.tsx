import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import BusinessCalculatorTool from '@/components/tools/BusinessCalculatorTool';

export default function Page() {
  return <ExpansionToolPage category="finance-calculators" eyebrow="Rental property planning" title="Cap Rate Calculator" description="Calculate vacancy-adjusted NOI and capitalization rate with debt excluded from NOI."><BusinessCalculatorTool slug="cap-rate-calculator" /></ExpansionToolPage>;
}
