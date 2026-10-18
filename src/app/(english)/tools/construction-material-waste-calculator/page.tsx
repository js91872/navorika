import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import BusinessCalculatorTool from '@/components/tools/BusinessCalculatorTool';

export default function Page() {
  return (
    <ExpansionToolPage
      category="construction-calculators"
      eyebrow="Material allowance & overage planning"
      title="Construction Material Waste Calculator"
      description="Calculate material order quantities and waste allowance costs from net project requirements."
      slug="construction-material-waste-calculator"
    >
      <BusinessCalculatorTool slug="construction-material-waste-calculator" />
    </ExpansionToolPage>
  );
}
