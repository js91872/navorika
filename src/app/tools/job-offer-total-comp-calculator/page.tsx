import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import BusinessCalculatorTool from '@/components/tools/BusinessCalculatorTool';

export default function Page() {
  return (
    <ExpansionToolPage
      category="finance-calculators"
      eyebrow="Compensation evaluation"
      title="Job Offer Total Compensation Calculator"
      description="Normalize salary, bonus, equity, retirement contributions and recurring benefits into estimated annual total compensation."
      slug="job-offer-total-comp-calculator"
    >
      <BusinessCalculatorTool slug="job-offer-total-comp-calculator" />
    </ExpansionToolPage>
  );
}
