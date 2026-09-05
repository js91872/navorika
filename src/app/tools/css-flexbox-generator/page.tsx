import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import CssFlexboxGenerator from '@/components/tools/CssFlexboxGenerator';

export default function CssFlexboxGeneratorPage() {
  return (
    <ExpansionToolPage
      category="developer-tools"
      eyebrow="CSS Layout & Responsive Design"
      title="CSS Flexbox Generator"
      description="Build and preview CSS Flexbox layouts with real-time controls for alignment, direction, wrapping, and modern gap spacing."
      slug="css-flexbox-generator"
    >
      <CssFlexboxGenerator />
    </ExpansionToolPage>
  );
}
