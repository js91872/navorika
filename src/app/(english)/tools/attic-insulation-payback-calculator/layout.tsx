import ToolPageContent from '@/components/seo/ToolPageContent';
import { constructionToolPages } from '@/data/tool-pages/construction';
import { createToolMetadata } from '@/lib/seo/toolPage';

const tool = constructionToolPages['attic-insulation-payback-calculator'];
export const metadata = createToolMetadata(tool);
export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      {children}
      <ToolPageContent tool={tool} />
    </>
  );
}
