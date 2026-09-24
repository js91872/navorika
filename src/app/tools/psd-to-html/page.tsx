import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import PsdToHtmlTool from '@/components/tools/PsdToHtmlTool';

export default function PsdToHtmlPage() {
  return (
    <ExpansionToolPage
      category="developer-tools"
      eyebrow="Design Handoff & Code Generator"
      title="PSD to HTML Converter"
      description="Inspect PSD mockups, verify color space and canvas dimensions, generate clean semantic HTML5/CSS flexbox templates or responsive email code, and export developer-ready handoff briefs."
      slug="psd-to-html"
    >
      <PsdToHtmlTool />
    </ExpansionToolPage>
  );
}
