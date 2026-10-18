import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import GitignoreGenerator from '@/components/tools/GitignoreGenerator';

export default function GitignoreGeneratorPage() {
  return (
    <ExpansionToolPage
      category="developer-tools"
      eyebrow="Version Control & Repository Setup"
      title=".gitignore Generator"
      description="Generate clean, deterministic .gitignore files for modern languages, frameworks, operating systems, and IDEs."
      slug="gitignore-generator"
    >
      <GitignoreGenerator />
    </ExpansionToolPage>
  );
}
