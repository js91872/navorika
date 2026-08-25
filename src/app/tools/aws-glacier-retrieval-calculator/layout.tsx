import { developerToolPages } from '@/data/tool-pages/developer';
import { createToolJsonLd, createToolMetadata } from '@/lib/seo/toolPage';

const tool = developerToolPages['aws-glacier-retrieval-calculator'];

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
