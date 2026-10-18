import ExpansionToolPage from "@/components/tools/ExpansionToolPage";
import BusinessCalculatorTool from "@/components/tools/BusinessCalculatorTool";

export default function Page() {
  return (
    <ExpansionToolPage
      category="health-calculators"
      eyebrow="How Much Caffeine Is Left in Your System?"
      title="Caffeine Half-Life Calculator"
      description="Estimate how much caffeine may still be in your system after a number of hours using an adjustable caffeine half-life."
      slug="caffeine-half-life-calculator"
    >
      <BusinessCalculatorTool slug="caffeine-half-life-calculator" />
    </ExpansionToolPage>
  );
}
