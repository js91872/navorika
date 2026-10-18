import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import ConfigConverterTool from '@/components/tools/config-data/ConfigConverterTool';

export default function YamlToJsonConverterPage() {
  return (
    <ExpansionToolPage
      category="developer-tools"
      eyebrow="Configuration & Data Interchange"
      title="YAML to JSON Converter"
      description="Convert YAML configuration files to formatted, valid JSON with pretty-print spacing options, schema safety, and browser-local processing."
      slug="yaml-to-json-converter"
    >
      <ConfigConverterTool kind="yaml-to-json" />
    </ExpansionToolPage>
  );
}
