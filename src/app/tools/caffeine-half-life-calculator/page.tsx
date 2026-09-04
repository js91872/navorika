import ExpansionToolPage from "@/components/tools/ExpansionToolPage";
import BusinessCalculatorTool from "@/components/tools/BusinessCalculatorTool";

export default function Page() {
  return (
    <ExpansionToolPage
      category="health-calculators"
      eyebrow="Pharmacokinetics & wind-down"
      title="Caffeine Half-Life Calculator"
      description="Model caffeine metabolism over time, estimate remaining blood caffeine levels, and plan wind-down timing using standard pharmacokinetic elimination."
      slug="caffeine-half-life-calculator"
    >
      <BusinessCalculatorTool slug="caffeine-half-life-calculator" />
    </ExpansionToolPage>
  );
}
