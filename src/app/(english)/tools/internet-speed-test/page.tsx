import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import ToolPageContent from '@/components/seo/ToolPageContent';
import SpeedTest from '@/components/tools/network/SpeedTest';
import { developerToolPages } from '@/data/tool-pages/developer';
import { createToolMetadata } from '@/lib/seo/toolPage';

const tool = developerToolPages['internet-speed-test'];
export const metadata = createToolMetadata(tool);

export default function Page() {
  return (
    <>
      <ExpansionToolPage category="developer-tools" eyebrow="Network Tools"
        title="Internet Speed Test" description={tool.description} slug={tool.slug}>
        <SpeedTest />
      </ExpansionToolPage>
      <ToolPageContent tool={tool} />
    </>
  );
}
