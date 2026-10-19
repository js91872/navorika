import { businessCalculatorConfigs, type ValueMap } from '@/lib/calculations/businessConfigs';

import type { LocalizedCalculatorSlug } from './calculatorRegistry';

/** Reject missing, fractional count and out-of-range inputs before permissive engines can clamp them. */
export function calculateLocalizedValues(slug: LocalizedCalculatorSlug, values: ValueMap) {
  const config = businessCalculatorConfigs[slug];
  for (const field of config.fields) {
    const value = values[field.key];
    if (typeof value !== 'number' || !Number.isFinite(value) || Math.abs(value) > 1e12 ||
      (field.min !== undefined && value < field.min) || (field.max !== undefined && value > field.max) ||
      (field.step === 1 && !Number.isInteger(value))) return null;
  }
  if (slug === 'image-file-size-estimator' && (Number(values.widthPixels) <= 0 || Number(values.heightPixels) <= 0)) return null;
  if (slug === 'photo-storage-calculator' && Number(values.averagePhotoMb) <= 0) return null;
  try {
    const result = config.calculate(values);
    return config.results.every(({ key }) => {
      const value = Reflect.get(result, key);
      return typeof value === 'number' && Number.isFinite(value) && Math.abs(value) <= Number.MAX_SAFE_INTEGER;
    }) ? result : null;
  } catch { return null; }
}
