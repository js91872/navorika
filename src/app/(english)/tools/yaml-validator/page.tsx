import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import YamlValidatorTool from '@/components/tools/config-data/YamlValidatorTool';

export default function YamlValidatorPage() {
  return (
    <ExpansionToolPage
      category="developer-tools"
      eyebrow="Syntax Validation & Diagnostics"
      title="YAML Validator"
      description="Validate YAML syntax, detect indentation errors, inspect document structure, and resolve parsing issues locally in your browser."
      slug="yaml-validator"
    >
      <YamlValidatorTool />
    </ExpansionToolPage>
  );
}
