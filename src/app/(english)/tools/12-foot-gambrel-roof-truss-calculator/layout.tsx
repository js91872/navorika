import ToolPageContent from '@/components/seo/ToolPageContent';
import { constructionToolPages } from '@/data/tool-pages/construction';
import { createToolMetadata } from '@/lib/seo/toolPage';

const tool = constructionToolPages['12-foot-gambrel-roof-truss-calculator'];

export const metadata = createToolMetadata(tool);

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}<ToolPageContent tool={tool} /></>;
}
