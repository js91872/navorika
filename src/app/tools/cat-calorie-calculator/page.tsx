import ExpansionToolPage from "@/components/tools/ExpansionToolPage";
import BusinessCalculatorTool from "@/components/tools/BusinessCalculatorTool";

export default function Page() {
  return (
    <ExpansionToolPage
      category="health-calculators"
      eyebrow="Feline nutrition & energy"
      title="Cat Calorie Calculator"
      description="Calculate resting energy requirements (RER) and maintenance energy requirements (MER) in kcal/day for cats based on body weight, life stage, and neuter status."
      slug="cat-calorie-calculator"
    >
      <BusinessCalculatorTool slug="cat-calorie-calculator" />
    </ExpansionToolPage>
  );
}
