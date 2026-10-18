import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import BusinessCalculatorTool from '@/components/tools/BusinessCalculatorTool';

export default function Page() {
  return (
    <ExpansionToolPage
      category="finance-calculators"
      eyebrow="Margin vs Markup Pricing Calculator"
      title="Profit Margin & Markup Calculator"
      description="Calculate profit margin, markup, gross profit and selling price from cost and price, or work backward from a target margin or markup."
      slug="profit-margin-markup-calculator"
    >
      <BusinessCalculatorTool slug="profit-margin-markup-calculator" />
    </ExpansionToolPage>
  );
}
