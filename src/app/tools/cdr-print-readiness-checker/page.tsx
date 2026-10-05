import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import BusinessCalculatorTool from '@/components/tools/BusinessCalculatorTool';

export default function Page() {
  return (
    <ExpansionToolPage
      category="developer-tools"
      eyebrow="Check CorelDRAW Artwork Before Printing"
      title="CDR Print Readiness Checker"
      description="Check whether your CorelDRAW artwork is ready for printing. Review bleed, CMYK color, fonts to curves, image resolution, transparency, overprint and export format before sending it to a print shop."
      slug="cdr-print-readiness-checker"
    >
      <BusinessCalculatorTool slug="cdr-print-readiness-checker" />
    </ExpansionToolPage>
  );
}
