import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import DeveloperUtilsHub from '@/components/tools/developer/DeveloperUtilsHub';

export default function Page() {
  return (
    <ExpansionToolPage
      category="developer-tools"
      eyebrow="Developer Suite"
      title="Developer Utilities Hub"
      description="A browser-based suite for regex testing, Unix timestamp conversion, identifiers, and code scaffolding."
      slug="developer-utils"
    >
      <DeveloperUtilsHub />
    </ExpansionToolPage>
  );
}
