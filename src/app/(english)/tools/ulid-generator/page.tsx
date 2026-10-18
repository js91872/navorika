import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import UlidGeneratorTool from '@/components/tools/identifiers/UlidGeneratorTool';

export default function UlidGeneratorPage() {
  return (
    <ExpansionToolPage
      category="developer-tools"
      eyebrow="Identifiers & Cryptography"
      title="ULID Generator"
      description="Generate standards-compliant 128-bit ULIDs, bulk generate up to 100 sortable IDs, inspect embedded millisecond timestamps, and decode Crockford Base32."
      slug="ulid-generator"
    >
      <UlidGeneratorTool />
    </ExpansionToolPage>
  );
}
