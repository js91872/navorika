import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import FertilizerCalculator from '@/components/tools/FertilizerCalculator';

export default function Page() {
  return (
    <ExpansionToolPage
      category="construction-calculators"
      eyebrow="Area, Application Rate & N-P-K Label"
      title="Fertilizer Calculator"
      description="Find the fertilizer product weight for your lawn, garden, or field from its measured area, a nutrient rate you already have, and the percentages on the fertilizer label."
      slug="fertilizer-calculator"
    >
      <FertilizerCalculator />
    </ExpansionToolPage>
  );
}
