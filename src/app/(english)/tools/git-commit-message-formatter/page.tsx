import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import GitCommitFormatter from '@/components/tools/GitCommitFormatter';

export default function GitCommitFormatterPage() {
  return (
    <ExpansionToolPage
      category="developer-tools"
      eyebrow="Git Workflow & Standards"
      title="Git Commit Message Formatter"
      description="Format clean, standardized Git commit messages using Conventional Commits specifications with type, scope, and breaking change flags."
      slug="git-commit-message-formatter"
    >
      <GitCommitFormatter />
    </ExpansionToolPage>
  );
}
