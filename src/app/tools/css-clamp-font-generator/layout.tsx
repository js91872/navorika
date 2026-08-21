import ToolPageContent from '@/components/seo/ToolPageContent';
import { developerToolPages } from '@/data/tool-pages/developer';
import { createToolMetadata } from '@/lib/seo/toolPage';

const tool = developerToolPages['css-clamp-font-generator'];

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
