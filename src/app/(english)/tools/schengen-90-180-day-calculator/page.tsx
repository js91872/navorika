import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import SchengenCalculator from '@/components/tools/SchengenCalculator';

export default function Page() {
  return (
    <ExpansionToolPage
      category="everyday-calculators"
      eyebrow="Travel compliance"
      title="Schengen 90/180 Day Calculator"
      description="Track entered Schengen stays against the rolling 90-days-in-180-days rule and estimate days used and remaining for a selected reference date."
      slug="schengen-90-180-day-calculator"
    >
      <SchengenCalculator />
    </ExpansionToolPage>
  );
}
