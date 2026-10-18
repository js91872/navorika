import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import BusinessCalculatorTool from '@/components/tools/BusinessCalculatorTool';

export default function Page() {
  return (
    <ExpansionToolPage
      category="finance-calculators"
      eyebrow="Target Milestones & Savings"
      title="Savings Goal Calculator"
      description="Calculate the exact monthly or annual savings required to reach a target financial goal by a target date, given starting savings and interest rate."
      slug="savings-goal-calculator"
    >
      <BusinessCalculatorTool slug="savings-goal-calculator" />
    </ExpansionToolPage>
  );
}
