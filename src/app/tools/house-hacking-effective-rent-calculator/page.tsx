import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import BusinessCalculatorTool from '@/components/tools/BusinessCalculatorTool';

export default function Page() {
  return (
    <ExpansionToolPage
      category="finance-calculators"
      eyebrow="Residential real estate strategy"
      title="House Hacking Effective Rent Calculator"
      description="Estimate your effective personal housing cost after rent received from roommates, units or other occupants."
      slug="house-hacking-effective-rent-calculator"
    >
      <BusinessCalculatorTool slug="house-hacking-effective-rent-calculator" />
    </ExpansionToolPage>
  );
}
