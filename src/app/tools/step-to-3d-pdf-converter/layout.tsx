import ToolPageContent from '@/components/seo/ToolPageContent';
import { cadToolPages } from '@/data/tool-pages/cad';
import { createToolMetadata } from '@/lib/seo/toolPage';

const tool = cadToolPages['step-to-3d-pdf-converter'];

export const metadata = createToolMetadata(tool);

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToolPageContent tool={tool} />
    </>
  );
}
