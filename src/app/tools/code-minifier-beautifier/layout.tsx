import { createReviewMetadata } from '@/lib/seo/toolReview';

export const metadata = createReviewMetadata(
  'Code Minifier & Beautifier'
);

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
