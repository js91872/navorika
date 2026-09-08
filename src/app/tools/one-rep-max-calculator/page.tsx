import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import BusinessCalculatorTool from '@/components/tools/BusinessCalculatorTool';

export default function Page() {
  return (
    <ExpansionToolPage
      category="everyday-calculators"
      eyebrow="Strength Training & Submaximal 1RM"
      title="One-Rep Max Calculator"
      description="Calculate your one-rep max (1RM) for bench press, squat, or deadlift using Brzycki, Epley, and Lander formulas, with a complete percentage breakdown table."
      slug="one-rep-max-calculator"
    >
      <BusinessCalculatorTool slug="one-rep-max-calculator" />
    </ExpansionToolPage>
  );
}
