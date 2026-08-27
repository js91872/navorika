export interface SchemaIssue { path: string; message: string }
type Schema = Record<string, unknown>;

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value);
const jsonEqual = (left: unknown, right: unknown) => JSON.stringify(left) === JSON.stringify(right);
const valueType = (value: unknown) => value === null ? 'null' : Array.isArray(value) ? 'array' : Number.isInteger(value) ? 'integer' : typeof value;

export function validateJsonSchema(data: unknown, schema: unknown): SchemaIssue[] {
  if (!isRecord(schema)) return [{ path: '$schema', message: 'Schema must be a JSON object.' }];
  const issues: SchemaIssue[] = [];

  const validate = (value: unknown, rule: Schema, path: string) => {
    const expected = rule.type;
    if (typeof expected === 'string') {
      const actual = valueType(value);
      const matches = expected === actual || (expected === 'number' && (actual === 'number' || actual === 'integer'));
      if (!matches) { issues.push({ path, message: `Expected ${expected}; received ${actual}.` }); return; }
    }
    if ('const' in rule && !jsonEqual(value, rule.const)) issues.push({ path, message: 'Value does not match const.' });
    if (Array.isArray(rule.enum) && !rule.enum.some((choice) => jsonEqual(choice, value))) issues.push({ path, message: 'Value is not one of the allowed enum values.' });
    if (typeof value === 'number') {
      if (typeof rule.minimum === 'number' && value < rule.minimum) issues.push({ path, message: `Must be at least ${rule.minimum}.` });
      if (typeof rule.maximum === 'number' && value > rule.maximum) issues.push({ path, message: `Must be at most ${rule.maximum}.` });
    }
    if (typeof value === 'string') {
      if (typeof rule.minLength === 'number' && value.length < rule.minLength) issues.push({ path, message: `Must contain at least ${rule.minLength} characters.` });
      if (typeof rule.maxLength === 'number' && value.length > rule.maxLength) issues.push({ path, message: `Must contain at most ${rule.maxLength} characters.` });
      if (typeof rule.pattern === 'string') {
        try { if (!new RegExp(rule.pattern).test(value)) issues.push({ path, message: `Must match /${rule.pattern}/.` }); }
        catch { issues.push({ path: '$schema.pattern', message: 'Pattern is not a valid regular expression.' }); }
      }
    }
    if (Array.isArray(value)) {
      if (typeof rule.minItems === 'number' && value.length < rule.minItems) issues.push({ path, message: `Must contain at least ${rule.minItems} items.` });
      if (typeof rule.maxItems === 'number' && value.length > rule.maxItems) issues.push({ path, message: `Must contain at most ${rule.maxItems} items.` });
      if (isRecord(rule.items)) value.forEach((item, index) => validate(item, rule.items as Schema, `${path}[${index}]`));
    }
    if (isRecord(value)) {
      const properties = isRecord(rule.properties) ? rule.properties : {};
      if (Array.isArray(rule.required)) for (const key of rule.required) if (typeof key === 'string' && !(key in value)) issues.push({ path: `${path}.${key}`, message: 'Required property is missing.' });
      for (const [key, item] of Object.entries(value)) {
        if (isRecord(properties[key])) validate(item, properties[key] as Schema, `${path}.${key}`);
        else if (rule.additionalProperties === false) issues.push({ path: `${path}.${key}`, message: 'Additional properties are not allowed.' });
      }
    }
    for (const keyword of ['allOf', 'anyOf', 'oneOf'] as const) {
      if (!Array.isArray(rule[keyword])) continue;
      const matches = rule[keyword].filter((candidate) => isRecord(candidate) && validateBranch(value, candidate)).length;
      if (keyword === 'allOf' && matches !== rule[keyword].length) issues.push({ path, message: 'Value does not satisfy every allOf schema.' });
      if (keyword === 'anyOf' && matches === 0) issues.push({ path, message: 'Value does not satisfy any anyOf schema.' });
      if (keyword === 'oneOf' && matches !== 1) issues.push({ path, message: `Value must satisfy exactly one oneOf schema; matched ${matches}.` });
    }
  };
  const validateBranch = (value: unknown, branch: Schema) => {
    const previous = issues.length;
    validate(value, branch, '$branch');
    const valid = issues.length === previous;
    issues.splice(previous);
    return valid;
  };
  validate(data, schema, '$');
  return issues;
}
