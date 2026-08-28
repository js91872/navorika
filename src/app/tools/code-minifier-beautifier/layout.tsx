import ToolPageContent from '@/components/seo/ToolPageContent';
import { developerToolPages } from '@/data/tool-pages/developer';
import { createToolMetadata } from '@/lib/seo/toolPage';

const tool = developerToolPages['code-minifier-beautifier'];
export const metadata = createToolMetadata(tool);

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}<ToolPageContent tool={tool} /></>;
}
