import type { Metadata } from 'next';

export const toolsUnderReview = new Set([
  'add-image-to-pdf',
  'blur-face',
  'bioluminescent-reader',
  'code-minifier-beautifier',
  'convert-jpg-to-png',
  'convert-jpg-to-webp',
  'convert-png-to-jpg',
  'compress-pdf',
  'compress-png',
  'extract-pdf-text',
  'heic-to-jpg',
  'heic-to-png',
  'html-to-image',
  'developer-utilities',
  'image-converter',
  'image-dpi-converter',
  'image-metadata-viewer',
  'image-to-pdf',
  'jpg-to-pdf',
  'pdf-to-image',
  'pdf-to-jpg',
  'png-to-svg',
  'markup-formatter',
  'photo-collage-maker',
  'protect-pdf',
  'reorder-pdf',
  'svg-to-png',
  'unlock-pdf',
  'webp-to-pdf',
  'web-crypto-studio',
  'webp-to-png',
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
