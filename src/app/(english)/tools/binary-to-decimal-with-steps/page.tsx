import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import BinaryToDecimalTool from '@/components/tools/number-systems/BinaryToDecimalTool';

export default function BinaryToDecimalWithStepsPage() {
  return (
    <ExpansionToolPage
      category="developer-tools"
      eyebrow="Number Systems & Educational Calculations"
      title="Binary to Decimal Converter with Steps"
      description="Convert binary numbers to decimal with step-by-step mathematical explanations, powers of 2 breakdown, positional bit tables, and BigInt precision."
      slug="binary-to-decimal-with-steps"
    >
      <BinaryToDecimalTool />
    </ExpansionToolPage>
  );
}
