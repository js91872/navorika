import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import BusinessCalculatorTool from '@/components/tools/BusinessCalculatorTool';

export default function Page() {
  return (
    <ExpansionToolPage
      category="developer-tools"
      eyebrow="CorelDRAW Prepress Preflight"
      title="CDR Print Readiness Checker"
      description="Run a comprehensive preflight checklist for CorelDRAW files to verify bleed, curves, color mode, resolution, and export readiness before sending to print."
      slug="cdr-print-readiness-checker"
    >
      <BusinessCalculatorTool slug="cdr-print-readiness-checker" />
    </ExpansionToolPage>
  );
}
