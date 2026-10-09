import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import BusinessCalculatorTool from '@/components/tools/BusinessCalculatorTool';

export default function Page() {
  return (
    <ExpansionToolPage
      category="construction-calculators"
      eyebrow="Estimate Joint Compound Quantity"
      title="Drywall Mud Calculator"
      description="Estimate drywall joint-compound containers from drywall area, product coverage and extra allowance."
      slug="drywall-mud-calculator"
    >
      <BusinessCalculatorTool slug="drywall-mud-calculator" />
    </ExpansionToolPage>
  );
}
