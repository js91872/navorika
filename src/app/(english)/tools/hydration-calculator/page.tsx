import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import BusinessCalculatorTool from '@/components/tools/BusinessCalculatorTool';

export default function Page() {
  return (
    <ExpansionToolPage
      category="health-calculators"
      eyebrow="Fluid Intake & Physical Recovery"
      title="Hydration Calculator"
      description="Estimate daily recommended water intake in liters, fluid ounces, and standard cups based on body weight, daily exercise duration, and climate."
      slug="hydration-calculator"
    >
      <BusinessCalculatorTool slug="hydration-calculator" />
    </ExpansionToolPage>
  );
}
