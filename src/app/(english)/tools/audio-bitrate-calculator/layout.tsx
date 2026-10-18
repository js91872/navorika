import ToolPageContent from '@/components/seo/ToolPageContent';
import { audioVideoToolPages } from '@/data/tool-pages/audioVideo';
import { createToolMetadata } from '@/lib/seo/toolPage';

const tool = audioVideoToolPages['audio-bitrate-calculator'];

export const metadata = createToolMetadata(tool);

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToolPageContent tool={tool} />
    </>
  );
}
