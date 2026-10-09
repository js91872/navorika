import ExpansionToolPage from "@/components/tools/ExpansionToolPage";
import BusinessCalculatorTool from "@/components/tools/BusinessCalculatorTool";

export default function Page() {
  return (
    <ExpansionToolPage
      category="health-calculators"
      eyebrow="Daily Calories for Cats & Kittens"
      title="Cat & Kitten Calorie Calculator"
      description="Estimate daily calories for adult cats and kittens from body weight, life stage and activity level using RER and MER energy calculations."
      slug="cat-calorie-calculator"
    >
      <BusinessCalculatorTool slug="cat-calorie-calculator" />
    </ExpansionToolPage>
  );
}
