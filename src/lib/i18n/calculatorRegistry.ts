export const localizedCalculatorSlugs = [
  'image-file-size-estimator', 'photo-storage-calculator', 'image-bandwidth-calculator',
  'square-footage-calculator', 'cubic-yard-calculator',
] as const;
export type LocalizedCalculatorSlug = (typeof localizedCalculatorSlugs)[number];
export const isLocalizedCalculator = (slug: string): slug is LocalizedCalculatorSlug =>
  localizedCalculatorSlugs.some((candidate) => candidate === slug);

