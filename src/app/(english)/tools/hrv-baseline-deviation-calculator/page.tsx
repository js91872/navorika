import ExpansionToolPage from "@/components/tools/ExpansionToolPage";
import BusinessCalculatorTool from "@/components/tools/BusinessCalculatorTool";

export default function Page() {
  return (
    <ExpansionToolPage
      category="health-calculators"
      eyebrow="Biometric deviation analysis"
      title="HRV Baseline Deviation Calculator"
      description="Compare today’s heart rate variability (rMSSD) against your 7-day to 60-day rolling baseline and standard deviation to calculate Z-score and percentage deviation."
      slug="hrv-baseline-deviation-calculator"
    >
      <BusinessCalculatorTool slug="hrv-baseline-deviation-calculator" />
    </ExpansionToolPage>
  );
}
