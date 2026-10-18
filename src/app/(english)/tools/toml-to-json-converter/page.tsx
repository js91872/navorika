import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import ConfigConverterTool from '@/components/tools/config-data/ConfigConverterTool';

export default function TomlToJsonConverterPage() {
  return (
    <ExpansionToolPage
      category="developer-tools"
      eyebrow="Configuration & Data Interchange"
      title="TOML to JSON Converter"
      description="Convert TOML configuration tables and arrays to formatted JSON with customizable indentation, syntax error detection, and local processing."
      slug="toml-to-json-converter"
    >
      <ConfigConverterTool kind="toml-to-json" />
    </ExpansionToolPage>
  );
}
