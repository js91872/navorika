export type JsonRecord = Record<string, unknown>;

export interface JsonToCsvOptions {
  separator: string;
  arrayMode: 'json' | 'join';
  arraySeparator: string;
}

export interface JsonToCsvResult {
  rows: JsonRecord[];
  headers: string[];
  csv: string;
}

function isObject(value: unknown): value is JsonRecord {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value)
  );
}

function flattenObject(
  value: JsonRecord,
  separator: string,
  arrayMode: JsonToCsvOptions['arrayMode'],
  arraySeparator: string,
  prefix = '',
  result: JsonRecord = {},
): JsonRecord {
  Object.entries(value).forEach(([key, child]) => {
    const outputKey = prefix
      ? `${prefix}${separator}${key}`
      : key;

    if (isObject(child)) {
      flattenObject(
        child,
        separator,
        arrayMode,
        arraySeparator,
        outputKey,
        result,
      );
      return;
    }

    if (Array.isArray(child)) {
      result[outputKey] =
        arrayMode === 'join'
          ? child
              .map((item) =>
                isObject(item) || Array.isArray(item)
                  ? JSON.stringify(item)
                  : String(item ?? ''),
              )
              .join(arraySeparator)
          : JSON.stringify(child);

      return;
    }

    result[outputKey] = child ?? '';
  });

  return result;
}

function escapeCsv(value: unknown): string {
  const text =
    typeof value === 'string'
      ? value
      : value === null || value === undefined
        ? ''
        : String(value);

  if (
    text.includes(',') ||
    text.includes('"') ||
    text.includes('\n') ||
    text.includes('\r')
  ) {
    return `"${text.replace(/"/g, '""')}"`;
  }

  return text;
}

export function convertJsonToCsv(
  input: string,
  options: JsonToCsvOptions,
): JsonToCsvResult {
  const parsed: unknown = JSON.parse(input);

  const sourceRows = Array.isArray(parsed)
    ? parsed
    : [parsed];

  if (
    sourceRows.some(
      (row) => !isObject(row),
    )
  ) {
    throw new Error(
      'JSON must contain an object or an array of objects.',
    );
  }

  const rows = sourceRows.map((row) =>
    flattenObject(
      row as JsonRecord,
      options.separator,
      options.arrayMode,
      options.arraySeparator,
    ),
  );

  const headers = Array.from(
    new Set(
      rows.flatMap((row) => Object.keys(row)),
    ),
  );

  const csvLines = [
    headers.map(escapeCsv).join(','),
    ...rows.map((row) =>
      headers
        .map((header) => escapeCsv(row[header]))
        .join(','),
    ),
  ];

  return {
    rows,
    headers,
    csv: csvLines.join('\n'),
  };
}
