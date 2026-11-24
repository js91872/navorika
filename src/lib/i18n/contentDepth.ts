export type LocalizedToolCopy = {
  about?: string | string[];
  calculationMethod?: string | string[];
  steps?: string[];
  understandingResults?: string | string[];
  limits?: string | string[];
  faqs?: { question: string; answer: string }[];
};

function hasContent(value: unknown): boolean {
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.some(hasContent);
  return false;
}

function getFaqCount(value: unknown): number {
  return Array.isArray(value)
    ? value.filter((item) => item && typeof item === 'object' && hasContent((item as { question?: unknown }).question) && hasContent((item as { answer?: unknown }).answer)).length
    : 0;
}

function countWords(value: unknown): number {
  if (typeof value === 'string') return value.trim().split(/\s+/).filter(Boolean).length;
  if (Array.isArray(value)) return value.reduce((total, item) => total + countWords(item), 0);
  if (value && typeof value === 'object') return Object.values(value).reduce((total, item) => total + countWords(item), 0);
  return 0;
}

/** Only index translated tool pages when the copy is complete and substantial. */
export function hasIndexableLocalizedToolCopy(value: unknown): boolean {
  if (!value || typeof value !== 'object') return false;
  const copy = value as LocalizedToolCopy;
  const hasAllSections = [copy.about, copy.calculationMethod, copy.steps, copy.understandingResults, copy.limits].every(hasContent);
  const renderedBody = {
    about: copy.about,
    calculationMethod: copy.calculationMethod,
    steps: copy.steps,
    understandingResults: copy.understandingResults,
    limits: copy.limits,
    faqs: copy.faqs,
  };
  return hasAllSections && getFaqCount(copy.faqs) >= 3 && countWords(renderedBody) >= 350;
}
