import PrivacyBadges from '@/components/ui/PrivacyBadges';
import ToolPageContent from '@/components/seo/ToolPageContent';
import SpeedTest from '@/components/tools/network/SpeedTest';
import { developerToolPages } from '@/data/tool-pages/developer';
import { createToolMetadata } from '@/lib/seo/toolPage';

const tool = developerToolPages['internet-speed-test'];
export const metadata = createToolMetadata(tool);

export default function Page() {
  return (
    <>
      <div className="pb-8 text-[var(--foreground)]">
        <h1 className="mb-3 text-2xl font-black tracking-tight sm:text-3xl">Internet Speed Test</h1>
        <div data-tool-interaction><SpeedTest /></div>
        <p className="mt-4 max-w-4xl text-sm leading-relaxed text-[var(--muted-foreground)]">{tool.description}</p>
        <div className="mt-3" aria-label="Tool capabilities"><PrivacyBadges slug={tool.slug} /></div>
      </div>
      <ToolPageContent tool={tool} />
    </>
  );
}
