import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import BusinessCalculatorTool from '@/components/tools/BusinessCalculatorTool';

export default function Page() {
  return (
    <ExpansionToolPage
      category="developer-tools"
      eyebrow="Config Parsing & Data Interchange"
      title="YAML / JSON Converter"
      description="Convert YAML configuration files to JSON and JSON to clean YAML locally in your browser with syntax validation and indentation controls."
      slug="yaml-json-converter"
    >
      <BusinessCalculatorTool slug="yaml-json-converter" />
    </ExpansionToolPage>
  );
}
