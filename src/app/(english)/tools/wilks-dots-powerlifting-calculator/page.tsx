import ExpansionToolPage from "@/components/tools/ExpansionToolPage";
import BusinessCalculatorTool from "@/components/tools/BusinessCalculatorTool";

export default function Page() {
  return (
    <ExpansionToolPage
      category="health-calculators"
      eyebrow="Relative strength scoring"
      title="Wilks to DOTS Powerlifting Score Calculator"
      description="Calculate and compare standard Wilks and DOTS strength scores from bodyweight, lifted total, and biological sex using published polynomial formulas."
      slug="wilks-dots-powerlifting-calculator"
    >
      <BusinessCalculatorTool slug="wilks-dots-powerlifting-calculator" />
    </ExpansionToolPage>
  );
}
