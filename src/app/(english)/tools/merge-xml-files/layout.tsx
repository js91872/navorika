import ToolPageContent from '@/components/seo/ToolPageContent';
import { developerToolPages } from '@/data/tool-pages/developer';
import { createToolMetadata } from '@/lib/seo/toolPage';

const tool = developerToolPages['merge-xml-files'];

export const metadata = createToolMetadata(tool);

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {children}
      <ToolPageContent tool={tool} />
    </>
  );
}
