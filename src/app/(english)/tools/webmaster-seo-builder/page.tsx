import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import WebmasterSeoHub from '@/components/tools/webmaster/WebmasterSeoHub';

export default function Page() {
  return (
    <ExpansionToolPage
      category="developer-tools"
      eyebrow="Webmaster Suite"
      title="Webmaster SEO Tools"
      description="Browser-based utilities for campaign URLs, page metadata, search optimization, and crawler directives."
      slug="webmaster-seo-builder"
    >
      <WebmasterSeoHub />
    </ExpansionToolPage>
  );
}
