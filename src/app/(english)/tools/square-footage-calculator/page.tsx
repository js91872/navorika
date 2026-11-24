import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import SquareFeetCalculator from '@/components/tools/SquareFeetCalculator';

export default function Page() {
  return (
    <ExpansionToolPage
      category="construction-calculators"
      eyebrow="Free Online Area Calculator"
      title="Free Sq Ft Calculator (Square Feet Calculator)"
      description="Calculate square footage for rooms, floors, walls and irregular spaces. Measure in feet, inches, meters or centimeters, add multiple areas, and estimate material cost."
      slug="square-footage-calculator"
    >
      <SquareFeetCalculator />
    </ExpansionToolPage>
  );
}
