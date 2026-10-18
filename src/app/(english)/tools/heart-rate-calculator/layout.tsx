import { healthToolPages } from '@/data/tool-pages/health';
import { createToolJsonLd, createToolMetadata } from '@/lib/seo/toolPage';

const tool = healthToolPages['heart-rate-calculator'];

export const metadata = createToolMetadata(tool);

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(createToolJsonLd(tool)) }} />
      {children}
    </>
  );
}
