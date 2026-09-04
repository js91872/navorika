import ExpansionToolPage from "@/components/tools/ExpansionToolPage";
import BusinessCalculatorTool from "@/components/tools/BusinessCalculatorTool";

export default function Page() {
  return (
    <ExpansionToolPage
      category="health-calculators"
      eyebrow="Puppy weight projection"
      title="Puppy Growth Predictor"
      description="Estimate your puppy’s adult weight and track developmental milestones based on current age, weight, and breed adult size category."
      slug="puppy-growth-predictor"
    >
      <BusinessCalculatorTool slug="puppy-growth-predictor" />
    </ExpansionToolPage>
  );
}
