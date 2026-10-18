import { constructionToolPages } from '@/data/tool-pages/construction';
import { createToolJsonLd, createToolMetadata } from '@/lib/seo/toolPage';

const tool = constructionToolPages['ladder-safe-reach-calculator'];

export const metadata = createToolMetadata(tool);

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(createToolJsonLd(tool)),
        }}
      />
      {children}
    </>
  );
}
