import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import CronExpressionGeneratorTool from '@/components/tools/cron/CronExpressionGeneratorTool';

export default function CronExpressionGeneratorPage() {
  return (
    <ExpansionToolPage
      category="developer-tools"
      eyebrow="Job Scheduling & Cron Expressions"
      title="Cron Expression Generator & Explainer"
      description="Generate, edit, and explain standard 5-field Linux cron expressions with visual builders, common presets, next 5 scheduled runs, and dialect guides."
      slug="cron-expression-generator"
    >
      <CronExpressionGeneratorTool />
    </ExpansionToolPage>
  );
}
