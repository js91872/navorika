import ToolPageContent from '@/components/seo/ToolPageContent';
import { imageToolPages } from '@/data/tool-pages/image';
import { createToolMetadata } from '@/lib/seo/toolPage';

const tool = imageToolPages['compress-jpg-to-100kb'];
export const metadata = createToolMetadata(tool, 'https://navorika.com/tools/compress-jpg');

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToolPageContent tool={tool} />
    </>
  );
}
