/** Add content only after native copy, runtime states and route checks are complete. */
export const translatedGuides: readonly string[] = [];
export const translatedPublicPages: readonly string[] = ['/'];

/** Full-rollout acceptance includes these surfaces, beyond individual tool pages. */
export const requiredLocalizedSurfaces = [
  'home', 'tool-directory', 'categories', 'toolkits', 'guide-directory', 'search',
  'navigation', 'breadcrumbs', 'upload-feedback', 'copy-and-download-feedback',
  'errors', 'server-responses', 'metadata', 'structured-data', 'sitemap', 'language-alternates',
] as const;
/** A surface is fully verified only when it works across the complete inventory. */
export const verifiedLocalizedSurfaces: readonly (typeof requiredLocalizedSurfaces[number])[] = [];
