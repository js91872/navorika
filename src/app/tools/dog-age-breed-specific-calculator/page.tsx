import ExpansionToolPage from "@/components/tools/ExpansionToolPage";
import BusinessCalculatorTool from "@/components/tools/BusinessCalculatorTool";

export default function Page() {
  return (
    <ExpansionToolPage
      category="health-calculators"
      eyebrow="Canine life stages"
      title="Dog Age Calculator — Breed Specific"
      description="Calculate a dog’s human-equivalent age using breed-size life stage curves across puppy, young adult, mature adult, and senior phases."
      slug="dog-age-breed-specific-calculator"
    >
      <BusinessCalculatorTool slug="dog-age-breed-specific-calculator" />
    </ExpansionToolPage>
  );
}
