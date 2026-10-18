import ToolPageContent from '@/components/seo/ToolPageContent';
import { everydayToolPages } from '@/data/tool-pages/everyday';
import { createToolMetadata } from '@/lib/seo/toolPage';

const tool = everydayToolPages['tire-size-calculator'];
export const metadata = createToolMetadata(tool);

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <>{children}<ToolPageContent tool={tool} /></>;
}
