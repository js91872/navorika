import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import BusinessCalculatorTool from '@/components/tools/BusinessCalculatorTool';

export default function Page() {
  return (
    <ExpansionToolPage
      category="health-calculators"
      eyebrow="Sports Nutrition & Macronutrient Splits"
      title="Macronutrient Calculator"
      description="Calculate daily protein, carbohydrate, and fat targets in grams and calories based on your daily energy intake and fitness goals."
      slug="macronutrient-calculator"
    >
      <BusinessCalculatorTool slug="macronutrient-calculator" />
    </ExpansionToolPage>
  );
}
