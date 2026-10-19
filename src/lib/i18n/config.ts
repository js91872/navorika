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
