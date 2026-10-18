import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import ConfigConverterTool from '@/components/tools/config-data/ConfigConverterTool';

export default function JsonToTomlConverterPage() {
  return (
    <ExpansionToolPage
      category="developer-tools"
      eyebrow="Configuration & Data Interchange"
      title="JSON to TOML Converter"
      description="Convert JSON objects into valid TOML 1.0 configuration files with safe handling of tables, arrays, strings, and types directly in your browser."
      slug="json-to-toml-converter"
    >
      <ConfigConverterTool kind="json-to-toml" />
    </ExpansionToolPage>
  );
}
