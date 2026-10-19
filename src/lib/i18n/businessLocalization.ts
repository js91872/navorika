import { businessCalculatorConfigs } from '@/lib/calculations/businessConfigs';

type FieldCopy = { label: string; help?: string; placeholder?: string; options?: Record<string, string> };
export interface BusinessCalculatorCopy {
  fields: Record<string, FieldCopy>;
  results: Record<string, string>;
  note: string;
  /** Every text result needs an explicit decision; protocol/code output stays unchanged. */
  textResults: Record<string, 'machine' | 'localized'>;
}
// JSON imports widen string literals; validate the serialized classification before use.
type SerializedBusinessCalculatorCopy = Omit<BusinessCalculatorCopy, 'textResults'> & { textResults: Record<string, string> };
const requiredText = (value: unknown, path: string) => {
  if (typeof value !== 'string' || !value.trim()) throw new Error(`Missing translation: ${path}`);
  return value;
};
const exactKeys = (actual: object, expected: string[], path: string) => {
  const keys = Object.keys(actual).sort();
  if (JSON.stringify(keys) !== JSON.stringify([...expected].sort())) throw new Error(`Translation keys do not match source: ${path}`);
};

/** Reject incomplete dictionaries instead of silently mixing English into a tool. */
export function localizeBusinessCalculator(slug: string, copy: SerializedBusinessCalculatorCopy, formatText: Record<string, (value: unknown) => string> = {}) {
  const source = businessCalculatorConfigs[slug];
  if (!source) throw new Error(`Unknown calculator: ${slug}`);
  exactKeys(copy.fields, source.fields.map((field) => field.key), `${slug}/fields`);
  exactKeys(copy.results, source.results.map((result) => result.key), `${slug}/results`);
  const textKeys = source.results.filter((result) => result.format === 'text').map((result) => result.key);
  exactKeys(copy.textResults, textKeys, `${slug}/textResults`);
  for (const key of textKeys) {
    if (!['machine', 'localized'].includes(copy.textResults[key])) throw new Error(`Classify text output: ${slug}/${key}`);
    if (copy.textResults[key] === 'localized' && typeof formatText[key] !== 'function') throw new Error(`Missing native result formatter: ${slug}/${key}`);
  }
  const fields = source.fields.map((field) => {
    const native = copy.fields[field.key];
    const path = `${slug}/${field.key}`;
    if (field.options) exactKeys(native.options ?? {}, field.options.map((option) => option.value), `${path}/options`);
    return {
      ...field,
      label: requiredText(native.label, `${path}/label`),
      help: field.help ? requiredText(native.help, `${path}/help`) : undefined,
      placeholder: field.placeholder ? requiredText(native.placeholder, `${path}/placeholder`) : undefined,
      options: field.options?.map((option) => ({ value: option.value, label: requiredText(native.options?.[option.value], `${path}/${option.value}`) })),
    };
  });
  return {
    ...source, fields,
    results: source.results.map((result) => ({ ...result, label: requiredText(copy.results[result.key], `${slug}/${result.key}/result`) })),
    note: requiredText(copy.note, `${slug}/note`),
    formatTextResult(key: string, value: unknown) {
      if (!textKeys.includes(key)) throw new Error(`Not a declared text result: ${slug}/${key}`);
      if (copy.textResults[key] === 'machine') return String(value ?? '');
      return requiredText(formatText[key](value), `${slug}/${key}/formattedResult`);
    },
  };
}
