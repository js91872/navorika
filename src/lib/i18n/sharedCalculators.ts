import { businessCalculatorConfigs, type ValueMap } from '@/lib/calculations/businessConfigs';

import type { LocalizedCalculatorSlug } from './calculatorRegistry';
import type { Dictionary } from './dictionaries';
import type { Locale } from './config';

export const isIntegerCalculatorField = (key: string) => ['widthPixels', 'heightPixels', 'channels', 'bitsPerChannel', 'imagesPerView', 'pageViews', 'quantity', 'extraStuds'].includes(key);

/** Reject missing, fractional count and out-of-range inputs before permissive engines can clamp them. */
export function calculateLocalizedValues(slug: LocalizedCalculatorSlug, values: ValueMap) {
  const config = businessCalculatorConfigs[slug];
  for (const field of config.fields) {
    const value = values[field.key];
    if (typeof value !== 'number' || !Number.isFinite(value) || Math.abs(value) > 1e12 ||
      (field.min !== undefined && value < field.min) || (field.max !== undefined && value > field.max) ||
      (isIntegerCalculatorField(field.key) && !Number.isInteger(value))) return null;
  }
  if (slug === 'image-file-size-estimator' && (Number(values.widthPixels) <= 0 || Number(values.heightPixels) <= 0)) return null;
  if (slug === 'photo-storage-calculator' && Number(values.averagePhotoMb) <= 0) return null;
  try {
    const result = config.calculate(values);
    return config.results.every(({ key, format }) => {
      const value = Reflect.get(result, key);
      if (key === 'slopePercent' && slug === 'shed-ramp-angle-calculator' && value === null) return true;
      if (format === 'text') return typeof value === 'string';
      return typeof value === 'number' && Number.isFinite(value) && Math.abs(value) <= Number.MAX_SAFE_INTEGER;
    }) ? result : null;
  } catch { return null; }
}

/** Native states derive from numeric inputs, never from translated/parsing English engine messages. */
export function calculatorTextFormatters(slug: LocalizedCalculatorSlug, values: ValueMap, d: Dictionary, locale: Locale): Record<string, (value: unknown) => string> {
  const number = new Intl.NumberFormat(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  if (slug === 'ppi-calculator') return { aspectMatch: () => {
    const imageRatio = Number(values.widthPixels) / Number(values.heightPixels);
    const printRatio = Number(values.printWidth) / Number(values.printHeight);
    const mismatch = Math.abs(imageRatio / printRatio - 1) * 100;
    return mismatch < 0.5 ? d.calculatorStates.matched : `${d.calculatorStates.mismatch} (~${number.format(mismatch)}%)`;
  } };
  if (slug === 'shed-ramp-angle-calculator') return { riseRunRatio: () => {
    const rise = Number(values.rise), run = Number(values.run);
    if (run === 0 && rise > 0) return `${d.calculatorStates.vertical} (1 : 0)`;
    if (rise === 0) return `${d.calculatorStates.flat} (0 : 1)`;
    return `1 : ${number.format(run / rise)}`;
  } };
  return {};
}

/** Preserve USD and percentage semantics while localizing numeric presentation and exports. */
export function formatCalculatorNumber(value: unknown, format: string, locale: Locale, notApplicable: string) {
  if (value === null || typeof value !== 'number' || !Number.isFinite(value)) return notApplicable;
  if (format === 'currency') return new Intl.NumberFormat(locale, { style: 'currency', currency: 'USD', currencyDisplay: 'code', maximumFractionDigits: 2 }).format(value);
  if (format === 'percent') return new Intl.NumberFormat(locale, { style: 'percent', maximumFractionDigits: 3 }).format(value / 100);
  return new Intl.NumberFormat(locale, { maximumFractionDigits: 3 }).format(value);
}
