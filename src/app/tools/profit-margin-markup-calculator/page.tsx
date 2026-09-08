import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import BusinessCalculatorTool from '@/components/tools/BusinessCalculatorTool';

export default function Page() {
  return (
    <ExpansionToolPage
      category="finance-calculators"
      eyebrow="Commercial Pricing & Margin Analysis"
      title="Profit Margin & Markup Calculator"
      description="Calculate gross profit, profit margin percentage, markup percentage, selling price, and cost multiplier across pricing scenarios."
      slug="profit-margin-markup-calculator"
    >
      <BusinessCalculatorTool slug="profit-margin-markup-calculator" />
    </ExpansionToolPage>
  );
}
