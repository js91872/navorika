import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import BusinessCalculatorTool from '@/components/tools/BusinessCalculatorTool';

export default function Page() {
  return (
    <ExpansionToolPage
      category="construction-calculators"
      eyebrow="Airflow velocity & duct area"
      title="HVAC Duct CFM Calculator"
      description="Estimate airflow through round or rectangular HVAC ducts from duct cross-sectional area and air velocity."
      slug="hvac-duct-cfm-calculator"
    >
      <BusinessCalculatorTool slug="hvac-duct-cfm-calculator" />
    </ExpansionToolPage>
  );
}
