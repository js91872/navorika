import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import BusinessCalculatorTool from '@/components/tools/BusinessCalculatorTool';

export default function Page() {
  return (
    <ExpansionToolPage
      category="construction-calculators"
      eyebrow="Estimate Joint Compound Quantity"
      title="Drywall Mud Calculator – Buckets, Bags & Tape"
      description="Estimate ready-mix pails or setting-compound bags, plus approximate joint tape length and rolls. Enter your product coverage and project area for an instant material plan."
      slug="drywall-mud-calculator"
    >
      <BusinessCalculatorTool slug="drywall-mud-calculator" />
    </ExpansionToolPage>
  );
}
