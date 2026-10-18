import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import BusinessCalculatorTool from '@/components/tools/BusinessCalculatorTool';

export default function Page() {
  return (
    <ExpansionToolPage
      category="finance-calculators"
      eyebrow="Mortgage Underwriting & Purchasing Power"
      title="Mortgage Affordability Calculator"
      description="Calculate maximum affordable home purchase price and loan amount based on income, monthly debts, down payment, and 28/36 DTI limits."
      slug="mortgage-affordability-calculator"
    >
      <BusinessCalculatorTool slug="mortgage-affordability-calculator" />
    </ExpansionToolPage>
  );
}
