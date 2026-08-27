export type DiffKind = 'added' | 'removed' | 'changed' | 'unchanged';

export interface JsonDiffEntry {
  path: string;
  kind: DiffKind;
  before?: unknown;
  after?: unknown;
}

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

function walk(left: unknown, right: unknown, path: string, output: JsonDiffEntry[]) {
  if (Object.is(left, right)) {
    output.push({ path: path || '$', kind: 'unchanged', before: left, after: right });
    return;
  }
  if (Array.isArray(left) && Array.isArray(right)) {
    const length = Math.max(left.length, right.length);
    for (let index = 0; index < length; index += 1) {
      const child = `${path || '$'}[${index}]`;
      if (index >= left.length) output.push({ path: child, kind: 'added', after: right[index] });
      else if (index >= right.length) output.push({ path: child, kind: 'removed', before: left[index] });
      else walk(left[index], right[index], child, output);
    }
    return;
  }
  if (isObject(left) && isObject(right)) {
    const keys = new Set([...Object.keys(left), ...Object.keys(right)]);
    for (const key of keys) {
      const child = path ? `${path}.${key}` : `$.${key}`;
      if (!(key in left)) output.push({ path: child, kind: 'added', after: right[key] });
      else if (!(key in right)) output.push({ path: child, kind: 'removed', before: left[key] });
      else walk(left[key], right[key], child, output);
    }
    return;
  }
  output.push({ path: path || '$', kind: 'changed', before: left, after: right });
}

export function compareJson(left: unknown, right: unknown) {
  const entries: JsonDiffEntry[] = [];
  walk(left, right, '', entries);
  return {
    entries,
    added: entries.filter(({ kind }) => kind === 'added').length,
    removed: entries.filter(({ kind }) => kind === 'removed').length,
    changed: entries.filter(({ kind }) => kind === 'changed').length,
    unchanged: entries.filter(({ kind }) => kind === 'unchanged').length,
  };
}
