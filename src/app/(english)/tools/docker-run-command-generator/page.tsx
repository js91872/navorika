import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import DockerRunGenerator from '@/components/tools/DockerRunGenerator';

export default function DockerRunGeneratorPage() {
  return (
    <ExpansionToolPage
      category="developer-tools"
      eyebrow="Containers & DevOps CLI"
      title="Docker Run Command Generator"
      description="Construct sanitized, validated docker run commands with image, container name, port mapping, restart policy, environment variables, and volume mounts."
      slug="docker-run-command-generator"
    >
      <DockerRunGenerator />
    </ExpansionToolPage>
  );
}
