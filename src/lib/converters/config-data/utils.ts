export function extractErrorSnippet(
  text: string,
  lineNumber?: number,
  columnNumber?: number
): string | undefined {
  if (!lineNumber || lineNumber < 1) return undefined;
  const lines = text.split(/\r?\n/);
  const targetIdx = lineNumber - 1;
  if (targetIdx < 0 || targetIdx >= lines.length) return undefined;

  const start = Math.max(0, targetIdx - 1);
  const end = Math.min(lines.length - 1, targetIdx + 1);

  const snippetLines: string[] = [];
  for (let i = start; i <= end; i++) {
    const isTarget = i === targetIdx;
    const prefix = isTarget ? '> ' : '  ';
    const num = String(i + 1).padStart(4, ' ');
    snippetLines.push(`${prefix}${num} | ${lines[i]}`);
    if (isTarget && columnNumber && columnNumber > 0) {
      const indent = ' '.repeat(Math.max(0, columnNumber - 1) + 9);
      snippetLines.push(`${indent}^`);
    }
  }

  return snippetLines.join('\n');
}

export function sortObjectKeys(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sortObjectKeys);
  }
  if (value !== null && typeof value === 'object') {
    const sorted: Record<string, unknown> = {};
    const keys = Object.keys(value as Record<string, unknown>).sort();
    for (const key of keys) {
      sorted[key] = sortObjectKeys((value as Record<string, unknown>)[key]);
    }
    return sorted;
  }
  return value;
}

export function getByteSize(text: string): number {
  return new TextEncoder().encode(text).length;
}

export function getLineCount(text: string): number {
  if (!text) return 0;
  return text.split(/\r?\n/).length;
}
