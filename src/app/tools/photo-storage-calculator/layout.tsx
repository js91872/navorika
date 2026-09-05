import ToolPageContent from '@/components/seo/ToolPageContent';
import { imageToolPages } from '@/data/tool-pages/image';
import { createToolMetadata } from '@/lib/seo/toolPage';

const tool = imageToolPages['photo-storage-calculator'];
export const metadata = createToolMetadata(tool);
export default function Layout({ children }: Readonly<{ children: Readonly<React.ReactNode> }>) {
  return (
    <>
      {children}
      <ToolPageContent tool={tool} />
    </>
  );
}
