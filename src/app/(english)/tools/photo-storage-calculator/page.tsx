import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import BusinessCalculatorTool from '@/components/tools/BusinessCalculatorTool';

export default function Page() {
  return (
    <ExpansionToolPage
      category="image-tools"
      eyebrow="Storage capacity & card planning"
      title="Photo Storage Calculator"
      description="Estimate how many photos fit on a memory card, drive, or cloud plan based on average file size."
      slug="photo-storage-calculator"
    >
      <BusinessCalculatorTool slug="photo-storage-calculator" />
    </ExpansionToolPage>
  );
}
