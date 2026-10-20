export const locales = ['fr', 'it', 'pt', 'es', 'ar', 'ru', 'de'] as const;
export type Locale = (typeof locales)[number];
export type Language = Locale | 'en';
export const languageNames: Record<Language, string> = {
  en: 'English', fr: 'Français', it: 'Italiano', pt: 'Português',
  es: 'Español', ar: 'العربية', ru: 'Русский', de: 'Deutsch',
};
export const translatedTools = [
  'aspect-ratio-padding-calculator', 'css-flexbox-generator',
  'rgb-cmyk-image-checker', 'image-megapixel-calculator', 'print-bleed-calculator',
  'pdf-bleed-trim-checker', 'image-print-size-calculator',
  'image-file-size-estimator', 'photo-storage-calculator', 'image-bandwidth-calculator',
  'square-footage-calculator', 'cubic-yard-calculator',
  'roofing-shingle-calculator',
  'rafter-length-calculator',
  'stud-calculator',
  'drywall-mud-calculator',
  'roof-ridge-height-calculator',
  'fascia-replacement-cost-calculator',
  'ppi-calculator',
  'shed-ramp-angle-calculator',
  'construction-material-waste-calculator',
  'soffit-fascia-calculator',
  'attic-insulation-payback-calculator',
  'joist-deflection-calculator',
  'hvac-duct-cfm-calculator',
  'mortar-calculator',
  'concrete-block-calculator',
  'rainwater-harvesting-calculator',
  'dog-age-breed-specific-calculator',
  'puppy-growth-predictor',
  'cat-calorie-calculator',
  'caffeine-half-life-calculator',
  'hrv-baseline-deviation-calculator',
  'wilks-dots-powerlifting-calculator',
  'macronutrient-calculator',
  'running-pace-calculator',
  'hydration-calculator',
  'one-rep-max-calculator',
  'rental-property-cash-flow-calculator',
  'rental-yield-calculator',
  'cap-rate-calculator',
  'cash-on-cash-return-calculator',
  'brrrr-calculator',
  'fix-and-flip-profit-calculator',
  'short-term-rental-break-even-calculator',
  'house-hacking-effective-rent-calculator',
  'ai-token-calculator',
  'llm-api-cost-calculator',
  'gpu-compute-cost-calculator',
  'cloud-hosting-cost-calculator',
  'cdn-cost-calculator',
  'startup-runway-calculator',
  'saas-burn-rate-calculator',
  'ltv-cac-ratio-calculator',
  'cac-payback-calculator',
  'churn-impact-calculator',
  'rule-of-40-calculator',
  'net-revenue-retention-calculator',
  'drawdown-recovery-calculator',
  'meeting-roi-calculator',
  'ev-vs-gas-break-even-calculator',
  'heat-pump-vs-furnace-cost-calculator',
  'job-offer-total-comp-calculator',
  'lumpsum-investment-calculator',
  'savings-goal-calculator',
  'mortgage-affordability-calculator',
  'break-even-calculator',
  'profit-margin-markup-calculator',
  'css-gradient-generator', 'css-clamp-font-generator', 'image-scaling-calculator',
] as const;
export type TranslatedTool = (typeof translatedTools)[number];
export const isLocale = (value: string): value is Locale =>
  locales.some((locale) => locale === value);
export const isTranslatedTool = (value: string): value is TranslatedTool =>
  translatedTools.some((slug) => slug === value);
export const languageDirection = (locale: Language) => locale === 'ar' ? 'rtl' : 'ltr';
export function localizedPath(locale: Language, slug?: TranslatedTool) {
  return `${locale === 'en' ? '' : `/${locale}`}${slug ? `/tools/${slug}` : ''}` || '/';
}
export function languageAlternates(slug?: TranslatedTool) {
  return Object.fromEntries(['en', ...locales].map((locale) => [
    locale, `https://navorika.com${localizedPath(locale as Language, slug)}`,
  ]).concat([['x-default', `https://navorika.com${localizedPath('en', slug)}`]]));
}
