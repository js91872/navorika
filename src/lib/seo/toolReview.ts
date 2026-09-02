import type { Metadata } from 'next';

export const toolsUnderReview = new Set([
  'blur-face',
  'bioluminescent-reader',
  'html-to-image',
  'image-dpi-converter',
  'png-to-svg',
  'protect-pdf',
  'unlock-pdf',
]);

export function createReviewMetadata(toolName: string): Metadata {
  const slug = toolName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  return {
    title: `${toolName} Under Review`,
    description: `${toolName} is being rebuilt and is temporarily excluded from search indexing.`,
    alternates: { canonical: `https://navorika.com/tools/${slug}` },
    robots: { index: false, follow: true },
  };
}
