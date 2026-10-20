import { businessCalculatorConfigs, type ValueMap } from '@/lib/calculations/businessConfigs';

import type { LocalizedCalculatorSlug } from './calculatorRegistry';
import type { Dictionary } from './dictionaries';
import type { Locale } from './config';

export const isIntegerCalculatorField = (key: string) => [
  'widthPixels', 'heightPixels', 'channels', 'bitsPerChannel', 'imagesPerView',
  'pageViews', 'quantity', 'extraStuds', 'unitCount', 'storageDays',
  'ageWeeks', 'timeHours', 'timeMinutes', 'timeSeconds', 'repetitions',
  'availableNights',
  'input', 'output', 'cached', 'requests', 'days', 'gpus', 'instances',
  'months', 'customers', 'newCustomers',
].includes(key);

/** Reject missing, fractional count and out-of-range inputs before permissive engines can clamp them. */
export function calculateLocalizedValues(slug: LocalizedCalculatorSlug, values: ValueMap) {
  const config = businessCalculatorConfigs[slug];
  for (const field of config.fields) {
    const value = values[field.key];
    if (field.options) {
      if (typeof value !== 'string' || !field.options.some((opt) => opt.value === value)) return null;
      continue;
    }
    if (typeof value !== 'number' || !Number.isFinite(value) || Math.abs(value) > 1e12 ||
      (field.min !== undefined && value < field.min) || (field.max !== undefined && value > field.max) ||
      (isIntegerCalculatorField(field.key) && !Number.isInteger(value))) return null;
  }
  if (slug === 'image-file-size-estimator' && (Number(values.widthPixels) <= 0 || Number(values.heightPixels) <= 0)) return null;
  if (slug === 'photo-storage-calculator' && Number(values.averagePhotoMb) <= 0) return null;
  if (slug === 'joist-deflection-calculator' && (Number(values.span) <= 0 || Number(values.width) <= 0 || Number(values.depth) <= 0 || Number(values.elasticModulus) <= 0)) return null;
  if (slug === 'hvac-duct-cfm-calculator') {
    if (values.ductShape === 'round' && Number(values.diameter) <= 0) return null;
    if (values.ductShape === 'rectangular' && (Number(values.width) <= 0 || Number(values.height) <= 0)) return null;
    if (Number(values.velocity) < 0) return null;
  }
  if (slug === 'mortar-calculator' && (Number(values.unitCount) <= 0 || Number(values.jointThicknessInches) <= 0 || Number(values.bagWeightLb) <= 0)) return null;
  if (slug === 'concrete-block-calculator' && (Number(values.wallLengthFt) <= 0 || Number(values.wallHeightFt) <= 0)) return null;
  if (slug === 'rainwater-harvesting-calculator' && (Number(values.catchmentAreaFt2) <= 0 || Number(values.annualRainfallInches) <= 0 || Number(values.storageDays) <= 0)) return null;
  if (slug === 'attic-insulation-payback-calculator' && Number(values.atticArea) <= 0) return null;
  if (slug === 'running-pace-calculator') {
    const totalSeconds = Number(values.timeHours) * 3600 + Number(values.timeMinutes) * 60 + Number(values.timeSeconds);
    if (totalSeconds <= 0) return null;
    if (values.raceDistancePreset === 'custom' && Number(values.distanceKm) <= 0) return null;
  }
  if (slug === 'caffeine-half-life-calculator' && Number(values.halfLifeHours) <= 0) return null;
  if (slug === 'hrv-baseline-deviation-calculator' && Number(values.baselineHrv) <= 0) return null;
  if (slug === 'wilks-dots-powerlifting-calculator' && (Number(values.bodyweightKg) <= 0 || Number(values.totalKg) < 0)) return null;
  if (slug === 'macronutrient-calculator' && (Number(values.dailyCalories) <= 0 || Number(values.bodyWeightKg) <= 0)) return null;
  if (slug === 'hydration-calculator' && Number(values.bodyWeightKg) <= 0) return null;
  if (slug === 'one-rep-max-calculator' && (Number(values.weightLifted) <= 0 || Number(values.repetitions) <= 0)) return null;
  if (slug === 'rental-yield-calculator' && Number(values.value) <= 0) return null;
  if (slug === 'cap-rate-calculator' && Number(values.value) <= 0) return null;
  if (slug === 'cash-on-cash-return-calculator' && (Number(values.down) + Number(values.closing) + Number(values.rehab) + Number(values.other) <= 0)) return null;
  if (slug === 'fix-and-flip-profit-calculator' && (Number(values.purchase) + Number(values.acquisition) + Number(values.rehab) + Number(values.financing) + Number(values.holding) + Number(values.other) <= 0)) return null;
  if (slug === 'short-term-rental-break-even-calculator' && Number(values.availableNights) <= 0) return null;
  if (slug === 'house-hacking-effective-rent-calculator' && (Number(values.mortgage) + Number(values.taxInsurance) + Number(values.hoa) + Number(values.utilities) + Number(values.maintenance) + Number(values.other) <= 0)) return null;
  if ((slug === 'ai-token-calculator' || slug === 'llm-api-cost-calculator') && Number(values.cached) > Number(values.input)) return null;
  if (slug === 'gpu-compute-cost-calculator' && (Number(values.gpus) < 1 || Number(values.days) < 1)) return null;
  if (slug === 'cloud-hosting-cost-calculator' && (Number(values.hours) > 744 || Number(values.hours) < 0)) return null;
  if (slug === 'cdn-cost-calculator' && Number(values.cacheHit) > 100) return null;
  if (slug === 'saas-burn-rate-calculator' && Number(values.months) < 1) return null;
  if (slug === 'churn-impact-calculator' && Number(values.months) < 1) return null;
  if (slug === 'net-revenue-retention-calculator' && Number(values.start) <= 0) return null;
  try {
    const result = config.calculate(values);
    return config.results.every(({ key, format }) => {
      const value = Reflect.get(result, key);
      if (value === null) {
        if (slug === 'shed-ramp-angle-calculator' && key === 'slopePercent') return true;
        if (slug === 'startup-runway-calculator' && (key === 'simpleRunwayMonths' || key === 'projectedRunwayMonths')) return true;
        if (slug === 'saas-burn-rate-calculator' && key === 'runwayMonths') return true;
        if (slug === 'ltv-cac-ratio-calculator' && (key === 'ltv' || key === 'ratio' || key === 'paybackMonths')) return true;
        if (slug === 'cac-payback-calculator' && key === 'paybackMonths') return true;
        if (slug === 'net-revenue-retention-calculator' && key === 'nrrPercent') return true;
        return false;
      }
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
  if (slug === 'joist-deflection-calculator') return { ratio: () => {
    const spanIn = Number(values.span) * 12;
    const spacingIn = Number(values.spacing);
    const lineLoadPli = (Number(values.uniformLoad) * (spacingIn / 12)) / 12;
    const momentOfInertia = (Number(values.width) * Math.pow(Number(values.depth), 3)) / 12;
    const e = Number(values.elasticModulus);
    if (spanIn > 0 && lineLoadPli > 0 && e > 0 && momentOfInertia > 0) {
      const delta = (5 * lineLoadPli * Math.pow(spanIn, 4)) / (384 * e * momentOfInertia);
      if (Number.isFinite(delta) && delta > 0) return `L / ${Math.round(spanIn / delta)}`;
    }
    return d.calculatorUi.notApplicable;
  } };
  if (slug === 'dog-age-breed-specific-calculator') return { lifeStage: () => {
    const age = Number(values.dogAge);
    const breedSize = String(values.breedSize || 'medium');
    if (!Number.isFinite(age) || age < 0) return d.calculatorUi.notApplicable;
    if (age < 1) return d.calculatorStates.puppy;
    if (age < 3) return d.calculatorStates.youngAdult;
    const seniorStart = breedSize === 'giant' ? 5 : breedSize === 'large' ? 6 : 7;
    const geriatricStart = breedSize === 'giant' ? 8 : breedSize === 'large' ? 9 : breedSize === 'medium' ? 10 : 11;
    if (age >= geriatricStart) return d.calculatorStates.geriatric;
    if (age >= seniorStart) return d.calculatorStates.senior;
    return d.calculatorStates.matureAdult;
  } };
  if (slug === 'hrv-baseline-deviation-calculator') return { direction: () => {
    const baseline = Number(values.baselineHrv);
    const current = Number(values.currentHrv);
    if (!Number.isFinite(baseline) || !Number.isFinite(current) || baseline <= 0 || current < 0) return d.calculatorUi.notApplicable;
    const diff = current - baseline;
    if (diff > 0.05) return d.calculatorStates.aboveBaseline;
    if (diff < -0.05) return d.calculatorStates.belowBaseline;
    return d.calculatorStates.equalToBaseline;
  } };
  if (slug === 'running-pace-calculator') return {
    pacePerKm: (val) => `${String(val).split(' ')[0]} ${d.calculatorStates.perKm}`,
    pacePerMile: (val) => `${String(val).split(' ')[0]} ${d.calculatorStates.perMile}`,
  };
  return {};
}

/** Preserve USD and percentage semantics while localizing numeric presentation and exports. */
export function formatCalculatorNumber(value: unknown, format: string, locale: Locale, notApplicable: string) {
  if (value === null || typeof value !== 'number' || !Number.isFinite(value)) return notApplicable;
  if (format === 'currency') return new Intl.NumberFormat(locale, { style: 'currency', currency: 'USD', currencyDisplay: 'code', maximumFractionDigits: 2 }).format(value);
  if (format === 'percent') return new Intl.NumberFormat(locale, { style: 'percent', maximumFractionDigits: 3 }).format(value / 100);
  if (format === 'months') return new Intl.NumberFormat(locale, { style: 'unit', unit: 'month', unitDisplay: 'long', maximumFractionDigits: 2 }).format(value);
  return new Intl.NumberFormat(locale, { maximumFractionDigits: 3 }).format(value);
}
