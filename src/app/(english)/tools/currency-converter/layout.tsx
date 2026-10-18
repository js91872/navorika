import ToolPageContent from '@/components/seo/ToolPageContent';
import { financeToolPages } from '@/data/tool-pages/finance';
import { createToolMetadata } from '@/lib/seo/toolPage';

const tool = financeToolPages['currency-converter'];

export const metadata = createToolMetadata(tool);

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <>{children}<ToolPageContent tool={tool} /></>;
}
