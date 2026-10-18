import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import TypescriptToZodConverter from '@/components/tools/TypescriptToZodConverter';

export default function TypescriptToZodConverterPage() {
  return (
    <ExpansionToolPage
      category="developer-tools"
      eyebrow="Schema Validation & Type Safety"
      title="TypeScript to Zod Schema Converter"
      description="Convert TypeScript interfaces and type definitions into starter Zod schemas locally without dynamic code execution."
      slug="typescript-to-zod-schema-converter"
    >
      <TypescriptToZodConverter />
    </ExpansionToolPage>
  );
}
