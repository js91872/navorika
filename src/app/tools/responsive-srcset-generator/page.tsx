import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import BusinessCalculatorTool from '@/components/tools/BusinessCalculatorTool';

export default function Page() {
  return (
    <ExpansionToolPage
      category="image-tools"
      eyebrow="HTML5 Markup & Image Optimization"
      title="Responsive Srcset Generator"
      description="Generate responsive HTML srcset attributes and modern picture tags with breakpoint widths, DPR multipliers, and WebP/AVIF fallbacks."
      slug="responsive-srcset-generator"
    >
      <BusinessCalculatorTool slug="responsive-srcset-generator" />
    </ExpansionToolPage>
  );
}
