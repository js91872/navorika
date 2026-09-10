import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import ConfigConverterTool from '@/components/tools/config-data/ConfigConverterTool';

export default function JsonToYamlConverterPage() {
  return (
    <ExpansionToolPage
      category="developer-tools"
      eyebrow="Configuration & Data Interchange"
      title="JSON to YAML Converter"
      description="Convert JSON data into clean, formatted YAML with 2-space or 4-space indentation, syntax validation, and instant browser-local processing."
      slug="json-to-yaml-converter"
    >
      <ConfigConverterTool kind="json-to-yaml" />
    </ExpansionToolPage>
  );
}
