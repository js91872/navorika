import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import BusinessCalculatorTool from '@/components/tools/BusinessCalculatorTool';

export default function Page() {
  return (
    <ExpansionToolPage
      category="image-tools"
      eyebrow="Print Layout & Bleed Margins"
      title="Print Bleed Calculator"
      description="Calculate required document dimensions, trim margins, total bleed area, and aspect ratio from finished print trim sizes and bleed allowances."
      slug="print-bleed-calculator"
    >
      <BusinessCalculatorTool slug="print-bleed-calculator" />
    </ExpansionToolPage>
  );
}
